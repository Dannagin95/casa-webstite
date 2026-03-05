const langSelector = document.getElementById('langgSelector');
const langDropdown = document.getElementById('langgDropdown');

// 1. Mở/Đóng bảng [cite: 2025-12-29]
langSelector.addEventListener('click', function(e) {
    e.stopPropagation();
    
    if (window.innerWidth <= 1024) {
        // MOBILE: Dùng đúng class 'footer-sheet-open' cho khớp với CSS nút X [cite: 2026-02-11]
        document.body.classList.add('footer-sheet-open');
        langDropdown.classList.remove('active');
        this.classList.remove('open');
    } else {
        // DESKTOP [cite: 2025-12-29]
        this.classList.toggle('open');
        langDropdown.classList.toggle('active');
    }
});

// 2. Xử lý chọn item trong SHEET MOBILE (Đã đổi sang class lang-sheet-list) [cite: 2025-12-29]
document.querySelectorAll('.lang-sheet-list li').forEach(item => {
    item.addEventListener('click', function() {
        const flag = this.getAttribute('data-flag');
        const lang = this.getAttribute('data-lang');
        
        // Cập nhật Footer [cite: 2025-12-29]
        document.getElementById('currentFlag').src = flag;
        document.getElementById('currentLanggText').textContent = lang;
        
        // FIX LỖI ĐẬM NHẠT: Gỡ active cũ, thêm active mới [cite: 2025-12-29]
        document.querySelectorAll('.lang-sheet-list li').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        // Chọn xong đóng sheet [cite: 2026-02-11]
        document.body.classList.remove('footer-sheet-open');
    });
});

// 3. Xử lý chọn item trên DESKTOP (Giữ nguyên) [cite: 2025-12-29]
document.querySelectorAll('.langg-dropdown li').forEach(item => {
    item.addEventListener('click', function() {
        const flag = this.getAttribute('data-flag');
        const lang = this.getAttribute('data-lang');
        
        document.getElementById('currentFlag').src = flag;
        document.getElementById('currentLanggText').textContent = lang;
        
        document.querySelectorAll('.langg-dropdown li').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// 4. Nút X và Overlay (Sửa selector cho khớp lang-sheet) [cite: 2026-02-11]
const fClose = document.querySelector('.lang-sheet-close');
const fOverlay = document.querySelector('.lang-sheet-overlay');

if(fClose) fClose.addEventListener('click', () => document.body.classList.remove('footer-sheet-open'));
if(fOverlay) fOverlay.addEventListener('click', () => document.body.classList.remove('footer-sheet-open'));

document.addEventListener('click', () => {
    if (window.innerWidth > 1024) {
        langSelector.classList.remove('open');
        langDropdown.classList.remove('active');
    }
});








/*History - Journey - Realtime Step Logic*/
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('journeySlider');
    const progressBar = document.getElementById('journeyProgressBar');
    const nextBtn = document.querySelector('.journey-section .next-btn');
    const prevBtn = document.querySelector('.journey-section .prev-btn');

    if (slider && progressBar) {
        let currentStep = 0;
        const maxStepsMobile = 4; // 5 ảnh = 4 lần lướt

        const updateUI = (fromScroll = false) => {
            const isMobile = window.innerWidth <= 1024;
            
            // 1. Tính toán Progress theo nấc
            let progressWidth;
            if (isMobile) {
                progressWidth = currentStep * 25; // 0, 25, 50, 75, 100
            } else {
                // Giữ nguyên Desktop của mày
                const desktopMaxSteps = 2;
                const safeStep = Math.min(currentStep, desktopMaxSteps);
                progressWidth = 60 + (safeStep * 20);
            }
            
            progressBar.style.width = `${progressWidth}%`;

            // 2. Chỉ cuộn Slider nếu hàm này KHÔNG được gọi từ sự kiện 'scroll'
            // (Để tránh việc đang vuốt tay mà JS lại nhảy vào tranh chấp vị trí)
            if (!fromScroll) {
                const item = slider.querySelector('.journey-item');
                if (item) {
                    const gap = isMobile ? 9 : 12;
                    const stepWidth = item.offsetWidth + gap;
                    slider.scrollTo({
                        left: currentStep * stepWidth,
                        behavior: 'smooth'
                    });
                }
            }

            // 3. Disable nút trên Desktop
            if (nextBtn && prevBtn) {
                prevBtn.disabled = (currentStep === 0);
                nextBtn.disabled = (currentStep === (isMobile ? maxStepsMobile : 2));
            }
        };

        // Xử lý sự kiện cuộn tay - NHẠY TỨC THÌ
        slider.addEventListener('scroll', () => {
            if (window.innerWidth <= 1024) {
                const item = slider.querySelector('.journey-item');
                if (!item) return;
                
                const gap = 9;
                const stepWidth = item.offsetWidth + gap;
                
                // Tính xem vị trí hiện tại gần step nào nhất
                const newStep = Math.round(slider.scrollLeft / stepWidth);
                
                if (newStep !== currentStep) {
                    currentStep = newStep;
                    updateUI(true); // 'true' để báo là đang vuốt, đừng cuộn slider nữa
                }
            }
        }, { passive: true });

        // Giữ nguyên logic Click cho Desktop
        if (nextBtn && prevBtn) {
            const handleBtnClick = (dir) => {
                const limit = window.innerWidth <= 1024 ? maxStepsMobile : 2;
                if (dir === 'next' && currentStep < limit) currentStep++;
                else if (dir === 'prev' && currentStep > 0) currentStep--;
                updateUI(false); // 'false' để nó tự cuộn slider đến vị trí mới
            };
            nextBtn.onclick = () => handleBtnClick('next');
            prevBtn.onclick = () => handleBtnClick('prev');
        }

        updateUI();
        window.addEventListener('resize', () => updateUI());
    }
});



document.addEventListener('DOMContentLoaded', function() {
    const grid = document.querySelector('.features-grid');
    const dots = document.querySelectorAll('.features-dots .dot');

    if (grid && dots.length > 0) {
        grid.addEventListener('scroll', () => {
            // Tính toán index dựa trên vị trí cuộn
            // itemWidth là chiều rộng của một mục (100% màn hình)
            const itemWidth = grid.clientWidth; 
            const index = Math.round(grid.scrollLeft / itemWidth);

            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });
    }
});  
