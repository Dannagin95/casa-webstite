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

        // 1. THIẾT LẬP BAN ĐẦU
        track.style.transform = `translateX(-100%)`;

        // 2. LOGIC CẬP NHẬT DOT (Tối ưu để không bị tính toán thừa)
        const updateDots = () => {
            if (dots.length === 0) return;
            let activeIndex = currentIndex - 1;
            if (currentIndex === 0) activeIndex = realImagesCount - 1;
            if (currentIndex === totalImages - 1) activeIndex = 0;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIndex);
            });
        };

        // 3. HÀM CẬP NHẬT SLIDER (Tách biệt Animation và Nhảy Loop)
        const setSliderPosition = () => {
            track.style.transform = `translateX(${currentTranslate}%)`;
        };

        const updateSlider = (withAnimation = true) => {
            if (withAnimation) {
                // Giữ nguyên 2s cho tự động để tạo cảm giác sang trọng
                track.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
            } else {
                track.style.transition = 'none';
            }
            currentTranslate = -currentIndex * 100;
            setSliderPosition();
            updateDots();
        };

        // 4. CHỐT CHẶN LOOP (Gắn 1 lần duy nhất - Cực quan trọng để chống nhảy dot)
        track.addEventListener('transitionend', () => {
            if (currentIndex === 0) {
                currentIndex = realImagesCount;
                updateSlider(false);
            } else if (currentIndex === totalImages - 1) {
                currentIndex = 1;
                updateSlider(false);
            }
        });

        // 5. AUTOPLAY
        const startAutoPlay = () => {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(() => {
                currentIndex++;
                updateSlider();
            }, 5000); // Tăng lên 5s cho đỡ vội, chuẩn gu minimalist
        };

        // 6. XỬ LÝ DRAG (Dùng RequestAnimationFrame để mượt tuyệt đối)
        const getPositionX = (e) => e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;

        const dragStart = (e) => {
            isDragging = true;
            startPos = getPositionX(e);
            clearInterval(autoPlayTimer);
            track.style.transition = 'none';
            // Lấy vị trí thực tế lúc đang kéo
            prevTranslate = -currentIndex * 100;
        };

        const dragAction = (e) => {
            if (!isDragging) return;

            // [FIX CHUỘT DÍNH]: Chặn hành vi bôi đen text/hình rác của trình duyệt khi đang cố ý kéo
            if (e.type === 'mousemove') e.preventDefault();

            const currentPosition = getPositionX(e);
            const diff = ((currentPosition - startPos) / window.innerWidth) * 100;
            currentTranslate = prevTranslate + diff;
            
            // Dùng requestAnimationFrame để trình duyệt render nhẹ nhàng nhất có thể
            animationID = requestAnimationFrame(setSliderPosition);
            
            if (e.type === 'touchmove') e.preventDefault();
        };

        const dragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            cancelAnimationFrame(animationID);

            const movedBy = currentTranslate - prevTranslate;

            // Nếu kéo quá 15% chiều ngang thì chuyển slide
            if (movedBy < -15) currentIndex++;
            else if (movedBy > 15) currentIndex--;

            // Khi nhả tay ra, dùng transition nhanh hơn (0.6s) để slider "hít" vào chỗ cũ
            track.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            updateSlider(true); 
            
            startAutoPlay();
        };

        // 7. EVENT LISTENERS
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index + 1;
                updateSlider();
                startAutoPlay();
            });
        });

        // CÁC DÒNG QUYẾT ĐỊNH SỐ PHẬN:
        heroBg.addEventListener('mousedown', dragStart);
        
        // [FIX CHUỘT DÍNH]: Đổi từ heroBg sang window, lỡ tay mày kéo văng chuột ra mép ngoài màn hình thì nó vẫn nhận lệnh "nhả tay".
        window.addEventListener('mousemove', dragAction);
        window.addEventListener('mouseup', dragEnd);

        // [FIX GẠCH CHÉO]: "Thiến" luôn hành vi tự động bắt hình ảnh (Drag & Drop native) của trình duyệt. 
        heroBg.addEventListener('dragstart', (e) => e.preventDefault());

        heroBg.addEventListener('touchstart', dragStart, { passive: true });
        heroBg.addEventListener('touchmove', dragAction, { passive: false });
        heroBg.addEventListener('touchend', dragEnd);

        // Khởi chạy
        updateDots();
        startAutoPlay();
    });
})();