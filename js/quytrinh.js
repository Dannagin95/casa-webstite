






/* Quy trình - Multisection Runner - Fixed No-Jitter Version */
document.addEventListener('DOMContentLoaded', () => {
    const allSections = document.querySelectorAll('.step1album-section');
    
    allSections.forEach((section) => {
        const slider = section.querySelector('.step1album-slider');
        const nextBtn = section.querySelector('.next-btn');
        const prevBtn = section.querySelector('.prev-btn');
        const progressBar = section.querySelector('.step1album-progress-bar');

        if (slider && progressBar) {
            // Hàm cập nhật thanh Progress dựa trên vị trí cuộn thực tế
            const updateProgressOnScroll = () => {
                const scrollLeft = slider.scrollLeft;
                const scrollWidth = slider.scrollWidth - slider.clientWidth;
                
                // Tính toán % tiến trình: min 60%, max 100% theo logic của mày
                // Nếu scrollWidth = 0 (chỉ có 1 ảnh) thì mặc định 60%
                const scrollPercent = scrollWidth > 0 ? (scrollLeft / scrollWidth) : 0;
                const progressWidth = 60 + (scrollPercent * 40); 
                
                progressBar.style.width = `${progressWidth}%`;

                // Cập nhật trạng thái nút nếu chúng đang hiển thị (tablet)
                if (nextBtn && prevBtn) {
                    prevBtn.disabled = (scrollLeft <= 5);
                    nextBtn.disabled = (scrollLeft >= scrollWidth - 5);
                }
            };

            // 1. LẮNG NGHE SỰ KIỆN CUỘN (Dành cho vuốt tay Mobile)
            slider.addEventListener('scroll', updateProgressOnScroll);

            // 2. XỬ LÝ NÚT BẤM (Dành cho Desktop/Tablet)
            if (nextBtn && prevBtn) {
                nextBtn.onclick = () => {
                    const itemWidth = slider.querySelector('.step1album-item').clientWidth;
                    slider.scrollBy({ left: itemWidth, behavior: 'smooth' });
                };

                prevBtn.onclick = () => {
                    const itemWidth = slider.querySelector('.step1album-item').clientWidth;
                    slider.scrollBy({ left: -itemWidth, behavior: 'smooth' });
                };
            }

            // Khởi tạo trạng thái ban đầu
            updateProgressOnScroll();
        }
    });
});






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