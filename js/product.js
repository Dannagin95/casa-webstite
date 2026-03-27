document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================
       SECTION 1: LOGIC PROGRESS BAR (CERTIFICATES)
       ========================================== */
    const initProgressBar = () => {
        const slider = document.querySelector('.riva-logo-strip');
        const thumb = document.querySelector('.riva-smallprogress-bar');
        const track = document.querySelector('.riva-smallprogress-container');

        if (!slider || !thumb || !track) return;

        const updateThumb = () => {
            const scrollLeft = slider.scrollLeft;
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            const scrollRatio = maxScroll > 0 ? (scrollLeft / maxScroll) : 0;
            const trackWidth = track.clientWidth;
            const thumbWidth = thumb.clientWidth; 
            const maxTravel = trackWidth - thumbWidth;

            const translateX = scrollRatio * maxTravel;
            thumb.style.transform = `translateX(${translateX}px)`;
        };

        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        const stopDragging = () => {
            isDown = false;
            slider.style.cursor = 'grab';
        };

        slider.addEventListener('mouseleave', stopDragging);
        slider.addEventListener('mouseup', stopDragging);

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const multiplier = 0.4; 
            const walk = (x - startX) * multiplier; 
            slider.scrollLeft = scrollLeft - walk;
            updateThumb();
        });

        slider.addEventListener('scroll', updateThumb);
        updateThumb();
    };

    /* ==========================================
       SECTION 2: LOGIC HERO SLIDER (VIDEO + IMAGE)
       ========================================== */
    const initHeroSlider = () => {
        const gallery = [
            { type: 'video', src: 'imagesRiva/Rivaherovd1.mp4' },
            { type: 'image', src: 'imagesRiva/Rivahero02.jpg' },
            { type: 'image', src: 'imagesRiva/Hinh3.jpg' },
            { type: 'image', src: 'imagesRiva/Hinh4.jpg' },
            { type: 'image', src: 'imagesRiva/Hinh5.jpg' }
        ];

        let currentIndex = 0;
        const videoEl = document.getElementById('riva-hero-video');
        const imageEl = document.getElementById('riva-hero-image');
        const prevBtn = document.querySelector('.riva-prev');
        const nextBtn = document.querySelector('.riva-next');

        if (!videoEl || !imageEl || !prevBtn || !nextBtn) return;

        const updateSlider = (index) => {
            const item = gallery[index];

            if (item.type === 'video') {
                imageEl.style.display = 'none';
                imageEl.style.opacity = '0';
                videoEl.style.display = 'block';
                videoEl.style.opacity = '1';
                videoEl.play().catch(() => {}); // Chống lỗi autoplay browser
            } else {
                videoEl.pause();
                videoEl.style.display = 'none';
                videoEl.style.opacity = '0';
                imageEl.style.display = 'block';
                imageEl.src = item.src;
                imageEl.style.opacity = '1';
            }
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % gallery.length;
            updateSlider(currentIndex);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
            updateSlider(currentIndex);
        });

        updateSlider(0);
    };

    // Kích hoạt cả 2 section
    initProgressBar();
    initHeroSlider();
});









document.addEventListener('DOMContentLoaded', () => {
    const gallery = [
        { type: 'video', src: 'imagesRiva/Rivaherovd1.mp4' },
        { type: 'image', src: 'imagesRiva/Rivahero01.jpg' },
        { type: 'image', src: 'imagesRiva/Rivahero02.jpg' },
        { type: 'image', src: 'imagesRiva/Rivahero07.webp' },
        { type: 'image', src: 'imagesRiva/Rivahero05.jpg' }
    ];

    let currentIndex = 0;
    const videoEl = document.getElementById('riva-hero-video'); // Lấy theo ID mới
    const imageEl = document.getElementById('riva-hero-image'); // Lấy theo ID cũ
    const prevBtn = document.querySelector('.riva-prev');
    const nextBtn = document.querySelector('.riva-next');

    const updateSlider = (index) => {
        const item = gallery[index];

        if (item.type === 'video') {
            // Hiển thị Video, ẩn Hình
            imageEl.style.display = 'none';
            imageEl.style.opacity = '0';
            
            videoEl.style.display = 'block';
            videoEl.style.opacity = '1';
            videoEl.play();
        } else {
            // Hiển thị Hình, ẩn Video
            videoEl.pause();
            videoEl.style.display = 'none';
            videoEl.style.opacity = '0';

            imageEl.style.display = 'block';
            imageEl.src = item.src;
            imageEl.style.opacity = '1';
        }
    };

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % gallery.length;
        updateSlider(currentIndex);
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
        updateSlider(currentIndex);
    });
    
    // Chạy tấm đầu tiên
    updateSlider(0);
});