import http.server, socketserver, os, re, urllib.parse, json, time
import urllib.request
from datetime import date

try:
    import stripe as _stripe_module
    _stripe_module.api_key = os.environ.get('STRIPE_SECRET_KEY', '')
    stripe = _stripe_module
    STRIPE_OK = bool(stripe.api_key)
except ImportError:
    stripe = None
    STRIPE_OK = False

PORT = int(os.environ.get("PORT", 8080))

# ── Stripe price tier helpers ──────────────────────────────────────────────────
_PRICE_PRO_MONTHLY  = 'price_1Tv1JKBjMZ2hkqTMfzHkMIhS'
_PRICE_PRO_ANNUAL   = 'price_1Tv1JuBjMZ2hkqTMrKQjFYbX'
_PRICE_ELITE_MONTHLY = 'price_1Tv1JvBjMZ2hkqTMHyaaUNgW'
_PRICE_ELITE_ANNUAL  = 'price_1Tv1JwBjMZ2hkqTMxcM2z9M7'

def _get_pro_prices():
    return [
        os.environ.get('STRIPE_PRO_MONTHLY_PRICE_ID', _PRICE_PRO_MONTHLY),
        os.environ.get('STRIPE_PRO_ANNUAL_PRICE_ID',  _PRICE_PRO_ANNUAL),
    ]

def _get_elite_prices():
    return [
        os.environ.get('STRIPE_ELITE_MONTHLY_PRICE_ID', _PRICE_ELITE_MONTHLY),
        os.environ.get('STRIPE_ELITE_ANNUAL_PRICE_ID',  _PRICE_ELITE_ANNUAL),
    ]

def _get_trial_days(price_id):
    if not price_id:
        return 0
    if price_id in _get_pro_prices():
        return 7
    if price_id in _get_elite_prices():
        return 14
    return 0

def _tier_from_price(price_id):
    if price_id in _get_pro_prices():
        return 'pro'
    if price_id in _get_elite_prices():
        return 'elite'
    return 'free'

# ── City IDs ───────────────────────────────────────────────────────────────────
def get_city_ids():
    try:
        with open('app.js', 'r') as f:
            content = f.read()
        ids = re.findall(r"\{\s*id:\s*'([^']+)'", content)
        return ids
    except:
        return []

# ── Sitemap ────────────────────────────────────────────────────────────────────
def generate_sitemap():
    base = 'https://www.thetimesphere.com'
    city_ids = get_city_ids()
    today = date.today().isoformat()

    urls = []
    static_pages = [
        ('/', '1.0', 'daily'),
        ('/moving-to/', '0.8', 'weekly'),
        ('/upgrade', '0.6', 'monthly'),
        ('/about', '0.5', 'monthly'),
        ('/contact', '0.5', 'monthly'),
        ('/privacy', '0.3', 'monthly'),
        ('/blog', '0.7', 'weekly'),
        ('/blog/moving-to-houston-guide', '0.7', 'weekly'),
        ('/blog/best-time-to-visit-new-york', '0.7', 'weekly'),
        ('/blog/moving-to-austin-guide', '0.7', 'weekly'),
        ('/blog/world-time-zones-for-remote-workers', '0.7', 'weekly'),
        ('/blog/moving-to-miami-guide', '0.7', 'weekly'),
        ('/blog/best-cities-for-digital-nomads-2026', '0.7', 'weekly'),
    ]
    for path, priority, freq in static_pages:
        urls.append(f"""  <url>
    <loc>{base}{path}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>{freq}</changefreq>
    <priority>{priority}</priority>
  </url>""")

    for city_id in city_ids:
        urls.append(f"""  <url>
    <loc>{base}/time/{city_id}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>""")

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
    return slug.replace('-', ' ').title()

def _fetch_ticketmaster(city_name):
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

def _fetch_viator(city_name):
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

# ── Response helpers ───────────────────────────────────────────────────────────
def _json_response(handler, data, cache_max_age=3600):
    body = json.dumps(data).encode()
    handler.send_response(200)
    handler.send_header('Content-Type', 'application/json; charset=utf-8')
    handler.send_header('Content-Length', len(body))
    if cache_max_age > 0:
        handler.send_header('Cache-Control', f'public, max-age={cache_max_age}')
    else:
        handler.send_header('Cache-Control', 'no-store')
    handler.end_headers()
    if handler.command != 'HEAD':
        handler.wfile.write(body)

def _json_error(handler, code, message):
    body = json.dumps({'error': message}).encode()
    handler.send_response(code)
    handler.send_header('Content-Type', 'application/json; charset=utf-8')
    handler.send_header('Content-Length', len(body))
    handler.send_header('Cache-Control', 'no-store')
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

# ── Stripe helpers ─────────────────────────────────────────────────────────────
def _stripe_customer_id_by_email(email):
    """Find a Stripe customer ID by email. Returns '' if not found."""
    try:
        results = stripe.Customer.search(query=f'email:"{email}"', limit=1)
        data = results.get('data', [])
        return data[0]['id'] if data else ''
    except Exception:
        return ''

def _active_tier_for_customer(customer_id):
    """Return 'pro', 'elite', or 'free' for a Stripe customer."""
    try:
        subs = stripe.Subscription.list(customer=customer_id, status='active', limit=5)
        for sub in subs.get('data', []):
            items = sub.get('items', {}).get('data', [])
            for item in items:
                pid = (item.get('price') or {}).get('id', '')
                t = _tier_from_price(pid)
                if t != 'free':
                    return t
    except Exception:
        pass
    return 'free'

# ── Main request handler ───────────────────────────────────────────────────────
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

    def _handle_get_head(self):
        """Routing for GET and HEAD. Returns True if handled."""
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        qs = urllib.parse.parse_qs(parsed.query)

        # ── Legacy 301 redirects ──────────────────────────────────────────────
        city = qs.get('city', [''])[0]
        if path == '/time.html':
            self._send_redirect(f'/time/{city}' if city else '/time')
            return True
        if path == '/time/time.html':
            self._send_redirect(f'/time/{city}' if city else '/time')
            return True
        if path == '/moving-to.html':
            self._send_redirect(f'/moving-to/{city}' if city else '/moving-to/')
            return True
        if path == '/moving-to/moving-to.html':
            self._send_redirect(f'/moving-to/{city}' if city else '/moving-to/')
            return True

        # ── City time page ────────────────────────────────────────────────────
        if re.match(r'^/time/[a-z0-9][a-z0-9-]*$', path):
            serve_html(self, 'time.html')
            return True

        # ── Moving-to index ───────────────────────────────────────────────────
        if path in ('/moving-to', '/moving-to/'):
            serve_html(self, 'moving-to-index.html')
            return True

        # ── Moving-to city page ───────────────────────────────────────────────
        m = re.match(r'^/moving-to/([a-z0-9][a-z0-9-]*)$', path)
        if m:
            slug = m.group(1)
            if slug in get_city_ids():
                serve_html(self, 'moving-to.html')
            else:
                self.send_error(404, 'City not found')
            return True

        # ── Upgrade pages ─────────────────────────────────────────────────────
        if path == '/upgrade':
            serve_html(self, 'upgrade.html')
            return True
        if path == '/upgrade/success':
            serve_html(self, 'upgrade-success.html')
            return True

        # ── Account page ──────────────────────────────────────────────────────
        if path == '/account':
            serve_html(self, 'account.html')
            return True

        # ── Static clean routes ───────────────────────────────────────────────
        if path == '/about':
            serve_html(self, 'about.html')
            return True
        if path == '/contact':
            serve_html(self, 'contact.html')
            return True
        if path == '/privacy':
            serve_html(self, 'privacy.html')
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

        # ── GET /api/config ───────────────────────────────────────────────────
        if path == '/api/config':
            config = {
                'clerkPublishableKey': os.environ.get('CLERK_PUBLISHABLE_KEY', ''),
                'stripe': {
                    'proMonthly':    os.environ.get('STRIPE_PRO_MONTHLY_PRICE_ID',  _PRICE_PRO_MONTHLY),
                    'proAnnual':     os.environ.get('STRIPE_PRO_ANNUAL_PRICE_ID',   _PRICE_PRO_ANNUAL),
                    'eliteMonthly':  os.environ.get('STRIPE_ELITE_MONTHLY_PRICE_ID', _PRICE_ELITE_MONTHLY),
                    'eliteAnnual':   os.environ.get('STRIPE_ELITE_ANNUAL_PRICE_ID',  _PRICE_ELITE_ANNUAL),
                },
            }
            _json_response(self, config, cache_max_age=0)
            return True

        # ── GET /api/events ───────────────────────────────────────────────────
        if path == '/api/events':
            slug = qs.get('city', [''])[0]
            city_name = _slug_to_name(slug) if slug else ''
            if not city_name:
                _json_response(self, {'events': []})
                return True
            events = _cached('events:' + slug, lambda: _fetch_ticketmaster(city_name))
            _json_response(self, {'events': events})
            return True

        # ── GET /api/experiences ──────────────────────────────────────────────
        if path == '/api/experiences':
            slug = qs.get('city', [''])[0]
            city_name = _slug_to_name(slug) if slug else ''
            if not city_name:
                _json_response(self, {'experiences': []})
                return True
            exps = _cached('exps:' + slug, lambda: _fetch_viator(city_name))
            _json_response(self, {'experiences': exps})
            return True

        # ── GET /api/upgrade/verify ───────────────────────────────────────────
        if path == '/api/upgrade/verify':
            if not STRIPE_OK:
                _json_error(self, 503, 'Stripe not configured')
                return True
            session_id = qs.get('session_id', [''])[0]
            if not session_id:
                _json_error(self, 400, 'Missing session_id')
                return True
            try:
                session = stripe.checkout.Session.retrieve(
                    session_id, expand=['subscription'])
                sub = session.get('subscription') or {}
                price_id = ''
                if sub and isinstance(sub, dict):
                    items = (sub.get('items') or {}).get('data', [])
                    if items:
                        price_id = (items[0].get('price') or {}).get('id', '')
                tier = _tier_from_price(price_id)
                _json_response(self, {
                    'tier':   tier,
                    'email':  session.get('customer_email', ''),
                    'status': (sub.get('status', '') if sub else session.get('status', '')),
                }, cache_max_age=0)
            except Exception as e:
                _json_error(self, 500, str(e))
            return True

        # ── GET /api/upgrade/status ───────────────────────────────────────────
        if path == '/api/upgrade/status':
            if not STRIPE_OK:
                _json_response(self, {'tier': 'free'}, cache_max_age=0)
                return True
            email = qs.get('email', [''])[0]
            if not email:
                _json_response(self, {'tier': 'free'}, cache_max_age=0)
                return True
            try:
                customer_id = _stripe_customer_id_by_email(email)
                if not customer_id:
                    _json_response(self, {'tier': 'free', 'email': email}, cache_max_age=0)
                    return True
                tier = _active_tier_for_customer(customer_id)
                _json_response(self, {'tier': tier, 'email': email}, cache_max_age=0)
            except Exception:
                _json_response(self, {'tier': 'free', 'email': email}, cache_max_age=0)
            return True

        return False

    def do_GET(self):
        if not self._handle_get_head():
            super().do_GET()

    def do_HEAD(self):
        if not self._handle_get_head():
            super().do_HEAD()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get('Content-Length', 0))
        raw_body = self.rfile.read(content_length) if content_length else b'{}'
        try:
            data = json.loads(raw_body)
        except Exception:
            data = {}

        # ── POST /api/upgrade/checkout ────────────────────────────────────────
        if path == '/api/upgrade/checkout':
            if not STRIPE_OK:
                _json_error(self, 503, 'Stripe not configured')
                return
            price_id = data.get('priceId', '')
            if not price_id:
                _json_error(self, 400, 'Missing priceId')
                return
            try:
                trial_days = _get_trial_days(price_id)
                base_url = 'https://www.thetimesphere.com'
                success_url = data.get('successUrl',
                    base_url + '/upgrade/success?session_id={CHECKOUT_SESSION_ID}')
                cancel_url = data.get('cancelUrl', base_url + '/upgrade')
                params = {
                    'mode': 'subscription',
                    'payment_method_types': ['card'],
                    'line_items': [{'price': price_id, 'quantity': 1}],
                    'allow_promotion_codes': True,
                    'success_url': success_url,
                    'cancel_url': cancel_url,
                }
                if trial_days:
                    params['subscription_data'] = {'trial_period_days': trial_days}
                user_email = data.get('userEmail', '')
                if user_email:
                    params['customer_email'] = user_email
                session = stripe.checkout.Session.create(**params)
                _json_response(self, {'url': session.url}, cache_max_age=0)
            except Exception as e:
                _json_error(self, 500, str(e))
            return

        # ── POST /api/upgrade/portal ──────────────────────────────────────────
        if path == '/api/upgrade/portal':
            if not STRIPE_OK:
                _json_error(self, 503, 'Stripe not configured')
                return
            email = data.get('email', '')
            if not email:
                _json_error(self, 400, 'Missing email')
                return
            try:
                customer_id = _stripe_customer_id_by_email(email)
                if not customer_id:
                    _json_error(self, 404, 'No Stripe customer found for this email')
                    return
                return_url = data.get('returnUrl', 'https://www.thetimesphere.com/account')
                portal = stripe.billing_portal.Session.create(
                    customer=customer_id,
                    return_url=return_url,
                )
                _json_response(self, {'url': portal.url}, cache_max_age=0)
            except Exception as e:
                _json_error(self, 500, str(e))
            return

        _json_error(self, 404, 'Not found')

    def log_message(self, format, *args):
        pass

with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print(f"Serving on port {PORT}")
    httpd.serve_forever()
