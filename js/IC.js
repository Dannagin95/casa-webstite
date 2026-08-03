document.addEventListener('DOMContentLoaded', function() {

    /* ==========================================================================
       1. XỬ LÝ LỌC DANH MỤC (FILTER TABS)
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    // FIX LỖI: Chỉ lấy các bento-item nằm trong GRID CHÍNH, KHÔNG lấy trong Slider!
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