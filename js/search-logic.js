import { searchDatabase } from './database.js';

document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('search-input');
    const searchList = document.querySelector('.search-list');

    if (input && searchList) {
        const originalListHTML = searchList.innerHTML;

        const removeVietnameseTones = (str) => {
            if (!str) return "";
            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
        };

        const getHighlightText = (text, query) => {
    if (!query.trim()) return text;
    
    // Tạo regex tìm kiếm không phân biệt hoa thường và hỗ trợ tiếng Việt
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    
    return text.replace(regex, '<span class="highlight">$1</span>');
};
        let debounce;
        input.addEventListener('input', function() {
            clearTimeout(debounce);
            const rawValue = this.value;
            const querySafe = removeVietnameseTones(rawValue);

            debounce = setTimeout(() => {
                if (querySafe.length === 0) {
                    searchList.innerHTML = originalListHTML;
                    return;
                }

                const filtered = searchDatabase.filter(item => {
                    const titleSafe = removeVietnameseTones(item.title);
                    const keywordsSafe = removeVietnameseTones(item.keywords);
                    return titleSafe.includes(querySafe) || keywordsSafe.includes(querySafe);
                });

                if (filtered.length > 0) {
                    searchList.innerHTML = filtered.map(item => {
                        // Gọi hàm highlight cho tiêu đề [cite: 2026-02-11]
                        const highlightedTitle = getHighlightText(item.title, rawValue);
                        return `<li><a href="${item.url}">${highlightedTitle}</a></li>`;
                    }).join('');
                } else {
                    searchList.innerHTML = `<li style="padding: 10px 0; color: #999; text-align: center;">Không thấy "${rawValue}"</li>`;
                }
            }, 200);
        });
    }
});