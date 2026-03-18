(() => {
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
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID;
        let autoPlayTimer;
        let isTransitioning = false; 

       
        track.style.transform = `translateX(-100%)`;

     
        const updateDots = () => {
            if (dots.length === 0) return;
            let activeIndex = currentIndex - 1;
            if (currentIndex === 0) activeIndex = realImagesCount - 1;
            if (currentIndex === totalImages - 1) activeIndex = 0;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIndex);
            });
        };


        const setSliderPosition = () => {
            track.style.transform = `translateX(${currentTranslate}%)`;
        };

        const updateSlider = (withAnimation = true) => {
            if (withAnimation) {
                track.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
            } else {
                track.style.transition = 'none';
            }

            currentTranslate = -currentIndex * 100;
            setSliderPosition();
            updateDots();
        };


        track.addEventListener('transitionend', () => {
            isTransitioning = false; 

            if (currentIndex === 0) {
                currentIndex = realImagesCount;
                track.style.transition = 'none';
                currentTranslate = -currentIndex * 100;
                setSliderPosition();
            } else if (currentIndex === totalImages - 1) {
                currentIndex = 1;
                track.style.transition = 'none';
                currentTranslate = -currentIndex * 100;
                setSliderPosition();
            }
        });


        const startAutoPlay = () => {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(() => {
                if (!isDragging) {
                    currentIndex++;
                    updateSlider();
                }
            }, 5000);
        };

        const getPositionX = (e) => e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;

        const dragStart = (e) => {
            isDragging = true;
            isTransitioning = false; 
            clearInterval(autoPlayTimer);
            track.style.transition = 'none';

            if (currentIndex === 0) {
                currentIndex = realImagesCount; 
            } else if (currentIndex === totalImages - 1) {
                currentIndex = 1; 
            }

            prevTranslate = -currentIndex * 100;
            currentTranslate = prevTranslate;
            setSliderPosition(); 

            startPos = getPositionX(e);
        };


        const dragActionDesktop = (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const currentPosition = getPositionX(e);
            const diff = ((currentPosition - startPos) / window.innerWidth) * 100;
            let targetTranslate = prevTranslate + diff;

            const minTranslate = -((totalImages - 1) * 100); 
            const maxTranslate = 0;
            currentTranslate = Math.max(minTranslate, Math.min(maxTranslate, targetTranslate));
            
            animationID = requestAnimationFrame(setSliderPosition);
        };

        const dragEndDesktop = () => {
            if (!isDragging) return;
            isDragging = false;
            cancelAnimationFrame(animationID);

            const movedBy = currentTranslate - prevTranslate;

            if (movedBy < -15) currentIndex++;
            else if (movedBy > 15) currentIndex--;

            currentIndex = Math.max(0, Math.min(totalImages - 1, currentIndex));

            isTransitioning = true;
            track.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            updateSlider(true); 
            startAutoPlay();
        };

        const dragActionMobile = (e) => {
            if (!isDragging) return;
            const currentPosition = getPositionX(e);
            const diff = ((currentPosition - startPos) / window.innerWidth) * 100;
            currentTranslate = prevTranslate + diff;
            
            animationID = requestAnimationFrame(setSliderPosition);
        };

        const dragEndMobile = () => {
            if (!isDragging) return;
            isDragging = false;
            cancelAnimationFrame(animationID);

            const movedBy = currentTranslate - prevTranslate;
            if (movedBy < -15) currentIndex++;
            else if (movedBy > 15) currentIndex--;

            isTransitioning = true;
            track.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            updateSlider(true); 
            startAutoPlay();
        };

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (isTransitioning) return;
                currentIndex = index + 1;
                updateSlider();
                startAutoPlay();
            });
        });


        heroBg.addEventListener('mousedown', dragStart);
        window.addEventListener('mousemove', dragActionDesktop);
        window.addEventListener('mouseup', dragEndDesktop);
        heroBg.addEventListener('dragstart', (e) => e.preventDefault());
        heroBg.addEventListener('touchstart', dragStart, { passive: true });
        heroBg.addEventListener('touchmove', dragActionMobile, { passive: false });
        heroBg.addEventListener('touchend', dragEndMobile);

        updateDots();
        startAutoPlay();
    });
})();