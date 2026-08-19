import re
import shutil
from pathlib import Path
from typing import Optional

SITE_ROOT = Path(".")
BACKUP_DIR = SITE_ROOT / "backup_before_normalize"
HTML_FILES_TO_SKIP = set()

SKIP_PREFIXES = ("http://", "https://", "mailto:", "tel:", "#", "javascript:", "data:")


def normalize_path(path: str) -> Optional[str]:
    if not path or path.startswith(SKIP_PREFIXES):
        return None
    if path.startswith("/"):
        return None

    if path.startswith("..") and not path.startswith("../"):
        print(f"    WARNING: malformed path -> \"{path}\" (SKIPPED, fix manually)")
        return None

    if path.startswith("../"):
        stripped = re.sub(r'^(\.\./)+', '', path)
        return "/" + stripped

    if path.startswith("./"):
        return "/" + path[2:]

    return "/" + path


def process_file(filepath: Path) -> int:
    content = filepath.read_text(encoding="utf-8")
    changes = 0

    def replace_attr(match):
        nonlocal changes
        attr_name = match.group(1)
        quote = match.group(2)
        path = match.group(3)

        new_path = normalize_path(path)
        if new_path is None:
            return match.group(0)

        changes += 1
        print(f"    {attr_name}=\"{path}\"  ->  {attr_name}=\"{new_path}\"")
        return f'{attr_name}={quote}{new_path}{quote}'

    pattern = re.compile(r'\b(src|href)=([\'"])(.*?)\2')
    new_content = pattern.sub(replace_attr, content)

    if changes > 0:
        filepath.write_text(new_content, encoding="utf-8")

    return changes


def main():
    html_files = [
        f for f in SITE_ROOT.rglob("*.html")
        if f.name not in HTML_FILES_TO_SKIP
        and "backup_before_normalize" not in f.parts
        and ".git" not in f.parts
    ]

    if not html_files:
        print("Khong tim thay file .html nao. Kiem tra lai vi tri dat script.")
        return

    BACKUP_DIR.mkdir(exist_ok=True)
    for f in html_files:
        rel = f.relative_to(SITE_ROOT)
        backup_path = BACKUP_DIR / rel
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(f, backup_path)

    print(f"Da backup {len(html_files)} file vao: {BACKUP_DIR}\n")
    print("=" * 60)

    total_changes = 0
    files_changed = 0

    for f in sorted(html_files):
        print(f"\n{f.relative_to(SITE_ROOT)}")
        n = process_file(f)
        if n > 0:
            total_changes += n
            files_changed += 1
        else:
            print("    (khong co gi can doi)")

    print("\n" + "=" * 60)
    print(f"HOAN TAT: da sua {total_changes} path trong {files_changed}/{len(html_files)} file.")
    print(f"Ban goc duoc backup tai: {BACKUP_DIR}")


if __name__ == "__main__":
    main()
