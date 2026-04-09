import http.server, socketserver, os, re

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

    urls = []

    # Static pages
    static_pages = [
        ('/', '1.0', 'daily'),
        ('/about.html', '0.5', 'monthly'),
        ('/contact.html', '0.5', 'monthly'),
        ('/privacy.html', '0.3', 'monthly'),
    ]
    for path, priority, freq in static_pages:
        urls.append(f"""  <url>
    <loc>{base}{path}</loc>
    <changefreq>{freq}</changefreq>
    <priority>{priority}</priority>
  </url>""")

    # City pages
    for city_id in city_ids:
        urls.append(f"""  <url>
    <loc>{base}/time.html?city={city_id}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>""")

    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sitemap += '\n'.join(urls)
    sitemap += '\n</urlset>'
    return sitemap

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
    }

    def do_GET(self):
        if self.path == '/sitemap.xml':
            sitemap = generate_sitemap().encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/xml; charset=utf-8')
            self.send_header('Content-Length', len(sitemap))
            self.end_headers()
            self.wfile.write(sitemap)
        elif self.path == '/ads.txt':
            try:
                with open('ads.txt', 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'text/plain')
                self.send_header('Content-Length', len(content))
                self.end_headers()
                self.wfile.write(content)
            except FileNotFoundError:
                self.send_error(404)
        else:
            super().do_GET()

    def log_message(self, format, *args):
        pass  # Suppress logs for cleaner Railway output

with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print(f"Serving on port {PORT}")
    httpd.serve_forever()
