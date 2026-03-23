document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.wood-tab-btn');
    const tabPanels = document.querySelectorAll('.wood-panel');

    // Hàm kích hoạt thanh Specs Bar
    const animateBars = (panel) => {
        const bars = panel.querySelectorAll('.bar-fill');
        bars.forEach(bar => {
            // Reset về 0 trước khi chạy
            bar.style.transition = 'none';
            bar.style.width = '0';
            
            // Force reflow để trình duyệt nhận diện trạng thái 0
            bar.offsetHeight; 
            
            // Bắt đầu chạy dựa trên data-width đã set trong HTML
            bar.style.transition = 'width 1.5s cubic-bezier(0.19, 1, 0.22, 1)';
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
        });
    };

    // Khởi tạo cho tab active mặc định khi vừa load trang
    const initialActive = document.querySelector('.wood-panel.active');
    if (initialActive) {
        animateBars(initialActive);
    }

    // Sự kiện Click chuyển Tab
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-wood');
            const targetPanel = document.getElementById(targetId);

            if (!targetPanel || btn.classList.contains('active')) return;

            // 1. Xử lý trạng thái nút
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 2. Xử lý hiển thị Panel
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                // Reset các thanh bar của các panel khác về 0
                panel.querySelectorAll('.bar-fill').forEach(bar => bar.style.width = '0');
            });

            targetPanel.classList.add('active');

            // 3. Kích hoạt animation thanh bar cho panel mới hiện
            // Delay 100ms để khớp với animation fadeIn của CSS
            setTimeout(() => {
                animateBars(targetPanel);
            }, 100);
        });
    });
});






document.addEventListener('DOMContentLoaded', function() {
    const grid = document.querySelector('.features-grid');
    const dots = document.querySelectorAll('.features-dots .feat-dot');

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