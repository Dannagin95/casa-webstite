document.addEventListener('DOMContentLoaded', () => {
    const techSections = document.querySelectorAll('.tech-dark-gallery');
    
    techSections.forEach((section) => {
        const slider = section.querySelector('.tech-slider-main');
        const progressBar = section.querySelector('.tech-progress-bar');
        const nextBtn = section.querySelector('.next-btn');
        const prevBtn = section.querySelector('.prev-btn');

        if (!slider || !progressBar) return;

        const updateProgress = () => {
            const scrollLeft = slider.scrollLeft;
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            if (maxScroll <= 0) return;

            const isDesktop = window.innerWidth > 991;
            const handleWidthPercent = isDesktop ? 60 : 20;
            progressBar.style.width = `${handleWidthPercent}%`;

            const railWidth = progressBar.parentElement.offsetWidth;
            const handleWidth = (handleWidthPercent / 100) * railWidth;
            const maxTravel = railWidth - handleWidth;

            const scrollPercent = scrollLeft / maxScroll;
            const translateX = scrollPercent * maxTravel;

            progressBar.style.transform = `translateX(${translateX}px)`;
        };

        if (nextBtn && prevBtn) {
            const move = (dir) => {
                const firstItem = section.querySelector('.tech-slide-item');
                const gap = parseFloat(window.getComputedStyle(slider).gap) || 0;
                slider.scrollBy({ 
                    left: dir === 'next' ? (firstItem.offsetWidth + gap) : -(firstItem.offsetWidth + gap), 
                    behavior: 'smooth' 
                });
            };
            nextBtn.onclick = (e) => { e.preventDefault(); move('next'); };
            prevBtn.onclick = (e) => { e.preventDefault(); move('prev'); };
        }

        slider.addEventListener('scroll', () => {
            requestAnimationFrame(updateProgress);
        }, { passive: true });
        
        window.addEventListener('resize', updateProgress);
        updateProgress();
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