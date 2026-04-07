import http.server, socketserver, os
PORT = int(os.environ.get("PORT", 8080))
Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map.update({'.html':'text/html','.css':'text/css','.js':'application/javascript'})
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving on port {PORT}")
    httpd.serve_forever()
