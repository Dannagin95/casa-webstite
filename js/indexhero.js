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
        let currentTranslate = -100; 
        let prevTranslate = -100;
        let animationID;
        let autoPlayTimer;

        // Ép vị trí ban đầu chuẩn đét ở hình số 1
        track.style.transform = `translateX(-100%)`;

        const updateDots = () => {
            if (dots.length === 0) return;
            let activeIndex = Math.round(-currentTranslate / 100) - 1;
            
            if (activeIndex < 0) activeIndex = realImagesCount - 1;
            if (activeIndex >= realImagesCount) activeIndex = 0;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIndex);
            });
        };

        const setSliderPosition = () => {
            track.style.transform = `translateX(${currentTranslate}%)`;
            updateDots();
        };

        const updateSlider = (withAnimation = true) => {
            if (withAnimation) {
                track.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
            } else {
                track.style.transition = 'none';
            }
            currentTranslate = -currentIndex * 100;
            setSliderPosition();
        };

        // LOOP VÔ TẬN KHI TRƯỢT XONG (Dành cho cả kéo tay)
        track.addEventListener('transitionend', () => {
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

        // SỬA ĐỔI Ở ĐÂY: Bảo vệ Autoplay không bị trôi lố vào hư không
        const startAutoPlay = () => {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(() => {
                if (!isDragging) {
                    // Nếu lỡ bị trôi lố qua ảnh cuối (do tab ẩn hoặc lỗi mất transitionend)
                    if (currentIndex >= totalImages - 1) {
                        currentIndex = 1;
                        track.style.transition = 'none';
                        currentTranslate = -100;
                        setSliderPosition();
                        
                        // Ép trình duyệt render lại vị trí mới trước khi trượt tiếp
                        track.getBoundingClientRect(); 
                        
                        // Trượt tiếp sang hình số 2
                        currentIndex = 2;
                        updateSlider(true);
                    } else {
                        currentIndex++;
                        updateSlider(true);
                    }
                }
            }, 5000);
        };

        const getPositionX = (e) => e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;

        const dragStart = (e) => {
            isDragging = true;
            clearInterval(autoPlayTimer);

            const style = window.getComputedStyle(track);
            const matrix = new DOMMatrixReadOnly(style.transform);
            const currentX = matrix.m41; 
            const trackWidth = track.getBoundingClientRect().width;
            
            currentTranslate = (currentX / trackWidth) * 100;
            prevTranslate = currentTranslate;

            track.style.transition = 'none'; 
            setSliderPosition();

            startPos = getPositionX(e);
        };

        const dragAction = (e) => {
            if (!isDragging) return;
            const currentPosition = getPositionX(e);
            const diff = ((currentPosition - startPos) / window.innerWidth) * 100;
            let targetTranslate = prevTranslate + diff;
            
            // Thuật toán đổi trục vô hình khi kéo tay
            if (targetTranslate > -50) {
                targetTranslate -= realImagesCount * 100;
                prevTranslate -= realImagesCount * 100;
            } else if (targetTranslate < -(realImagesCount + 0.5) * 100) {
                targetTranslate += realImagesCount * 100;
                prevTranslate += realImagesCount * 100;
            }
            
            currentTranslate = targetTranslate;
            animationID = requestAnimationFrame(setSliderPosition);
        };

        const dragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            cancelAnimationFrame(animationID);

            const movedBy = currentTranslate - prevTranslate;
            let targetIndex = Math.round(-currentTranslate / 100);
            
            if (movedBy < -5) targetIndex = Math.ceil(-currentTranslate / 100);
            if (movedBy > 5) targetIndex = Math.floor(-currentTranslate / 100);

            currentIndex = Math.max(0, Math.min(totalImages - 1, targetIndex));

            track.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            updateSlider(true); 
            startAutoPlay();
        };

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index + 1;
                updateSlider(true);
                startAutoPlay();
            });
        });

        heroBg.addEventListener('mousedown', dragStart);
        window.addEventListener('mousemove', dragAction);
        window.addEventListener('mouseup', dragEnd);
        
        heroBg.addEventListener('touchstart', dragStart, { passive: true });
        heroBg.addEventListener('touchmove', dragAction, { passive: true });
        heroBg.addEventListener('touchend', dragEnd);
        
        heroBg.addEventListener('dragstart', (e) => e.preventDefault());

        updateDots();
        startAutoPlay();
    });
})();