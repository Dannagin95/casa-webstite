/* ==========================================================================
   SCROLL INDICATOR - TABLET LỚN (60% WIDTH)
   ========================================================================== */
const initGalleryScroll = () => {
    const gallery = document.querySelector('.firstblog-gallery-grid, .thirdblog-gallery-grid, .fourthblog-gallery-grid, .fifthblog-gallery-grid, .sixblog-gallery-grid');
    const progress = document.querySelector('.scroll-progress');
    const indicator = document.querySelector('.blog-scroll-indicator, .thirdblog-scroll-indicator, .fourthblog-scroll-indicator, .fifthblog-scroll-indicator, .sixblog-scroll-indicator');

    if (gallery && progress && indicator) {
        gallery.addEventListener('scroll', () => {
            // 1. Tính tỷ lệ phần trăm đã cuộn (từ 0 đến 1)
            const maxScroll = gallery.scrollWidth - gallery.clientWidth;
            const scrollFraction = gallery.scrollLeft / maxScroll;

            // 2. Tính khoảng không gian còn trống để thanh đen di chuyển
            // (Độ dài ray - Độ dài thanh đen)
            const indicatorWidth = indicator.clientWidth;
            const progressWidth = progress.clientWidth;
            const availableSpace = indicatorWidth - progressWidth;

            // 3. Di chuyển thanh đen dựa trên tỷ lệ cuộn
            const moveX = scrollFraction * availableSpace;

            // Dùng thủ thuật để bám tay mượt hơn trên iPad
            requestAnimationFrame(() => {
                progress.style.transform = `translateX(${moveX}px)`;
            });
        });
    }
};

// Đảm bảo chạy sau khi trang load xong
if (document.readyState === 'complete') {
    initGalleryScroll();
} else {
    window.addEventListener('load', initGalleryScroll);
}









/**
 * CASA BLOG PAGINATION & URL HANDLER
 * Hỗ trợ chuyển trang, cập nhật URL ?page=X và giữ nguyên layout Grid
 */
const initBlogPagination = () => {
    const prevBtn = document.querySelector('.pag-btn.prev');
    const nextBtn = document.querySelector('.pag-btn.next');
    const pagNumber = document.querySelector('.pag-number');
    const pages = document.querySelectorAll('.blog-page-wrapper');
    const totalPages = pages.length;

    if (!prevBtn || !nextBtn || pages.length === 0) return;

    /**
     * Hàm cập nhật hiển thị và URL
     * @param {number} page - Số trang hiện tại
     * @param {boolean} pushState - Có đẩy lịch sử URL hay không
     */
    const updateDisplay = (page, pushState = true) => {
        // 1. Ẩn/Hiện cụm blog
        // Dùng style.display = '' để nó nhận display: contents từ CSS của mày
        pages.forEach(p => {
            const isTargetPage = parseInt(p.getAttribute('data-page')) === page;
            p.style.display = isTargetPage ? '' : 'none';
        });

        // 2. Cập nhật số trang hiển thị (1 / 2)
        if (pagNumber) {
            pagNumber.textContent = `${page} / ${totalPages}`;
        }

        // 3. Cập nhật trạng thái nút (Mờ nút khi không bấm được nữa)
        prevBtn.style.opacity = (page === 1) ? '0.3' : '1';
        prevBtn.style.pointerEvents = (page === 1) ? 'none' : 'auto';
        nextBtn.style.opacity = (page === totalPages) ? '0.3' : '1';
        nextBtn.style.pointerEvents = (page === totalPages) ? 'none' : 'auto';

        // 4. Cập nhật thanh URL
        if (pushState) {
            const newUrl = `${window.location.pathname}?page=${page}`;
            window.history.pushState({ page: page }, '', newUrl);
        }

        // 5. Cuộn nhẹ lên đầu trang blog cho mượt
        // Tao trừ hao 100px để không bị dính sát mép trên
        const blogGrid = document.querySelector('.blog-grid');
        if (blogGrid) {
            window.scrollTo({
                top: blogGrid.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    };

    // --- KHỞI TẠO: Check URL khi vừa load trang ---
    const urlParams = new URLSearchParams(window.location.search);
    let currentPage = parseInt(urlParams.get('page')) || 1;

    // Fix lỗi nếu user nhập bậy số trang lên URL
    if (currentPage > totalPages) currentPage = 1;
    if (currentPage < 1) currentPage = 1;

    // Hiển thị trang đầu tiên dựa trên URL
    updateDisplay(currentPage, false);

    // --- SỰ KIỆN NÚT BẤM ---
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            updateDisplay(currentPage);
        }
    });

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            updateDisplay(currentPage);
        }
    });

    // --- XỬ LÝ NÚT BACK/FORWARD CỦA TRÌNH DUYỆT ---
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page) {
            currentPage = event.state.page;
            updateDisplay(currentPage, false);
        } else {
            // Trường hợp quay lại trang mặc định không có tham số
            currentPage = 1;
            updateDisplay(1, false);
        }
    });
};

// Chạy hàm khi trang đã load xong
if (document.readyState === 'complete') {
    initBlogPagination();
} else {
    window.addEventListener('load', initBlogPagination);
}