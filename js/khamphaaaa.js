document.addEventListener('DOMContentLoaded', () => {
    const allSections = document.querySelectorAll('.khamphaalbum-section');
    
    allSections.forEach((section) => {
        const slider = section.querySelector('.khamphaalbum-slider');
        const nextBtn = section.querySelector('.next-btn');
        const prevBtn = section.querySelector('.prev-btn');
        const progressBar = section.querySelector('.khamphaalbum-progress-bar');

        if (slider && progressBar) {
            
            // 1. CẬP NHẬT PROGRESS & NÚT KHI CUỘN (Dùng chung cho cả vuốt tay & bấm nút)
            slider.addEventListener('scroll', () => {
                const scrollLeft = slider.scrollLeft;
                const maxScroll = slider.scrollWidth - slider.clientWidth;
                
                // Cập nhật Progress Bar theo pixel thực tế
                let progress = 0;
                if (maxScroll > 0) {
                    progress = (scrollLeft / maxScroll) * 100;
                }
                progressBar.style.width = `${progress}%`;

                // Cập nhật trạng thái Disabled cho nút
                if (prevBtn && nextBtn) {
                    prevBtn.disabled = (scrollLeft <= 5);
                    nextBtn.disabled = (scrollLeft >= maxScroll - 5);
                }
            });

            // 2. LOGIC NÚT BẤM (Fix lại cho "ngon" như cũ)
            const handleScroll = (direction) => {
                const item = slider.querySelector('.khamphaalbum-item');
                if (item) {
                    // Lấy chiều rộng item + gap (đang để 20px trong CSS)
                    const stepWidth = item.offsetWidth + 20; 
                    
                    slider.scrollBy({
                        left: direction === 'next' ? stepWidth : -stepWidth,
                        behavior: 'smooth'
                    });
                }
            };

            if (nextBtn) {
                nextBtn.onclick = () => handleScroll('next');
            }
            if (prevBtn) {
                prevBtn.onclick = () => handleScroll('prev');
            }

            // Kích hoạt trạng thái ban đầu
            slider.dispatchEvent(new Event('scroll'));
        }
    });
});