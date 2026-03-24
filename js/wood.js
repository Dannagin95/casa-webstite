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






const woodGalleries = {
    "soi": ["imageswood/Oak tree.jpg", "imageswood/Oak tree 2.jpg", "imageswood/Oak tree 3.jpg", "imageswood/Oak tree 4.png"],
    "occho": ["imageswood/Walnut tree.jpg", "imageswood/Walnut tree 1.jpg", "imageswood/Walnut tree 2.jpg", "imageswood/Walnut tree 3.jpg"],
    "teak": ["imageswood/Teak tree.jpg", "imageswood/Teak tree 1.jpg"],
    "tanbi": ["imageswood/Ash.jpg", "imageswood/tan-bi-van-1.jpg"]
};



document.querySelectorAll('.wood-panel').forEach(panel => {
    const id = panel.id;
    const imgCol = panel.querySelector('.wood-img-col');
    const images = woodGalleries[id];

    if (images && images.length > 1) {
        let currentIndex = 0;

        // 1. Dựng "đoàn tàu" chứa tất cả ảnh
        const slideHtml = `
            <div class="wood-slider-track">
                ${images.map(src => `<img src="${src}" alt="Wood Detail">`).join('')}
            </div>
            <div class="wood-nav">
                <button class="nav-btn prev"><svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg></button>
                <button class="nav-btn next"><svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg></button>
            </div>
        `;
        
        // Xóa cái img cũ đi và thay bằng slider
        imgCol.innerHTML = slideHtml;
        const track = imgCol.querySelector('.wood-slider-track');

        const updateSlide = (index) => {
            // Đẩy đoàn tàu đi một khoảng bằng đúng chiều rộng của khung
            track.style.transform = `translateX(-${index * 100}%)`;
        };

        imgCol.querySelector('.prev').addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
            updateSlide(currentIndex);
        });

        imgCol.querySelector('.next').addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
            updateSlide(currentIndex);
        });
    }
});