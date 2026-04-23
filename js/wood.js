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
    "soi": ["../image/imageswood/Oak tree.jpg", "../image/imageswood/Oak tree 2.jpg", "../image/imageswood/Oak tree 3.jpg", "../image/imageswood/Oak tree 4.png"],
    "occho": ["../image/imageswood/Walnut tree.jpg", "../image/imageswood/Walnut tree 1.jpg", "../image/imageswood/Walnut tree 2.jpg", "../image/imageswood/Walnut tree 3.jpg"],
    "teak": ["../image/imageswood/Teak tree.jpg", "../image/imageswood/Teak tree 1.jpg", "../image/imageswood/Teak tree 2.jpg", "../image/imageswood/Teak tree 3.jpg"],
    "tanbi": ["../image/imageswood/Ash tree.jpg", "../image/imageswood/Ash tree 1.jpg", "../image/imageswood/Ash tree 2.jpg", "../image/imageswood/Ash tree 3.jpg"]
};



document.querySelectorAll('.wood-panel').forEach(panel => {
    const id = panel.id;
    const imgCol = panel.querySelector('.wood-img-col');
    const images = woodGalleries[id];

    if (images && images.length > 1) {
        let currentIndex = 0;

        // 1. Tạo HTML Slider chuẩn
        const trackHtml = images.map(src => `<img src="${src}" alt="Wood Detail">`).join('');
        
        const uiHtml = `
            <div class="wood-slider-track">${trackHtml}</div>
            <div class="wood-nav"><button class="nav-btn prev"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M15 18l-6-6 6-6" />
                    </svg></button><button class="nav-btn next"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9 18l6-6-6-6" />
                </svg></button></div>
            <div class="wood-progress"><div class="wood-progress-bar"></div></div>
        `;
        
        imgCol.innerHTML = uiHtml;
        
        const track = imgCol.querySelector('.wood-slider-track');
        const progressBar = imgCol.querySelector('.wood-progress-bar');

        // 2. Hàm cập nhật - ÉP POSITION TUYỆT ĐỐI
        const updateGallery = (index) => {
            track.style.transform = `translateX(-${index * 100}%)`;
            const totalSteps = images.length - 1;
    const movePercent = (index / totalSteps) * (100 - 25); // 25 là chiều rộng con thoi ở CSS
    
    progressBar.style.transform = `translateX(${movePercent * (images.length / (images.length - 0.75))}%)`; 
    // Hoặc cách đơn giản và chính xác nhất cho mọi số lượng ảnh:
    const step = 100 / images.length;
    progressBar.style.width = `${step}%`;
    progressBar.style.transform = `translateX(${index * 100}%)`;

            // FIX CHO MOBILE: Ép track hít vào cái hố Padding-top
            if (window.innerWidth <= 767) {
                track.style.position = 'absolute';
                track.style.height = '100%';
            }
        };

        updateGallery(0);

        // 3. Nút bấm
        imgCol.querySelector('.prev').onclick = (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
            updateGallery(currentIndex);
        };

        imgCol.querySelector('.next').onclick = (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
            updateGallery(currentIndex);
        };

        // 4. Swipe Mobile
        let startX = 0;
        imgCol.ontouchstart = (e) => { startX = e.touches[0].clientX; };
        imgCol.ontouchend = (e) => {
            let endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
            else if (endX - startX > 50) currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
            updateGallery(currentIndex);
        };
    }
});