document.addEventListener('DOMContentLoaded', () => {
    const techSections = document.querySelectorAll('.tech-dark-gallery');
    
    techSections.forEach((section) => {
        const slider = section.querySelector('.tech-slider-main');
        const progressBar = section.querySelector('.tech-progress-bar');
        const nextBtn = section.querySelector('.next-btn');
        const prevBtn = section.querySelector('.prev-btn');

        if (!slider || !progressBar) return;

        // Hàm tính toán progress bar
        const handleScroll = () => {
            const scrollLeft = slider.scrollLeft;
            const maxScroll = slider.scrollWidth - slider.offsetWidth;
            const isMobile = window.innerWidth <= 1024;

            if (maxScroll <= 0) return;

            const scrollPercent = scrollLeft / maxScroll;
            let progress;

            if (isMobile) {
                progress = scrollPercent * 100;
            } else {
                // Desktop: chạy từ 33% (vì 1 slide hiện 3 cái) đến 100%
                progress = 33 + (scrollPercent * 67);
            }
            progressBar.style.width = `${progress}%`;
        };

        // Xử lý nút bấm (Đã sửa lỗi ReferenceError)
        if (nextBtn && prevBtn) {
            const move = (dir) => {
                const firstItem = section.querySelector('.tech-slide-item');
                if (!firstItem) return;

                const itemWidth = firstItem.offsetWidth;
                // Lấy gap chuẩn từ CSS (20px như mày đã set)
                const gap = 20; 
                
                slider.scrollBy({ 
                    left: dir === 'next' ? (itemWidth + gap) : -(itemWidth + gap), 
                    behavior: 'smooth' 
                });
            };

            nextBtn.onclick = (e) => {
                e.preventDefault();
                move('next');
            };
            prevBtn.onclick = (e) => {
                e.preventDefault();
                move('prev');
            };
        }

        slider.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Khởi tạo phát đầu
    });
});





function toggleTechRead() {
    var dots = document.getElementById("dots-tech");
    var moreText = document.getElementById("more-tech");
    var btnMore = document.getElementById("btn-tech-read");
    var btnLess = document.getElementById("btn-read-less");

    if (dots.style.display === "none") {
        // ĐANG MỞ -> ĐÓNG LẠI
        dots.style.display = "inline";
        moreText.style.display = "none";
        btnMore.style.display = "inline";
        btnLess.style.display = "none";
    } else {
        // ĐANG ĐÓNG -> MỞ RA
        dots.style.display = "none";
        moreText.style.display = "block";
        btnMore.style.display = "none";
        btnLess.style.display = "inline";
    }
}


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