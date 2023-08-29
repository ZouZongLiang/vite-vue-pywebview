import webview
# import server


class api:
    def print(self, msg):
        print(msg)

# win = webview.create_window(title="test", url="http://127.0.0.1:5000", js_api=api(), min_size=(400, 300))
win = webview.create_window(title="test", url="static/index.html", js_api=api(), min_size=(400, 300))





webview.start(http_server=True, debug=True)

