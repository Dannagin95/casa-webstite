(() => { // Bọc kín để cô lập biến
    document.addEventListener("DOMContentLoaded", () => {
        const track = document.getElementById('heroTrack');
        const heroBg = document.querySelector('.hero-bg');
        const dots = document.querySelectorAll('.hero-dot');
        if (!track || !heroBg) return;

        const images = track.querySelectorAll('img');
        const totalImages = images.length; 
        const realImagesCount = totalImages - 2; 
        let currentIndex = 1; 
        let isDragging = false;
        let startPos = 0;
        let autoPlayTimer;

        // Thiết lập vị trí ban đầu
        track.style.transition = 'none';
        track.style.transform = `translateX(-100%)`;

        const updateDots = () => {
            if (dots.length === 0) return;
            let activeDot = currentIndex - 1;
            if (currentIndex === 0) activeDot = realImagesCount - 1;
            else if (currentIndex === totalImages - 1) activeDot = 0;
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === activeDot);
            });
        };

        const updateSlider = (withAnimation = true) => {
            if (withAnimation) {
                track.style.transition = 'transform 2s cubic-bezier(0.25, 1, 0.5, 1)';
            } else {
                track.style.transition = 'none';
            }
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        const handleLoop = () => {
            track.addEventListener('transitionend', function _listener() {
                if (currentIndex === 0) {
                    currentIndex = realImagesCount;
                    updateSlider(false);
                } else if (currentIndex === totalImages - 1) {
                    currentIndex = 1;
                    updateSlider(false);
                }
            }, { once: true });
        };

        const nextSlide = () => {
            currentIndex++;
            updateSlider();
            handleLoop();
        };

        const startAutoPlay = () => {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(nextSlide, 4000); 
        };
        startAutoPlay();

        // Xử lý Drag
        const dragStart = (e) => {
            isDragging = true;
            startPos = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            track.style.transition = 'none';
            clearInterval(autoPlayTimer);
        };

        const dragAction = (e) => {
            if (!isDragging) return;
            
            // Chống giật trang khi đang kéo slider trên mobile
            if (e.type === 'touchmove') e.preventDefault();

            const currentPosition = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const diff = currentPosition - startPos;

            // Xử lý biên trượt
            if (currentIndex === 0 && diff > 50) {
                currentIndex = realImagesCount;
                startPos = currentPosition - diff;
            } else if (currentIndex === totalImages - 1 && diff < -50) {
                currentIndex = 1;
                startPos = currentPosition - diff;
            }

            track.style.transform = `translateX(calc(-${currentIndex * 100}% + ${diff}px))`;
        };

        const dragEnd = (e) => {
            if (!isDragging) return;
            isDragging = false;
            const endPos = e.type.includes('mouse') ? e.clientX : (e.changedTouches ? e.changedTouches[0].clientX : startPos);
            const diff = endPos - startPos;

            if (diff < -100) {
                currentIndex++;
            } else if (diff > 100) {
                currentIndex--;
            }

            updateSlider();
            handleLoop();
            startAutoPlay();
        };

        // Event Listeners
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index + 1;
                updateSlider();
                handleLoop(); 
                startAutoPlay();
            });
        });

        heroBg.addEventListener('mousedown', dragStart);
        heroBg.addEventListener('mousemove', dragAction);
        window.addEventListener('mouseup', dragEnd); // Giữ window để thả chuột ngoài vùng vẫn ăn

        // Dùng {passive: false} để e.preventDefault() có tác dụng chống giật
        heroBg.addEventListener('touchstart', dragStart, {passive: true});
        heroBg.addEventListener('touchmove', dragAction, {passive: false});
        heroBg.addEventListener('touchend', dragEnd);
    });
})();