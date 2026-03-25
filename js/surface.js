document.addEventListener('DOMContentLoaded', () => {
    const surfaceWrappers = document.querySelectorAll('.surface-slider-wrapper');

    surfaceWrappers.forEach((wrapper) => {
        const sliderMain = wrapper.querySelector('.slider-main');
        const progressBar = wrapper.querySelector('.surface-progress-bar');

        if (!sliderMain || !progressBar) return;

        const updateSurfaceProgress = () => {
            const scrollLeft = sliderMain.scrollLeft;
            const maxScroll = sliderMain.scrollWidth - sliderMain.clientWidth;

            if (maxScroll <= 0) {
                progressBar.parentElement.style.display = 'none';
                return;
            } else {
                progressBar.parentElement.style.display = 'block';
            }

            const isTablet = window.matchMedia('(min-width: 768px)').matches;
            const handleWidthPercent = isTablet ? 55 : 20;

            const scrollPercent = scrollLeft / maxScroll;
            const railWidth = progressBar.parentElement.offsetWidth;
            const handleWidth = (handleWidthPercent / 100) * railWidth;
            const maxTravel = railWidth - handleWidth;
            const translateX = scrollPercent * maxTravel;

            progressBar.style.width = `${handleWidthPercent}%`;
            requestAnimationFrame(() => {
                progressBar.style.transform = `translateX(${translateX}px)`;
            });
        };

        sliderMain.addEventListener('scroll', updateSurfaceProgress, { passive: true });
        window.addEventListener('resize', updateSurfaceProgress);
        updateSurfaceProgress();
    });
});

















document.addEventListener('DOMContentLoaded', function() {
    const grid = document.querySelector('.features-grid');
    const dots = document.querySelectorAll('.features-dots .feat-dot');

    if (grid && dots.length > 0) {
        grid.addEventListener('scroll', () => {
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