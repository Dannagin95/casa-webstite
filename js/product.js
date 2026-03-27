document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       SECTION 1: PROGRESS BAR (STRIP) - CHẠY MỌI NƠI
       ========================================== */
    const initProgressBar = () => {
        const slider = document.querySelector('.riva-logo-strip');
        const thumb = document.querySelector('.riva-smallprogress-bar');
        const track = document.querySelector('.riva-smallprogress-container');
        if (!slider || !thumb || !track) return;

        const update = () => {
            const ratio = slider.scrollLeft / (slider.scrollWidth - slider.clientWidth);
            const maxTravel = track.clientWidth - thumb.clientWidth;
            thumb.style.transform = `translateX(${(ratio || 0) * maxTravel}px)`;
        };

        // Kéo bằng chuột (Desktop)
        let isDown = false, startX, scrollLeft;
        const start = (e) => {
            isDown = true;
            startX = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        };
        const end = () => isDown = false;
        const move = (e) => {
            if (!isDown) return;
            const x = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
            slider.scrollLeft = scrollLeft - (x - startX) * 1.5;
        };

        slider.addEventListener('mousedown', start);
        slider.addEventListener('touchstart', start, {passive: true});
        window.addEventListener('mouseup', end);
        window.addEventListener('touchend', end);
        window.addEventListener('mousemove', move);
        window.addEventListener('touchmove', move, {passive: true});
        slider.addEventListener('scroll', update);
        window.addEventListener('resize', update);
        update();
    };

    /* ==========================================
       SECTION 2: HERO SLIDER (LOGIC PHÂN TÁCH)
       ========================================== */
    const initHeroSlider = () => {
        const gallery = [
            { type: 'video', src: 'imagesRiva/Rivaherovd1.mp4' },
            { type: 'image', src: 'imagesRiva/Rivahero01.jpg' },
            { type: 'image', src: 'imagesRiva/Rivahero02.jpg' },
            { type: 'image', src: 'imagesRiva/Rivahero07.webp' },
            { type: 'image', src: 'imagesRiva/Rivahero05.jpg' }
        ];

        let currentIndex = 0;
        const videoEl = document.getElementById('riva-hero-video');
        const imageEl = document.getElementById('riva-hero-image');
        const dotsContainer = document.getElementById('riva-hero-dots');
        const container = document.querySelector('.riva-hero-container');
        const nextBtn = document.querySelector('.riva-next');
        const prevBtn = document.querySelector('.riva-prev');

        if (!videoEl || !imageEl) return;

        // Hàm cập nhật Slider
        const updateSlider = (index, useFade = false) => {
            const item = gallery[index];
            const duration = useFade ? '0.4s' : '0s'; // Desktop 0s = không hiệu ứng

            // Áp dụng hiệu ứng fade tùy chọn
            videoEl.style.transition = `opacity ${duration} ease-in-out`;
            imageEl.style.transition = `opacity ${duration} ease-in-out`;

            const applyChange = () => {
                if (item.type === 'video') {
                    imageEl.style.display = 'none';
                    imageEl.style.opacity = '0';
                    videoEl.style.display = 'block';
                    if (!videoEl.src.includes(item.src)) {
                        videoEl.src = item.src;
                        videoEl.load();
                    }
                    videoEl.play().catch(() => {});
                    videoEl.style.opacity = '1';
                } else {
                    videoEl.pause();
                    videoEl.src = ""; // Triệt tiêu lớp video mờ
                    videoEl.style.display = 'none';
                    videoEl.style.opacity = '0';
                    imageEl.style.display = 'block';
                    imageEl.src = item.src;
                    imageEl.style.opacity = '1';
                }
                updateDots(index);
            };

            if (useFade) {
                videoEl.style.opacity = '0';
                imageEl.style.opacity = '0';
                setTimeout(applyChange, 200);
            } else {
                applyChange();
            }
        };

        const updateDots = (index) => {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.riva-dot');
            dots.forEach((d, i) => d.classList.toggle('active', i === index));
        };

        // Khởi tạo Dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            gallery.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.className = `riva-dot ${i === 0 ? 'active' : ''}`;
                dot.onclick = () => { 
                    currentIndex = i; 
                    // Nếu bấm dot (mobile/tablet nhỏ) thì cho fade nhẹ
                    updateSlider(currentIndex, window.innerWidth < 1024); 
                };
                dotsContainer.appendChild(dot);
            });
        }

        // --- LOGIC CHO DESKTOP & TABLET LỚN (NÚT BẤM, KHÔNG FADE) ---
        const handleNavClick = (direction) => {
            if (direction === 'next') currentIndex = (currentIndex + 1) % gallery.length;
            else currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
            updateSlider(currentIndex, false); // false = không hiệu ứng
        };

        if (nextBtn) nextBtn.onclick = () => handleNavClick('next');
        if (prevBtn) prevBtn.onclick = () => handleNavClick('prev');

        // --- LOGIC CHO MOBILE & TABLET NHỎ (VUỐT, CÓ FADE NHẸ) ---
        let startX = 0;
        container.addEventListener('touchstart', (e) => { 
            startX = e.touches[0].clientX; 
        }, {passive: true});

        container.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) currentIndex = (currentIndex + 1) % gallery.length;
                else currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
                updateSlider(currentIndex, true); // true = có fade nhẹ
            }
        });

        updateSlider(0, false);
    };

    initProgressBar();
    initHeroSlider();
});