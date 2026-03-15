document.addEventListener("DOMContentLoaded", function() {
    // Ép trình duyệt vẽ lại cái fill để nó nhận width từ HTML [cite: 2025-12-29]
    const fills = document.querySelectorAll('.spec-bar .fill');
    fills.forEach(f => {
        const w = f.style.width;
        f.style.width = '0';
        setTimeout(() => { f.style.width = w; }, 100);
    });
});





document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Chọn tất cả các block nội dung
    const blocks = document.querySelectorAll('.content-block');
    const visuals = document.querySelectorAll('.wdisplay-item');

    // 2. Thiết lập Observer (Người quan sát)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Nếu block này đang nằm giữa màn hình (trên 50%)
            if (entry.isIntersecting) {
                // Lấy ID hình ảnh mục tiêu từ data-target
                const targetId = entry.target.getAttribute('data-target');
                
                // Xóa active cũ
                visuals.forEach(v => v.classList.remove('active'));
                
                // Thêm active mới cho hình tương ứng
                const activeVisual = document.getElementById(targetId);
                if (activeVisual) {
                    activeVisual.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.5 // Kích hoạt khi block hiện ra 50%
    });

    // 3. Bắt đầu quan sát từng block
    blocks.forEach(block => observer.observe(block));
});



function rearrangeWoodForMobile() {
    if (window.innerWidth <= 1024) {
        const wrapper = document.querySelector('.wood-showcase-wrapper');
        const visualItems = document.querySelectorAll('.wdisplay-item');
        const contentBlocks = document.querySelectorAll('.content-block');

        contentBlocks.forEach((block, index) => {
            // Chèn hình tương ứng vào ngay trước khối text
            if (visualItems[index]) {
                block.parentNode.insertBefore(visualItems[index], block);
            }
        });
    }
}

// Chạy khi load trang và khi resize
window.addEventListener('load', rearrangeWoodForMobile);
window.addEventListener('resize', rearrangeWoodForMobile);






document.addEventListener('DOMContentLoaded', function() {
    const grid = document.querySelector('.features-grid');
    const dots = document.querySelectorAll('.features-dots .dot');

    if (grid && dots.length > 0) {
        grid.addEventListener('scroll', () => {
            // Tính toán index dựa trên vị trí cuộn
            // itemWidth là chiều rộng của một mục (100% màn hình)
            const itemWidth = grid.clientWidth; 
            const index = Math.round(grid.scrollLeft / itemWidth);

            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });
    }
});  