document.addEventListener('DOMContentLoaded', function() {

    /* ==========================================================================
       1. XỬ LÝ LỌC DANH MỤC (FILTER TABS)
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const gridBentoItems = document.querySelectorAll('.bento-grid-container .bento-item');

    if (filterBtns.length > 0 && gridBentoItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Đổi trạng thái active của nút
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');

                gridBentoItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        item.classList.remove('is-hidden');
                    } else {
                        item.classList.add('is-hidden');
                    }
                });
            });
        });
    }

    /* ==========================================================================
       2. XỬ LÝ BOTTOM SLIDER
       ========================================================================== */
    const track = document.getElementById('bottomSliderTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');

    if (track) {
        let currentTranslate = 0;
        const items = track.querySelectorAll('.bento-item');

        function getMetrics() {
            if (items.length === 0) return { stepWidth: 0, maxTranslate: 0 };
            const itemWidth = items[0].getBoundingClientRect().width;
            const gap = 15;
            const visibleWidth = track.parentElement.clientWidth;
            const totalWidth = track.scrollWidth;
            
            const maxTranslate = Math.max(0, totalWidth - visibleWidth);
            const stepWidth = itemWidth + gap;

            return { stepWidth, maxTranslate };
        }

        function updateSliderPosition() {
            track.style.transform = `translateX(-${currentTranslate}px)`;
            updateButtonStates();
        }

        function updateButtonStates() {
            if (!prevBtn || !nextBtn) return;
            const { maxTranslate } = getMetrics();

            // Kiểm tra nút Prev (ở đầu trang thì mờ)
            if (currentTranslate <= 2) {
                prevBtn.classList.add('disabled');
            } else {
                prevBtn.classList.remove('disabled');
            }

            // Kiểm tra nút Next (ở cuối trang thì mờ)
            if (currentTranslate >= maxTranslate - 2) {
                nextBtn.classList.add('disabled');
            } else {
                nextBtn.classList.remove('disabled');
            }
        }

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', function() {
                const { stepWidth, maxTranslate } = getMetrics();
                currentTranslate += stepWidth;
                
                if (currentTranslate > maxTranslate) {
                    currentTranslate = maxTranslate;
                }
                
                updateSliderPosition();
            });

            prevBtn.addEventListener('click', function() {
                const { stepWidth, maxTranslate } = getMetrics();
                currentTranslate -= stepWidth;
                
                if (currentTranslate < 0) {
                    currentTranslate = 0;
                }
                
                updateSliderPosition();
            });
        }

        /* ----- THÊM VUỐT TOUCH TRÊN MOBILE/TABLET ----- */
        let startX = 0;
        let isDragging = false;
        let startTranslate = 0;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startTranslate = currentTranslate;
            isDragging = true;
            track.style.transition = 'none';
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            const { maxTranslate } = getMetrics();

            let targetTranslate = startTranslate + diff;
            if (targetTranslate < 0) targetTranslate = 0;
            if (targetTranslate > maxTranslate) targetTranslate = maxTranslate;

            currentTranslate = targetTranslate;
            track.style.transform = `translateX(-${currentTranslate}px)`;
        }, { passive: true });

        track.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
            updateButtonStates();
        });

        // Cập nhật lại trạng thái nút sau khi ảnh load xong hoàn toàn & khi resize
        window.addEventListener('load', updateButtonStates);
        window.addEventListener('resize', function() {
            const { maxTranslate } = getMetrics();
            if (currentTranslate > maxTranslate) {
                currentTranslate = maxTranslate;
            }
            updateSliderPosition();
        });

        updateButtonStates();
    }
});








document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('bottomSliderTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const progressBar = document.getElementById('sliderProgressBar');

    if (track) {
        let currentTranslate = 0;
        const items = track.querySelectorAll('.bento-item');

        // Hàm tính toán các thông số khoảng cách
        function getMetrics() {
            if (items.length === 0) return { stepWidth: 0, maxTranslate: 0 };
            
            const itemWidth = items[0].getBoundingClientRect().width;
            
            // Lấy gap thực tế từ CSS (trên Mobile là 12px)
            const trackStyle = window.getComputedStyle(track);
            const gap = parseFloat(trackStyle.gap) || 12;

            const visibleWidth = track.parentElement.clientWidth;
            const totalWidth = track.scrollWidth;
            
            const maxTranslate = Math.max(0, totalWidth - visibleWidth);
            const stepWidth = itemWidth + gap;

            return { stepWidth, maxTranslate };
        }

        // Cập nhật vị trí Slider & Progress Bar & Trạng thái Nút
        function updateSliderPosition(animate = true) {
            if (animate) {
                // Trượt mượt & có độ đầm bằng cubic-bezier
                track.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            } else {
                track.style.transition = 'none';
            }

            track.style.transform = `translateX(-${currentTranslate}px)`;
            updateButtonStates();
            updateProgressBar();
        }

        // Cập nhật Progress Bar (Thanh đen 20% -> Khoảng trượt max = 400%)
        function updateProgressBar() {
            if (!progressBar) return;
            const { maxTranslate } = getMetrics();

            if (maxTranslate > 0) {
                const ratio = currentTranslate / maxTranslate;
                // Vạch đen 20%, khoảng trượt tối đa là (100% - 20%) / 20% = 400%
                const translatePercent = ratio * 400; 
                progressBar.style.transform = `translateX(${translatePercent}%)`;
            } else {
                progressBar.style.transform = `translateX(0)`;
            }
        }

        // Cập nhật trạng thái mờ của nút Prev/Next (cho Desktop/Tablet)
        function updateButtonStates() {
            if (!prevBtn || !nextBtn) return;
            const { maxTranslate } = getMetrics();

            if (currentTranslate <= 2) {
                prevBtn.classList.add('disabled');
            } else {
                prevBtn.classList.remove('disabled');
            }

            if (currentTranslate >= maxTranslate - 2) {
                nextBtn.classList.add('disabled');
            } else {
                nextBtn.classList.remove('disabled');
            }
        }

        // Xử lý Click Nút (Desktop / Tablet)
        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', function() {
                const { stepWidth, maxTranslate } = getMetrics();
                currentTranslate += stepWidth;
                if (currentTranslate > maxTranslate) currentTranslate = maxTranslate;
                updateSliderPosition(true);
            });

            prevBtn.addEventListener('click', function() {
                const { stepWidth, maxTranslate } = getMetrics();
                currentTranslate -= stepWidth;
                if (currentTranslate < 0) currentTranslate = 0;
                updateSliderPosition(true);
            });
        }

        /* ==========================================================================
           VUỐT TOUCH MOBILE: CÓ ĐỘ NÍU (RESISTANCE) + TỰ SNAP VỀ THẺ NẰM GẦN NHẤT
           ========================================================================== */
        let startX = 0;
        let isDragging = false;
        let startTranslate = 0;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startTranslate = currentTranslate;
            isDragging = true;
            track.style.transition = 'none'; // Phản hồi tức thì theo tay kéo
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            const diff = startX - currentX; // Lực kéo của ngón tay
            const { maxTranslate } = getMetrics();

            // Áp hệ số 0.85 tạo độ níu/đầm tay khi kéo
            let targetTranslate = startTranslate + (diff * 0.85);

            // Tạo lực cản lò xo (rubber-band) nếu kéo lố 2 đầu biên
            if (targetTranslate < 0) {
                targetTranslate = targetTranslate * 0.3;
            } else if (targetTranslate > maxTranslate) {
                const overscroll = targetTranslate - maxTranslate;
                targetTranslate = maxTranslate + (overscroll * 0.3);
            }

            currentTranslate = targetTranslate;
            track.style.transform = `translateX(-${currentTranslate}px)`;
            updateProgressBar();
        }, { passive: true });

        track.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;

            const { stepWidth, maxTranslate } = getMetrics();

            // SNAP LOGIC: Tính toán và hút về mép card gần nhất
            if (stepWidth > 0) {
                const nearestIndex = Math.round(currentTranslate / stepWidth);
                currentTranslate = nearestIndex * stepWidth;
            }

            // Ép giới hạn không cho vượt quá biên
            if (currentTranslate < 0) currentTranslate = 0;
            if (currentTranslate > maxTranslate) currentTranslate = maxTranslate;

            // Bật transition trượt đầm vào đúng vị trí card
            updateSliderPosition(true);
        });

        // Tải trang & Resize
        window.addEventListener('load', () => updateSliderPosition(false));
        window.addEventListener('resize', () => {
            const { maxTranslate } = getMetrics();
            if (currentTranslate > maxTranslate) {
                currentTranslate = maxTranslate;
            }
            updateSliderPosition(false);
        });

        updateSliderPosition(false);
    }
});