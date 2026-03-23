/* ==========================================================================
   SCROLL INDICATOR - TABLET LỚN (60% WIDTH)
   ========================================================================== */
const initGalleryScroll = () => {
    const gallery = document.querySelector('.firstblog-gallery-grid, .thirdblog-gallery-grid');
    const progress = document.querySelector('.scroll-progress');
    const indicator = document.querySelector('.blog-scroll-indicator');

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