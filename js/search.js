document.addEventListener('DOMContentLoaded', function() {
    // 1. Tìm tất cả các nút có thể mở Search (bao gồm cả Desktop và Mobile)
    const triggers = document.querySelectorAll('#search-trigger, .m-trigger-search');
    const drawer = document.getElementById('search-drawer');
    const panel = document.querySelector('.search-panel');
    const closeBtn = document.getElementById('search-close-btn');
    const input = document.getElementById('search-input');
    
    // Các phần tử cho tính năng Clear input
    const searchHeader = input ? input.closest('.search-header') : null;
    const clearBtn = document.getElementById('search-clear-btn');
    const searchList = document.querySelector('.search-list');
    const originalListHTML = searchList ? searchList.innerHTML : '';

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

        // Gán sự kiện cho tất cả các nút mở
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

    // 2. Logic điều khiển hiển thị nút Clear và reset danh sách
    if (input && searchHeader) {
        const updateClearButton = () => {
            if (input.value.trim().length > 0) {
                searchHeader.classList.add('has-text');
            } else {
                searchHeader.classList.remove('has-text');
            }
        };

        // Lắng nghe sự kiện input để hiện/ẩn nút Clear
        input.addEventListener('input', function() {
            updateClearButton();
        });

        // Xử lý khi bấm nút Clear (×)
        if (clearBtn) {
            clearBtn.addEventListener('click', function(e) {
                e.preventDefault();
                input.value = '';             // Xóa sạch chữ
                updateClearButton();          // Ẩn nút Clear đi
                if (searchList) {
                    searchList.innerHTML = originalListHTML; // Phục hồi danh sách ban đầu
                }
                input.focus();                // Giữ focus để gõ tiếp
            });
        }

        // Chạy kiểm tra ban đầu
        updateClearButton();
    }
});