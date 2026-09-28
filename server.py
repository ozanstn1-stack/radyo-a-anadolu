#!/usr/bin/env python3
"""
Radyo A (Anadolu Üniversitesi 100.5 FM)
Yerel Geliştirme ve Önizleme Sunucusu
"""

import http.server
import socketserver
import os
import sys
import webbrowser

PORT = 3000

class RadyoAHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Medya ve ES6 modül uyumluluğu için CORS başlıkları
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def guess_type(self, path):
        if path.endswith('.js'):
            return 'text/javascript'
        if path.endswith('.css'):
            return 'text/css'
        if path.endswith('.svg'):
            return 'image/svg+xml'
        return super().guess_type(path)

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    handler = RadyoAHandler

    for port_attempt in range(PORT, PORT + 20):
        try:
            with socketserver.TCPServer(("", port_attempt), handler) as httpd:
                url = f"http://localhost:{port_attempt}"
                print("=" * 65)
                print(f"  📻 RADYO A • 100.5 FM | Anadolu Üniversitesi Web Platformu")
                print("=" * 65)
                print(f"  🌐 Yerel Sunucu Adresi: {url}")
                print(f"  📁 Dizin: {os.getcwd()}")
                print(f"  Durdurmak için Ctrl+C tuşlarına basabilirsiniz.")
                print("=" * 65)
                try:
                    webbrowser.open(url)
                except Exception:
                    pass
                httpd.serve_forever()
        except OSError as e:
            if "address already in use" in str(e).lower() or e.errno == 98 or e.errno == 10048:
                continue
            else:
                raise e

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nSunucu kapatıldı. İyi yayınlar!")
        sys.exit(0)
