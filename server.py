import http.server, socketserver, os, re, urllib.parse, json, time
import urllib.request
from datetime import date

PORT = int(os.environ.get("PORT", 8080))

# Read city IDs dynamically from app.js
def get_city_ids():
    try:
        with open('app.js', 'r') as f:
            content = f.read()
        # Extract all city id values from the CITIES array
        ids = re.findall(r"\{\s*id:\s*'([^']+)'", content)
        return ids
    except:
        return []

def generate_sitemap():
    base = 'https://www.thetimesphere.com'
    city_ids = get_city_ids()
    today = date.today().isoformat()

    urls = []

    # Static pages — clean URLs
    static_pages = [
        ('/', '1.0', 'daily'),
        ('/moving-to/', '0.8', 'weekly'),
        ('/about', '0.5', 'monthly'),
        ('/contact', '0.5', 'monthly'),
        ('/privacy', '0.3', 'monthly'),
    ]
    for path, priority, freq in static_pages:
        urls.append(f"""  <url>
    <loc>{base}{path}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>{freq}</changefreq>
    <priority>{priority}</priority>
  </url>""")

    # City time pages — clean URLs
    for city_id in city_ids:
        urls.append(f"""  <url>
    <loc>{base}/time/{city_id}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>""")

    # Moving-to pages — one per city
    for city_id in city_ids:
        urls.append(f"""  <url>
    <loc>{base}/moving-to/{city_id}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>""")

    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sitemap += '\n'.join(urls)
    sitemap += '\n</urlset>'
    return sitemap

# ── API key cache (in-memory, 1-hour TTL) ─────────────────────────────────────
_api_cache = {}
CACHE_TTL = 3600

def _cached(key, fetch_fn):
    now = time.time()
    entry = _api_cache.get(key)
    if entry and now < entry['exp']:
        return entry['data']
    data = fetch_fn()
    _api_cache[key] = {'data': data, 'exp': now + CACHE_TTL}
    return data

def _slug_to_name(slug):
    """Convert city-slug to Title Case city name for API queries."""
    return slug.replace('-', ' ').title()

def _fetch_ticketmaster(city_name):
    """Ticketmaster Discovery API — free tier, 5000 calls/day.
    Key: developer.ticketmaster.com → 'My Apps' → 'API Key'
    Env var: TICKETMASTER_API_KEY"""
    api_key = os.environ.get('TICKETMASTER_API_KEY', 'oU45aN6HSWpgHLNGHJNJe7tz0870uGGj')
    url = ('https://app.ticketmaster.com/discovery/v2/events.json'
           '?city=' + urllib.parse.quote(city_name) +
           '&size=3&sort=date%2Casc&apikey=' + api_key)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'TimeSphere/1.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode())
        events = data.get('_embedded', {}).get('events', [])
        out = []
        for ev in events[:3]:
            imgs = sorted(ev.get('images', []), key=lambda x: x.get('width', 0), reverse=True)
            venues = ev.get('_embedded', {}).get('venues', [{}])
            out.append({
                'name':   ev.get('name', ''),
                'date':   ev.get('dates', {}).get('start', {}).get('localDate', ''),
                'venue':  venues[0].get('name', '') if venues else '',
                'image':  imgs[0]['url'] if imgs else '',
                'url':    ev.get('url', ''),
                'source': 'ticketmaster',
            })
        return out
    except Exception:
        return []

def _fetch_eventbrite(city_name):
    """Eventbrite API — free public token, 1000 calls/hour.
    Key: eventbrite.com/account-settings/apps → 'Create API Key'
    Env var: EVENTBRITE_API_KEY"""
    api_key = os.environ.get('EVENTBRITE_API_KEY', 'SBQORL5REUVO342LNKQ5')
    url = ('https://www.eventbriteapi.com/v3/events/search/'
           '?location.address=' + urllib.parse.quote(city_name) +
           '&expand=venue,logo&sort_by=date&token=' + api_key)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'TimeSphere/1.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode())
        events = data.get('events', [])
        out = []
        for ev in events[:3]:
            logo = ev.get('logo') or {}
            orig = logo.get('original') or {}
            venue = ev.get('venue') or {}
            out.append({
                'name':   (ev.get('name') or {}).get('text', ''),
                'date':   (ev.get('start') or {}).get('local', '')[:10],
                'venue':  venue.get('name', ''),
                'image':  orig.get('url', ''),
                'url':    ev.get('url', ''),
                'source': 'eventbrite',
            })
        return out
    except Exception:
        return []

def _fetch_viator(city_name):
    """Viator Partner API — requires separate partner API key (different from affiliate pid).
    Key: partnerapi.viator.com → request access at partners.viator.com
    Env var: VIATOR_API_KEY
    POST https://api.viator.com/partner/products/search"""
    api_key = os.environ.get('VIATOR_API_KEY', '8ff2c7b5-700a-4366-aa99-4f9c32b653ee')
    payload = json.dumps({
        'filtering': {'destination': city_name},
        'sorting':   {'sort': 'TRAVELER_RATING', 'order': 'DESCENDING'},
        'pagination': {'start': 1, 'count': 3},
        'currency':  'USD',
    }).encode()
    try:
        req = urllib.request.Request(
            'https://api.viator.com/partner/products/search',
            data=payload, method='POST')
        req.add_header('Content-Type', 'application/json')
        req.add_header('exp-api-key', api_key)
        req.add_header('Accept', 'application/json;version=2.0')
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode())
        products = data.get('products', [])
        out = []
        for p in products[:3]:
            imgs = p.get('images', [])
            img_url = ''
            if imgs:
                variants = imgs[0].get('variants', [])
                img_url = variants[0].get('url', '') if variants else ''
            code = p.get('productCode', '')
            out.append({
                'name':   p.get('title', ''),
                'rating': (p.get('reviews') or {}).get('combinedAverageRating', 0),
                'price':  (p.get('pricing', {}).get('summary') or {}).get('fromPrice', ''),
                'image':  img_url,
                'url':    'https://www.viator.com/tours/' + code + '?pid=P00295924&mcid=42383',
            })
        return out
    except Exception:
        return []

def _json_response(handler, data):
    body = json.dumps(data).encode()
    handler.send_response(200)
    handler.send_header('Content-Type', 'application/json; charset=utf-8')
    handler.send_header('Content-Length', len(body))
    handler.send_header('Cache-Control', 'public, max-age=3600')
    handler.end_headers()
    if handler.command != 'HEAD':
        handler.wfile.write(body)

def serve_html(handler, filepath):
    try:
        with open(filepath, 'rb') as f:
            content = f.read()
        handler.send_response(200)
        handler.send_header('Content-Type', 'text/html; charset=utf-8')
        handler.send_header('Content-Length', len(content))
        handler.end_headers()
        if handler.command != 'HEAD':
            handler.wfile.write(content)
    except FileNotFoundError:
        handler.send_error(404)

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
    }

    def _send_redirect(self, location):
        self.send_response(301)
        self.send_header('Location', location)
        self.end_headers()

    def _handle_request(self):
        """Shared routing for GET and HEAD. Returns True if the request was handled."""
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        qs = urllib.parse.parse_qs(parsed.query)
        city = qs.get('city', [''])[0]

        # ── Legacy 301 redirects — registered FIRST, before any 200 handler ──
        # These fire for both GET and HEAD so Google's redirect checks work.

        # /time.html or /time.html?city=X  (root-level legacy URL)
        if path == '/time.html':
            self._send_redirect(f'/time/{city}' if city else '/time')
            return True

        # /time/time.html or /time/time.html?city=X  (relative-link concatenation bug)
        if path == '/time/time.html':
            self._send_redirect(f'/time/{city}' if city else '/time')
            return True

        # /moving-to.html or /moving-to.html?city=X
        if path == '/moving-to.html':
            self._send_redirect(f'/moving-to/{city}' if city else '/moving-to/')
            return True

        # /moving-to/moving-to.html or /moving-to/moving-to.html?city=X
        if path == '/moving-to/moving-to.html':
            self._send_redirect(f'/moving-to/{city}' if city else '/moving-to/')
            return True

        # ── Clean city URL: /time/{slug} ──────────────────────────────────────
        if re.match(r'^/time/[a-z0-9][a-z0-9-]*$', path):
            serve_html(self, 'time.html')
            return True

        # ── Moving-to index: /moving-to or /moving-to/ ────────────────────────
        if path in ('/moving-to', '/moving-to/'):
            serve_html(self, 'moving-to-index.html')
            return True

        # ── Moving-to city URL: /moving-to/{slug} ─────────────────────────────
        m = re.match(r'^/moving-to/([a-z0-9][a-z0-9-]*)$', path)
        if m:
            slug = m.group(1)
            if slug in get_city_ids():
                serve_html(self, 'moving-to.html')
            else:
                self.send_error(404, 'City not found')
            return True

        # ── Sitemap ───────────────────────────────────────────────────────────
        if path == '/sitemap.xml':
            sitemap = generate_sitemap().encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/xml; charset=utf-8')
            self.send_header('Content-Length', len(sitemap))
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(sitemap)
            return True

        # ── Ads.txt ───────────────────────────────────────────────────────────
        if path == '/ads.txt':
            try:
                with open('ads.txt', 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'text/plain')
                self.send_header('Content-Length', len(content))
                self.end_headers()
                if self.command != 'HEAD':
                    self.wfile.write(content)
            except FileNotFoundError:
                self.send_error(404)
            return True

        # ── Static clean routes (no .html extension) ──────────────────────────
        if path == '/about':
            serve_html(self, 'about.html')
            return True
        if path == '/contact':
            serve_html(self, 'contact.html')
            return True
        if path == '/privacy':
            serve_html(self, 'privacy.html')
            return True

        # ── API: Events (Ticketmaster + Eventbrite, cached 1h) ───────────────
        if path == '/api/events':
            slug = qs.get('city', [''])[0]
            city_name = _slug_to_name(slug) if slug else ''
            if not city_name:
                _json_response(self, {'events': []})
                return True
            def _fetch_events():
                tm = _fetch_ticketmaster(city_name)
                eb = _fetch_eventbrite(city_name)
                return (tm + eb)[:6]
            events = _cached('events:' + slug, _fetch_events)
            _json_response(self, {'events': events})
            return True

        # ── API: Experiences (Viator partner API, cached 1h) ─────────────────
        if path == '/api/experiences':
            slug = qs.get('city', [''])[0]
            city_name = _slug_to_name(slug) if slug else ''
            if not city_name:
                _json_response(self, {'experiences': []})
                return True
            exps = _cached('exps:' + slug, lambda: _fetch_viator(city_name))
            _json_response(self, {'experiences': exps})
            return True

        return False  # fall through to SimpleHTTPRequestHandler

    def do_GET(self):
        if not self._handle_request():
            super().do_GET()

    def do_HEAD(self):
        if not self._handle_request():
            super().do_HEAD()

    def log_message(self, format, *args):
        pass  # Suppress logs for cleaner Railway output

with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print(f"Serving on port {PORT}")
    httpd.serve_forever()
