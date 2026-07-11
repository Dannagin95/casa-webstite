document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       SECTION 1: PROGRESS BAR (STRIP)
       ========================================== */
    const initProgressBar = () => {
        const slider = document.querySelector('.mastro-logo-strip');
        const thumb = document.querySelector('.mastro-smallprogress-bar');
        const track = document.querySelector('.mastro-smallprogress-container');
        if (!slider || !thumb || !track) return;

        const update = () => {
            const ratio = slider.scrollLeft / (slider.scrollWidth - slider.clientWidth);
            const maxTravel = track.clientWidth - thumb.clientWidth;
            thumb.style.transform = `translateX(${(ratio || 0) * maxTravel}px)`;
        };

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
       SECTION 2: HERO SLIDER (NGOÀI TRANG CHỦ)
       ========================================== */
    const heroGallery = [
        { type: 'video', src: '../image/imagesMastro/Mastroherovd1.mp4' },
        { type: 'image', src: '../image/imagesMastro/mastrohero01.jpg' },
        { type: 'image', src: '../image/imagesMastro/mastrohero02.jpg' },
        { type: 'image', src: '../image/imagesMastro/mastrohero03.jpg' },
        { type: 'image', src: '../image/imagesMastro/mastrohero04.jpg' }
    ];
    let currentHeroIndex = 0;

    const initHeroSlider = () => {
        const videoEl = document.getElementById('mastro-hero-video');
        const imageEl = document.getElementById('mastro-hero-image');
        const dotsContainer = document.getElementById('mastro-hero-dots');
        const container = document.querySelector('.mastro-hero-container');
        const nextBtn = document.querySelector('.mastro-next');
        const prevBtn = document.querySelector('.mastro-prev');

        const playBtn = document.getElementById('mastro-video-play-btn');
        const progressContainer = document.getElementById('mastro-video-progress-container');
        const progressBar = document.getElementById('mastro-video-progress-bar');

        if (!videoEl || !imageEl) return;

        const setPlayIcon = (btn) => {
            if (!btn) return;
            btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" style="width:100%; height:100%;"><path d="M8 5v14l11-7z"/></svg>`;
        };
        const setPauseIcon = (btn) => {
            if (!btn) return;
            btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" style="width:100%; height:100%;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
        };

        const togglePlayPause = (e) => {
            if (e) e.stopPropagation();
            if (videoEl.paused) {
                videoEl.play().catch(() => {});
                setPauseIcon(playBtn);
            } else {
                videoEl.pause();
                setPlayIcon(playBtn);
            }
        };

        if (playBtn) {
            playBtn.onclick = togglePlayPause;
            setPauseIcon(playBtn);
        }

        videoEl.addEventListener('timeupdate', () => {
            // Chỉ cập nhật thanh tiến trình ngoài trang chủ nếu là Desktop
            if (videoEl.duration && progressBar && window.innerWidth >= 1024) {
                const pct = (videoEl.currentTime / videoEl.duration) * 100;
                progressBar.style.width = `${pct}%`;
            }
        });

        if (progressContainer) {
            progressContainer.onclick = (e) => {
                e.stopPropagation();
                if (window.innerWidth >= 1024) {
                    const rect = progressContainer.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    videoEl.currentTime = (clickX / rect.width) * videoEl.duration;
                }
            };
        }

        if (container) {
            container.addEventListener('mouseenter', () => {
                if (heroGallery[currentHeroIndex].type === 'video') {
                    container.classList.add('show-video-controls');
                }
            });
            container.addEventListener('mouseleave', () => {
                container.classList.remove('show-video-controls');
            });
            
            container.addEventListener('click', (e) => {
                const item = heroGallery[currentHeroIndex];
                if (item && item.type === 'video' && window.innerWidth < 1024) {
                    if (e.target.closest('#mastro-video-play-btn')) return;
                    
                    if (!container.classList.contains('show-video-controls')) {
                        e.stopPropagation();
                        container.classList.add('show-video-controls');
                        clearTimeout(container.controlsTimeout);
                        container.controlsTimeout = setTimeout(() => {
                            container.classList.remove('show-video-controls');
                        }, 3000);
                        return;
                    }
                }
            }, true);
        }

        const updateSlider = (index, useFade = false) => {
            const item = heroGallery[index];
            const duration = useFade ? '0.4s' : '0s';

            videoEl.style.transition = `opacity ${duration} ease-in-out`;
            imageEl.style.transition = `opacity ${duration} ease-in-out`;

            const applyChange = () => {
                if (item.type === 'video') {
                    if (container) {
                        container.classList.remove('hero-is-image');
                        if (container.matches(':hover')) container.classList.add('show-video-controls');
                    }
                    imageEl.style.display = 'none';
                    imageEl.style.opacity = '0';
                    videoEl.style.display = 'block';
                    if (!videoEl.src.includes(item.src)) {
                        videoEl.src = item.src;
                        videoEl.load();
                    }
                    setPauseIcon(playBtn);
                    videoEl.play().catch(() => {});
                    videoEl.style.opacity = '1';
                } else {
                    if (container) {
                        container.classList.add('hero-is-image');
                        container.classList.remove('show-video-controls');
                    }
                    videoEl.pause();
                    videoEl.src = ""; 
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
            const dots = dotsContainer.querySelectorAll('.mastro-dot');
            dots.forEach((d, i) => d.classList.toggle('active', i === index));
        };

        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            heroGallery.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.className = `mastro-dot ${i === 0 ? 'active' : ''}`;
                dot.onclick = (e) => { 
                    e.stopPropagation();
                    currentHeroIndex = i; 
                    updateSlider(currentHeroIndex, window.innerWidth < 1024); 
                };
                dotsContainer.appendChild(dot);
            });
        }

        const handleNavClick = (direction) => {
            if (direction === 'next') currentHeroIndex = (currentHeroIndex + 1) % heroGallery.length;
            else currentHeroIndex = (currentHeroIndex - 1 + heroGallery.length) % heroGallery.length;
            updateSlider(currentHeroIndex, false);
        };

        if (nextBtn) nextBtn.onclick = (e) => { e.stopPropagation(); handleNavClick('next'); };
        if (prevBtn) prevBtn.onclick = (e) => { e.stopPropagation(); handleNavClick('prev'); };

        let startXSwipe = 0;
        container.addEventListener('touchstart', (e) => { 
            startXSwipe = e.touches[0].clientX; 
        }, {passive: true});

        container.addEventListener('touchend', (e) => {
            if (e.target.closest('#mastro-video-play-btn') || e.target.closest('#mastro-video-progress-container')) return;
            const endX = e.changedTouches[0].clientX;
            const diff = startXSwipe - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) currentHeroIndex = (currentHeroIndex + 1) % heroGallery.length;
                else currentHeroIndex = (currentHeroIndex - 1 + heroGallery.length) % heroGallery.length;
                updateSlider(currentHeroIndex, true);
            }
        });

        updateSlider(0, false);
    };

    /* ==========================================
       SECTION 3: GALLERY GRID SCROLL
       ========================================== */
    const initGalleryScroll = () => {
        const grid = document.querySelector('.mastro-gallery-grid');
        const progressBar = document.querySelector('.mastro-progress-bar');
        const container = document.querySelector('.mastro-progress-container');

        if (!grid || !progressBar || !container) return;

        grid.addEventListener('scroll', () => {
            const maxScroll = grid.scrollWidth - grid.clientWidth;
            const maxTravel = container.offsetWidth - progressBar.offsetWidth;
            const scrollPercent = grid.scrollLeft / maxScroll;
            const moveX = scrollPercent * maxTravel;

            progressBar.style.transform = `translateX(${moveX}px)`;
        }, { passive: true });
    };

    /* ==========================================
       SECTION 4: LIGHTBOX (SỬA ĐỒNG BỘ HIỂN THỊ CONTROLS)
       ========================================== */
    const initProductLightbox = () => {
        const lightbox = document.getElementById("casaLightbox");
        const track = document.getElementById("lightboxTrack");
        const closeBtn = document.querySelector(".lightbox-close");
        const prevBtn = document.getElementById("lightboxPrev");
        const nextBtn = document.getElementById("lightboxNext");
        const dotsContainer = document.getElementById("lightboxDots");

        if (!lightbox || !track) return;

        let lightboxItems = [];
        let currentIndex = 1;
        let isZoomed = false;
        let isTransitioning = false;
        let startX = 0, currentX = 0, isDragging = false, trackWidth = 0;

        const formatTime = (seconds) => {
            if (isNaN(seconds)) return "00:00";
            const m = Math.floor(seconds / 60).toString().padStart(2, '0');
            const s = Math.floor(seconds % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        };

        // HÀM TẠO PHẦN TỬ SLIDE - ĐÃ FIX ĐỂ KHÔNG BỊ MẤT BỘ ĐIỀU KHIỂN TRONG LIGHTBOX
        const createSlideElement = (item) => {
            const slide = document.createElement("div");
            slide.classList.add("lightbox-slide");

            if (item.type === 'video') {
                const videoWrapper = document.createElement("div");
                videoWrapper.classList.add("lightbox-video-wrapper");

                const video = document.createElement("video");
                video.src = item.src;
                video.muted = true;
                video.loop = true;
                video.setAttribute('playsinline', '');

                // Ép hiển thị thanh tiến trình và cụm điều khiển chuẩn chỉ riêng trong Lightbox chi tiết
                const controls = document.createElement("div");
                controls.classList.add("lightbox-custom-controls");
                controls.innerHTML = `
                    <div class="v-controls-left">
                        <button class="v-play-pause-btn">
                            <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                            <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><path d="M8 5v14l11-7z"/></svg>
                        </button>
                        <span class="v-time-display">00:00</span>
                    </div>
                    <div class="v-progress-container">
                        <div class="v-progress-bar"></div>
                    </div>
                `;

                const playPauseBtn = controls.querySelector(".v-play-pause-btn");
                const iconPlay = controls.querySelector(".icon-play");
                const iconPause = controls.querySelector(".icon-pause");
                const timeEl = controls.querySelector(".v-time-display");
                const progressBar = controls.querySelector(".v-progress-bar");
                const progressContainer = controls.querySelector(".v-progress-container");

                playPauseBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (video.paused) {
                        video.play().catch(() => {});
                        iconPlay.style.display = "none";
                        iconPause.style.display = "block";
                    } else {
                        video.pause();
                        iconPlay.style.display = "block";
                        iconPause.style.display = "none";
                    }
                });

                video.addEventListener("timeupdate", () => {
                    if (video.duration) {
                        const pct = (video.currentTime / video.duration) * 100;
                        progressBar.style.width = `${pct}%`;
                        timeEl.textContent = formatTime(video.currentTime);
                    }
                });

                progressContainer.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const rect = progressContainer.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    video.currentTime = (clickX / rect.width) * video.duration;
                });

                videoWrapper.appendChild(video);
                videoWrapper.appendChild(controls);
                slide.appendChild(videoWrapper);
            } else {
                const img = document.createElement("img");
                img.src = item.src;
                img.alt = "CASA Parquet";
                setupZoomEvent(img);
                slide.appendChild(img);
            }
            return slide;
        };

        const setupLightboxTrack = (items, targetIndex) => {
            lightboxItems = items;
            const realCount = lightboxItems.length;
            track.innerHTML = "";

            if (dotsContainer) {
                dotsContainer.innerHTML = "";
                lightboxItems.forEach((_, idx) => {
                    const dot = document.createElement("div");
                    dot.classList.add("lightbox-dot");
                    if (idx === targetIndex) dot.classList.add("active");
                    dot.addEventListener("click", (e) => {
                        e.stopPropagation();
                        if (isTransitioning) return;
                        moveToSlide(idx + 1);
                    });
                    dotsContainer.appendChild(dot);
                });
            }

            track.appendChild(createSlideElement(lightboxItems[realCount - 1]));
            lightboxItems.forEach(item => track.appendChild(createSlideElement(item)));
            track.appendChild(createSlideElement(lightboxItems[0]));

            lightbox.style.display = "flex";
            trackWidth = lightbox.querySelector('.lightbox-track-wrapper').offsetWidth;
            moveToSlide(targetIndex + 1, false);

            setTimeout(() => lightbox.classList.add("active"), 10);
        };

        const moveToSlide = (index, withTransition = true) => {
            if (isTransitioning && withTransition) return;
            resetZoom();
            stopAllVideos();

            currentIndex = index;
            isTransitioning = withTransition;

            track.style.transition = withTransition ? "transform 0.4s cubic-bezier(0.25, 1, 0.3, 1)" : "none";
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            updateDots();
            playCurrentVideo();
        };

        track.addEventListener("transitionend", () => {
            isTransitioning = false;
            const realCount = lightboxItems.length;

            if (currentIndex >= realCount + 1) {
                track.style.transition = "none";
                currentIndex = 1;
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                playCurrentVideo();
            }
            if (currentIndex <= 0) {
                track.style.transition = "none";
                currentIndex = realCount;
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                playCurrentVideo();
            }
        });

        const updateDots = () => {
            const dots = document.querySelectorAll(".lightbox-dot");
            if (dots.length === 0) return;
            const realCount = lightboxItems.length;

            let dotIndex = currentIndex - 1;
            if (currentIndex >= realCount + 1) dotIndex = 0;
            if (currentIndex <= 0) dotIndex = realCount - 1;

            dots.forEach((dot, idx) => dot.classList.toggle('active', idx === dotIndex));
        };

        const stopAllVideos = () => {
            track.querySelectorAll('video').forEach(video => {
                video.pause();
                const wrapper = video.closest('.lightbox-video-wrapper');
                if(wrapper && wrapper.querySelector('.icon-play')) {
                    wrapper.querySelector('.icon-play').style.display = "block";
                    wrapper.querySelector('.icon-pause').style.display = "none";
                }
            });
        };

        const playCurrentVideo = () => {
            const activeSlide = track.children[currentIndex];
            if (activeSlide) {
                const video = activeSlide.querySelector('video');
                if (video) {
                    video.play().catch(() => {});
                    const wrapper = video.closest('.lightbox-video-wrapper');
                    if(wrapper && wrapper.querySelector('.icon-play')) {
                        wrapper.querySelector('.icon-play').style.display = "none";
                        wrapper.querySelector('.icon-pause').style.display = "block";
                    }
                }
            }
        };

        const heroContainer = document.querySelector('.mastro-hero-container');
        if (heroContainer) {
            heroContainer.style.cursor = "pointer";
            heroContainer.addEventListener('click', (e) => {
                if (e.target.closest('#mastro-video-play-btn') || e.target.closest('#mastro-video-progress-container')) {
                    return;
                }
                setupLightboxTrack(heroGallery, currentHeroIndex);
            });
        }

        const gridImages = Array.from(document.querySelectorAll('.mastro-gallery-grid .mastro-photo img'));
        gridImages.forEach((img, idx) => {
            img.style.cursor = "pointer";
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                const gridGalleryData = gridImages.map(i => ({ type: 'image', src: i.src }));
                setupLightboxTrack(gridGalleryData, idx);
            });
        });

        track.addEventListener("touchstart", (e) => {
            if (isZoomed || isTransitioning) return;
            if (e.target.closest('.lightbox-custom-controls')) return;

            isDragging = true;
            startX = e.touches[0].clientX;
            track.style.transition = "none";
            trackWidth = lightbox.querySelector('.lightbox-track-wrapper').offsetWidth;
        }, { passive: true });

        track.addEventListener("touchmove", (e) => {
            if (!isDragging || isZoomed) return;
            currentX = e.touches[0].clientX;
            const deltaPercent = ((currentX - startX) / trackWidth) * 100;
            track.style.transform = `translateX(${(-currentIndex * 100) + deltaPercent}%)`;
        }, { passive: true });

        track.addEventListener("touchend", (e) => {
            if (!isDragging) return;
            isDragging = false;
            const finalDeltaX = e.changedTouches[0].clientX - startX;
            if (finalDeltaX < -50) moveToSlide(currentIndex + 1);
            else if (finalDeltaX > 50) moveToSlide(currentIndex - 1);
            else moveToSlide(currentIndex);
        });

        if (nextBtn) nextBtn.onclick = (e) => { e.stopPropagation(); moveToSlide(currentIndex + 1); };
        if (prevBtn) prevBtn.onclick = (e) => { e.stopPropagation(); moveToSlide(currentIndex - 1); };

        function setupZoomEvent(imgTarget) {
            imgTarget.addEventListener("click", function(e) {
                e.stopPropagation();
                if (isDragging || isTransitioning) return;
                isZoomed = !isZoomed;
                if (isZoomed) {
                    this.classList.add("zoomed");
                    zoomEffect(e, this);
                } else {
                    resetZoom();
                }
            });
            imgTarget.addEventListener("mousemove", function(e) {
                if (!isZoomed) return;
                zoomEffect(e, this);
            });
        }

        function zoomEffect(e, imgTarget) {
            const rect = imgTarget.getBoundingClientRect();
            imgTarget.style.transformOrigin = `${((e.clientX - rect.left) / rect.width) * 100}% ${((e.clientY - rect.top) / rect.height) * 100}%`;
        }

        function resetZoom() {
            isZoomed = false;
            track.querySelectorAll('img').forEach(img => {
                img.classList.remove("zoomed");
                img.style.transformOrigin = "center center";
            });
        }

        function closeLightbox() {
            lightbox.classList.remove("active");
            setTimeout(() => {
                lightbox.style.display = "none";
                stopAllVideos();
                resetZoom();
            }, 300);
        }

        if (closeBtn) closeBtn.onclick = (e) => { e.stopPropagation(); closeLightbox(); };
        lightbox.addEventListener("click", (e) => {
            if (!track.contains(e.target) && e.target !== nextBtn && e.target !== prevBtn && !e.target.classList.contains('lightbox-dot')) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (lightbox.style.display === "flex") {
                if (e.key === "ArrowRight") moveToSlide(currentIndex + 1);
                if (e.key === "ArrowLeft") moveToSlide(currentIndex - 1);
                if (e.key === "Escape") closeLightbox();
            }
        });
    };

    // Run
    initProgressBar();
    initHeroSlider();
    initGalleryScroll();
    initProductLightbox();
});