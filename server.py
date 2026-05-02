import http.server, socketserver, os, re, urllib.parse
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
