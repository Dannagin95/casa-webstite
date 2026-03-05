document.addEventListener('DOMContentLoaded', function() {
    // 1. Tìm tất cả các nút có thể mở Search (bao gồm cả Desktop và Mobile)
    const triggers = document.querySelectorAll('#search-trigger, .m-trigger-search');
    const drawer = document.getElementById('search-drawer');
    const panel = document.querySelector('.search-panel');
    const closeBtn = document.getElementById('search-close-btn');
    const input = document.getElementById('search-input');

    if (drawer && panel) {
        const openSearch = (e) => {
            if(e) e.preventDefault();
            drawer.classList.add('is-active');
            document.body.classList.add('search-open');
            // Đợi animation xong mới focus
            setTimeout(() => { if(input) input.focus(); }, 400); 
        };

        const closeSearch = () => {
            drawer.classList.remove('is-active');
            document.body.classList.remove('search-open');
        };

        // Gán sự kiện cho tất cả các nút mở [cite: 2026-02-11]
        triggers.forEach(btn => {
            btn.onclick = openSearch;
        });

        if (closeBtn) closeBtn.onclick = closeSearch;

        // Click vùng tối đóng, vùng trắng không đóng
        drawer.onclick = closeSearch;
        panel.onclick = (e) => e.stopPropagation();

        // Nhấn ESC đóng
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && drawer.classList.contains('is-active')) {
                closeSearch();
            }
        });
    }
});