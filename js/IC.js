document.addEventListener("DOMContentLoaded", () => {
        const filterBtns = document.querySelectorAll(".filter-btn");
        const bentoItems = document.querySelectorAll(".bento-item");

        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                // Đổi trạng thái active của nút
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const filterValue = btn.getAttribute("data-filter");

                bentoItems.forEach(item => {
                    const category = item.getAttribute("data-category");
                    if (filterValue === "all" || category === filterValue) {
                        item.classList.remove("is-hidden");
                    } else {
                        item.classList.add("is-hidden");
                    }
                });
            });
        });
    });






    

    document.addEventListener('DOMContentLoaded', function() {
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

        // Cập nhật vị trí slider và trạng thái ẩn/mờ của nút
        function updateSliderPosition() {
            track.style.transform = `translateX(-${currentTranslate}px)`;
            updateButtonStates();
        }

        // Hàm kiểm tra và bật/tắt class disabled cho 2 nút
        function updateButtonStates() {
            if (!prevBtn || !nextBtn) return;
            const { maxTranslate } = getMetrics();

            // 1. Kiểm tra nút Prev (ở đầu trang thì mờ)
            if (currentTranslate <= 0) {
                prevBtn.classList.add('disabled');
            } else {
                prevBtn.classList.remove('disabled');
            }

            // 2. Kiểm tra nút Next (ở cuối trang thì mờ)
            // Trừ 2px để tránh sai số làm tròn pixel của trình duyệt
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

        // Kích hoạt kiểm tra trạng thái nút ngay lần đầu tải trang
        updateButtonStates();

        // Cân chỉnh lại khi người dùng resize trình duyệt
        window.addEventListener('resize', function() {
            const { maxTranslate } = getMetrics();
            if (currentTranslate > maxTranslate) {
                currentTranslate = maxTranslate;
            }
            updateSliderPosition();
        });
    }
});