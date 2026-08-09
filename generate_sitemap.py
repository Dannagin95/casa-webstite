"""
Script sinh sitemap.xml bằng cách QUÉT FILE THẬT trên ổ đĩa
(không dùng crawler/tool online -> không thể tạo ra URL ảo)

Cách dùng:
1. Copy file này vào thư mục GỐC của project (ngang hàng index.html)
2. Sửa DOMAIN bên dưới nếu cần
3. Chạy: python generate_sitemap.py
4. Script sẽ in ra danh sách URL tìm được để mày review trước
5. Nếu ổn, xác nhận để ghi ra sitemap.xml
"""

import os
from datetime import datetime, timezone
from xml.sax.saxutils import escape

# ============ CẤU HÌNH ============
DOMAIN = "https://casa-parquet.vn"
ROOT_DIR = "."  # thư mục gốc chứa index.html

# Các thư mục KHÔNG chứa trang nội dung -> bỏ qua khi quét
EXCLUDE_DIRS = {
    "image", "images", "js", "css", "iconzalo",
    "Tai_lieu", "The_Collection",  # đổi lại nếu 2 folder này thực ra có trang cần index
    ".git", "node_modules",
}

# Các file KHÔNG nên đưa vào sitemap (draft, file verify, file lỗi...)
EXCLUDE_FILE_KEYWORDS = ["draft", "DRAFT"]

# File google-site-verification dạng googleXXXXXXXX.html -> tự động loại
def is_google_verification_file(filename: str) -> bool:
    return filename.lower().startswith("google") and filename.lower().endswith(".html")

# Sitemap chuẩn XML cần các file .html/.htm; nếu mày dùng đuôi khác thì thêm vào đây
VALID_EXTENSIONS = (".html", ".htm")

# ===================================


def should_skip_dir(dirname: str) -> bool:
    return dirname in EXCLUDE_DIRS or dirname.startswith(".")


def should_skip_file(filename: str) -> bool:
    if not filename.lower().endswith(VALID_EXTENSIONS):
        return True
    if is_google_verification_file(filename):
        return True
    for kw in EXCLUDE_FILE_KEYWORDS:
        if kw.lower() in filename.lower():
            return True
    return False


def scan_html_files(root_dir: str):
    """Quét toàn bộ file .html thật sự tồn tại trên ổ đĩa, trả về list (url, filepath, lastmod)."""
    results = []
    for current_dir, subdirs, files in os.walk(root_dir):
        # Lọc thư mục con ngay tại chỗ để os.walk không đi vào các thư mục exclude
        subdirs[:] = [d for d in subdirs if not should_skip_dir(d)]

        for filename in files:
            if should_skip_file(filename):
                continue

            full_path = os.path.join(current_dir, filename)
            # Đường dẫn tương đối từ root, dùng dấu / (chuẩn URL) thay vì \ (Windows)
            rel_path = os.path.relpath(full_path, root_dir).replace(os.sep, "/")

            url = f"{DOMAIN}/{rel_path}"
            mtime = os.path.getmtime(full_path)
            lastmod = datetime.fromtimestamp(mtime, tz=timezone.utc).strftime("%Y-%m-%dT%H:%M:%S+00:00")

            results.append((url, full_path, lastmod))

    return results


def build_sitemap_xml(entries) -> str:
    lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    for url, _path, lastmod in entries:
        lines.append("  <url>")
        lines.append(f"    <loc>{escape(url)}</loc>")
        lines.append(f"    <lastmod>{lastmod}</lastmod>")
        lines.append("    <priority>0.5</priority>")
        lines.append("  </url>")
    lines.append("</urlset>")
    return "\n".join(lines)


def main():
    entries = scan_html_files(ROOT_DIR)
    entries.sort(key=lambda e: e[0])  # sắp xếp theo URL cho dễ đọc

    # Check trùng lặp URL (không nên có, nhưng kiểm tra cho chắc)
    urls_seen = {}
    duplicates = []
    for url, path, _ in entries:
        if url in urls_seen:
            duplicates.append((url, urls_seen[url], path))
        else:
            urls_seen[url] = path

    print(f"\n=== TÌM THẤY {len(entries)} FILE HTML THẬT ===\n")
    for url, path, lastmod in entries:
        print(f"  {url}   <-- {path}")

    if duplicates:
        print(f"\n⚠️  CẢNH BÁO: {len(duplicates)} URL bị trùng (2 file khác nhau map ra cùng 1 URL):")
        for url, path1, path2 in duplicates:
            print(f"  {url}\n      file 1: {path1}\n      file 2: {path2}")
    else:
        print("\n✅ Không có URL nào bị trùng.")

    confirm = input(f"\nGhi {len(entries)} URL vào sitemap.xml? (y/n): ").strip().lower()
    if confirm == "y":
        xml_content = build_sitemap_xml(entries)
        with open("sitemap.xml", "w", encoding="utf-8") as f:
            f.write(xml_content)
        print("✅ Đã ghi sitemap.xml mới.")
    else:
        print("Huỷ, không ghi file.")


if __name__ == "__main__":
    main()
