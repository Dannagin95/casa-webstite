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