#!/usr/bin/env python3
"""Local dev server that mimics Vercel's cleanUrls (/contact -> contact.html)."""
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def translate_path(self, path):
        resolved = super().translate_path(path)
        if not os.path.exists(resolved) and not resolved.endswith(os.sep):
            if os.path.isfile(resolved + ".html"):
                return resolved + ".html"
        return resolved

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    ThreadingHTTPServer(("", PORT), Handler).serve_forever()
