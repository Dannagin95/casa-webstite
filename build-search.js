const fs = require('fs');
const path = require('path');

// Danh sách thư mục và file cần loại trừ tuyệt đối
const EXCLUDE_DIRS = ['node_modules', '.git', 'js', 'css', 'assets', 'backup_before_normalize'];
const EXCLUDE_FILES = ['draft.html', 'draft-blog.html'];

// Hàm chuẩn hóa bỏ dấu tiếng Việt
function removeVietnameseTones(str) {
    if (!str) return "";
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
}

// Hàm giải mã HTML Entities cơ bản
function decodeEntities(str) {
    return str
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

// Quét đệ quy tìm file HTML hợp lệ
function getAllHtmlFiles(dir, fileList = []) {
    try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                const dirName = path.basename(filePath);
                if (!EXCLUDE_DIRS.includes(dirName)) {
                    getAllHtmlFiles(filePath, fileList);
                }
            } else if (path.extname(file).toLowerCase() === '.html') {
                const fileName = path.basename(filePath).toLowerCase();
                // Bỏ qua file nháp và các file xác minh danh tính của Google (bắt đầu bằng google...)
                if (!EXCLUDE_FILES.includes(fileName) && !fileName.startsWith('google')) {
                    fileList.push(filePath);
                }
            }
        });
    } catch (err) {
        console.error(`Lỗi đọc thư mục ${dir}:`, err.message);
    }
    return fileList;
}

// Bóc tách nội dung từng file HTML
function parseHtml(filePath, rootDir) {
    try {
        const html = fs.readFileSync(filePath, 'utf8');

        // 1. Xóa sạch comment HTML trước tiên để tránh lỗi vỡ cấu trúc
        let cleanHtml = html.replace(/<!--[\s\S]*?-->/g, '');

        // 2. Xóa các khối layout chung gây nhiễu từ khóa (nav, footer, menu, drawer, form...)
        cleanHtml = cleanHtml
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
            .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
            .replace(/<div[^>]*class="[^"]*(?:search-drawer|m-mobile-menu|top-bar|sample-box)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');

        // 3. Lấy tiêu đề và cắt bỏ tiền tố thương hiệu rườm rà ("CASA Parquet | ")
        const titleMatch = cleanHtml.match(/<title>(.*?)<\/title>/i);
        let rawTitle = titleMatch ? titleMatch[1].trim() : path.basename(filePath, '.html');
        let title = rawTitle.replace(/^CASA\s+Parquet\s*\|\s*/i, '').trim();
        if (!title) {
            const h1Match = cleanHtml.match(/<h1[^>]*>(.*?)<\/h1>/i);
            title = h1Match ? h1Match[1].replace(/<[^>]*>/g, '').trim() : path.basename(filePath, '.html');
        }
        title = decodeEntities(title);

        // 4. Lấy meta description làm nội dung tóm tắt ban đầu nếu có
        const descMatch = cleanHtml.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
        let metaDesc = descMatch ? decodeEntities(descMatch[1].trim()) : '';

        // 5. Trích xuất text thuần và giới hạn dung lượng (~800 ký tự đầu) để file JSON luôn nhẹ tênh
        let textContent = cleanHtml
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        textContent = decodeEntities(textContent);
        if (metaDesc) {
            textContent = metaDesc + ' ' + textContent;
        }
        if (textContent.length > 800) {
            textContent = textContent.substring(0, 800) + '...';
        }

        // 6. Xử lý URL chuẩn xác, encodeURI và phân luồng ngôn ngữ (VI / EN)
        const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
        let relativeUrl = '/' + relativePath;
        if (relativeUrl === '/index.html') relativeUrl = '/';
        if (relativeUrl === '/en/index.html') relativeUrl = '/en/';
        relativeUrl = encodeURI(relativeUrl);

        const isEnglish = relativePath.startsWith('en/') || relativePath === 'en/index.html';

        return {
            isEnglish,
            item: {
                title: title,
                url: relativeUrl,
                content: textContent,
                contentSafe: removeVietnameseTones(title + ' ' + textContent) // Pre-normalize tăng tốc tìm kiếm tối đa
            }
        };
    } catch (err) {
        console.error(`Lỗi xử lý file ${filePath}:`, err.message);
        return null;
    }
}

// Thực thi tiến trình build
function buildSearchIndex() {
    const rootDir = __dirname;
    const htmlFiles = getAllHtmlFiles(rootDir);

    const viIndex = [];
    const enIndex = [];

    htmlFiles.forEach(file => {
        const result = parseHtml(file, rootDir);
        if (result) {
            if (result.isEnglish) {
                enIndex.push(result.item);
            } else {
                viIndex.push(result.item);
            }
        }
    });

    const jsDir = path.join(rootDir, 'js');
    if (!fs.existsSync(jsDir)) {
        fs.mkdirSync(jsDir, { recursive: true });
    }

    fs.writeFileSync(path.join(jsDir, 'search-index-vi.json'), JSON.stringify(viIndex, null, 2), 'utf8');
    fs.writeFileSync(path.join(jsDir, 'search-index-en.json'), JSON.stringify(enIndex, null, 2), 'utf8');

    console.log(`✅ [Advanced Search] Build thành công! Tiếng Việt: ${viIndex.length} trang | Tiếng Anh: ${enIndex.length} trang.`);
}

buildSearchIndex();