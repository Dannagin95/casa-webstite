import xml.etree.ElementTree as ET
import re

def clean_sitemap(file_path, output_path):
    tree = ET.parse(file_path)
    root = tree.getroot()
    
    namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    ET.register_namespace('', namespace['ns'])
    
    fixed_count = 0
    
    for url in root.findall('ns:url', namespace):
        loc = url.find('ns:loc', namespace)
        if loc is not None and loc.text:
            original_url = loc.text
            cleaned_url = re.sub(r'/([^/]+)/\1/', r'/\1/', original_url)
            
            while cleaned_url != original_url:
                original_url = cleaned_url
                cleaned_url = re.sub(r'/([^/]+)/\1/', r'/\1/', original_url)
                
            if loc.text != cleaned_url:
                print(f"Đã sửa: {loc.text} ---> {cleaned_url}")
                loc.text = cleaned_url
                fixed_count += 1
                
    tree.write(output_path, encoding='utf-8', xml_declaration=True)
    print(f"Hoàn tất! Đã làm sạch {fixed_count} URL bị lặp.")

clean_sitemap('sitemap.xml', 'sitemap_cleaned.xml')