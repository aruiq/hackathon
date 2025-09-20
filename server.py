#!/usr/bin/env python3
"""
澳洲零售分析SaaS工具 - 简单HTTP服务器
适用于开发和演示环境
"""

import http.server
import socketserver
import os
import sys
import webbrowser
import threading
import time
from pathlib import Path

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """自定义HTTP请求处理器，支持CORS和路由"""
    
    def end_headers(self):
        # 添加CORS头部
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        # 处理预检请求
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        # 处理根路径，重定向到index.html
        if self.path == '/':
            self.path = '/public/index.html'
        
        # 处理静态文件
        try:
            super().do_GET()
        except Exception as e:
            print(f"Request processing error: {e}")
            self.send_error(500, str(e))
    
    def log_message(self, format, *args):
        # 自定义日志格式
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {format % args}")

def find_free_port(start_port=8000, max_attempts=50):
    """查找可用端口"""
    import socket
    
    for port in range(start_port, start_port + max_attempts):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.bind(('localhost', port))
            sock.close()
            return port
        except OSError:
            continue
    
    raise RuntimeError(f"Unable to find available port in range {start_port}-{start_port + max_attempts}")

def open_browser(url, delay=2):
    """延迟打开浏览器"""
    def delayed_open():
        time.sleep(delay)
        try:
            webbrowser.open(url)
            print(f"Browser opened: {url}")
        except Exception as e:
            print(f"Cannot auto-open browser: {e}")
            print(f"Please visit manually: {url}")
    
    thread = threading.Thread(target=delayed_open)
    thread.daemon = True
    thread.start()

def main():
    """启动HTTP服务器"""
    
    # 切换到项目根目录
    project_root = Path(__file__).parent
    os.chdir(project_root)
    
    print("=" * 60)
    print("🇦🇺 Australian Retail Analytics SaaS Tool - Development Server")
    print("=" * 60)
    
    try:
        # 查找可用端口
        port = find_free_port(8000)
        
        # 创建服务器
        with socketserver.TCPServer(("", port), CustomHTTPRequestHandler) as httpd:
            server_url = f"http://localhost:{port}"
            
            print(f"✅ Server Started")
            print(f"📍 Address: {server_url}")
            print(f"📂 Directory: {project_root}")
            print(f"🚀 Access App: {server_url}/public/index.html")
            print("")
            print("💡 Features:")
            print("   - Real-time Sales Dashboard")
            print("   - Product Sales Analysis")
            print("   - Customer Behavior Analysis") 
            print("   - Inventory Management Analysis")
            print("   - Cost & ROI Analysis")
            print("   - AI Report Generation")
            print("   - CSV Data Import Support")
            print("")
            print("🔧 Development Notes:")
            print("   - Using sample data for demo")
            print("   - Support CSV import for real data")
            print("   - Data saved in browser local storage")
            print("")
            print("⌨️  Shortcuts:")
            print("   Ctrl+C: Stop server")
            print("   Ctrl+1: Switch to Dashboard")
            print("   Ctrl+2: Switch to Product Analysis")
            print("   Ctrl+3: Switch to Customer Analysis")
            print("")
            print("Server Logs:")
            print("-" * 40)
            
            # 自动打开浏览器
            open_browser(f"{server_url}/public/index.html")
            
            # 启动服务器
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n")
        print("🛑 Server Stopped")
        print("Thank you for using Australian Retail Analytics SaaS Tool!")
        
    except Exception as e:
        print(f"❌ Server startup failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

