document.addEventListener('DOMContentLoaded', async function() {
    const input = document.getElementById('search-input');
    const searchList = document.querySelector('.search-list');
    const searchHeader = input ? input.closest('.search-header') : null;
    const clearBtn = document.getElementById('search-clear-btn');

    if (input && searchList) {
        const originalListHTML = searchList.innerHTML;
        const isEnglish = window.location.pathname.startsWith('/en/') || window.location.pathname === '/en';

        // Tự động đổi nhãn theo ngôn ngữ website
        const mainPageLabel = isEnglish ? 'Main Page' : 'Trang chính';

        // Tải đúng file JSON full-text theo ngôn ngữ
        let searchDatabase = [];
        const jsonFile = isEnglish ? '/js/search-index-en.json' : '/js/search-index-vi.json';
        
        try {
            const response = await fetch(jsonFile);
            searchDatabase = await response.json();
        } catch (error) {
            console.error('Không thể tải index tìm kiếm:', error);
            return;
        }

        const notFoundText = isEnglish ? 'No results for' : 'Không tìm thấy kết quả cho';

        const quickLinks = isEnglish ? [
            { title: "CASA Parquet", url: "/en/", keywords: "casa parquet" },
            { title: "About CASA / History", url: "/en/lichsu.html", keywords: "history about" },
            { title: "Certifications", url: "/en/chungchi.html", keywords: "certifications brochure catalogue" },
            { title: "Projects", url: "/en/Du_an.html", keywords: "projects" },
            { title: "Products", url: "/en/san-pham.html", keywords: "products" },
            { title: "Wood & Structure", url: "/en/wood.html", keywords: "structure wood" },
            { title: "Blog", url: "/en/blog.html", keywords: "blog" },
            { title: "Contact Us", url: "/en/contactus.html", keywords: "contact" }
        ] : [
            { title: "CASA Parquet", url: "/index.html", keywords: "casa parquet trang chủ" },
            { title: "Về chúng tôi", url: "/lichsu.html", keywords: "lich su ve casa parquet about history" },
            { title: "Chứng chỉ", url: "/chungchi.html", keywords: "chung chi certifications brochure catalogue" },
            { title: "Dự Án", url: "/Du_an.html", keywords: "du an projects" },
            { title: "Sản phẩm", url: "/san-pham.html", keywords: "san pham products" },
            { title: "Gỗ & Cấu trúc", url: "/wood.html", keywords: "cau truc go wood" },
            { title: "Blog", url: "/blog.html", keywords: "blog" },
            { title: "Liên hệ", url: "/contactus.html", keywords: "lien he contact" }
        ];

        const removeVietnameseTones = (str) => {
            if (!str) return "";
            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
        };

        const getExcerpt = (content, query, length = 80) => {
            if (!content) return '';
            const lowerContent = content.toLowerCase();
            const lowerQuery = query.toLowerCase();
            const index = lowerContent.indexOf(lowerQuery);

            if (index === -1) {
                return content.substring(0, length) + '...';
            }

            const start = Math.max(0, index - 20);
            const end = Math.min(content.length, index + query.length + length);
            let excerpt = content.substring(start, end);

            if (start > 0) excerpt = '...' + excerpt;
            if (end < content.length) excerpt = excerpt + '...';
            return excerpt;
        };

        const getHighlightText = (text, query) => {
            if (!query.trim()) return text;
            const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escapedQuery})`, 'gi');
            return text.replace(regex, '<span class="highlight">$1</span>');
        };

        // Hàm kiểm soát hiển thị nút Xóa
        const updateClearButton = () => {
            if (searchHeader) {
                if (input.value.trim().length > 0) {
                    searchHeader.classList.add('has-text');
                } else {
                    searchHeader.classList.remove('has-text');
                }
            }
        };

        // Xử lý sự kiện khi bấm nút Xóa
        if (clearBtn) {
            clearBtn.addEventListener('click', function(e) {
                e.preventDefault();
                input.value = '';
                updateClearButton();
                searchList.innerHTML = originalListHTML;
                input.focus();
            });
        }

        let debounce;
        input.addEventListener('input', function() {
            clearTimeout(debounce);
            updateClearButton(); // Cập nhật trạng thái nút Xóa khi gõ chữ
            const rawValue = this.value;
            const querySafe = removeVietnameseTones(rawValue);

            debounce = setTimeout(() => {
                if (querySafe.length === 0) {
                    searchList.innerHTML = originalListHTML;
                    return;
                }

                const matchedQuickLinks = quickLinks.filter(item => {
                    const titleSafe = removeVietnameseTones(item.title);
                    const keywordsSafe = removeVietnameseTones(item.keywords);
                    return titleSafe.includes(querySafe) || keywordsSafe.includes(querySafe);
                });

                const matchedFullText = searchDatabase.filter(item => {
                    const isDuplicate = matchedQuickLinks.some(ql => ql.url === item.url);
                    if (isDuplicate) return false;
                    return item.contentSafe && item.contentSafe.includes(querySafe);
                });

                const totalResults = matchedQuickLinks.length + matchedFullText.length;

                if (totalResults > 0) {
                    let htmlContent = '';

                    if (matchedQuickLinks.length > 0) {
                        htmlContent += matchedQuickLinks.map(item => {
                            const highlightedTitle = getHighlightText(item.title, rawValue);
                            return `
                                <li class="search-result-item quick-link-item" style="margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid rgba(0,0,0,0.06);">
                                    <a href="${item.url}" class="search-item-link" style="display: block; text-decoration: none;">
                                        <div style="font-size: 20px; font-weight: 700; color: #000;">
                                            ${highlightedTitle} 
                                            <span style="font-size: 11px; font-weight: 600; color: #b78103; background: #fff8e1; padding: 2px 6px; border-radius: 4px; margin-left: 8px; vertical-align: middle;">${mainPageLabel}</span>
                                        </div>
                                    </a>
                                </li>
                            `;
                        }).join('');
                    }

                    if (matchedFullText.length > 0) {
                        htmlContent += matchedFullText.map(item => {
                            const highlightedTitle = getHighlightText(item.title, rawValue);
                            const rawExcerpt = getExcerpt(item.content, rawValue, 80);
                            const highlightedExcerpt = getHighlightText(rawExcerpt, rawValue);

                            return `
                                <li class="search-result-item" style="margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid rgba(0,0,0,0.06);">
                                    <a href="${item.url}" class="search-item-link" style="display: block; text-decoration: none;">
                                        <div style="font-size: 18px; font-weight: 600; color: #111; margin-bottom: 4px;">${highlightedTitle}</div>
                                        <div style="font-size: 14px; color: #666; line-height: 1.4; font-weight: 400;">${highlightedExcerpt}</div>
                                    </a>
                                </li>
                            `;
                        }).join('');
                    }

                    searchList.innerHTML = htmlContent;
                } else {
                    searchList.innerHTML = `<li style="padding: 20px 0; color: #999; text-align: center; font-size: 16px;">${notFoundText} "${rawValue}"</li>`;
                }
            }, 200);
        });

        // Chạy kiểm tra trạng thái lúc đầu vừa load
        updateClearButton();
    }
});