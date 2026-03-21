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








/*History - Journey - Realtime Step Logic - ĐÃ FIX TRIỆT ĐỂ TABLET*/
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('journeySlider');
    const progressBar = document.getElementById('journeyProgressBar');
    const nextBtn = document.querySelector('.journey-section .next-btn');
    const prevBtn = document.querySelector('.journey-section .prev-btn');

    if (slider && progressBar) {
        let currentStep = 0;

        const updateUI = (fromScroll = false) => {
            const width = window.innerWidth;
            const isDesktop = width > 1439;

            // 1. TÍNH PROGRESS BAR
            if (isDesktop) {
                // Giữ nguyên logic Desktop của mày
                const desktopMaxSteps = 2;
                const safeStep = Math.min(currentStep, desktopMaxSteps);
                progressBar.style.width = `${60 + (safeStep * 20)}%`;
            } else {
                // TABLET & MOBILE: Chạy real-time theo pixel để đảm bảo 100%
                const maxScroll = slider.scrollWidth - slider.clientWidth;
                const currentScroll = slider.scrollLeft;
                let scrollPercent = (currentScroll / maxScroll) * 100;
                
                // Bẫy sai số: Gần cuối là ép 100%
                if (maxScroll - currentScroll < 5) scrollPercent = 100;
                if (currentScroll < 5) scrollPercent = 0;

                progressBar.style.width = `${scrollPercent}%`;
            }

            // 2. CHỈ CUỘN NẾU CLICK NÚT (KHÔNG PHẢI ĐANG VUỐT)
            if (!fromScroll) {
                const item = slider.querySelector('.journey-item');
                if (item) {
                    let gap = 12; 
                    if (width <= 1439 && width >= 820) gap = 15;
                    else if (width < 820 && width >= 768) gap = 10;
                    else if (width < 768) gap = 9;

                    const stepWidth = item.offsetWidth + gap;
                    slider.scrollTo({
                        left: currentStep * stepWidth,
                        behavior: 'smooth'
                    });
                }
            }

            // 3. DISABLE NÚT
            if (nextBtn && prevBtn) {
                const limit = isDesktop ? 2 : 4;
                prevBtn.disabled = (currentStep === 0);
                nextBtn.disabled = (currentStep >= limit);
            }
        };

        // XỬ LÝ CUỘN (CHỦ YẾU CHO TABLET/MOBILE)
        slider.addEventListener('scroll', () => {
            const width = window.innerWidth;
            if (width <= 1439) {
                // Cập nhật Progress bar real-time theo pixel
                const maxScroll = slider.scrollWidth - slider.clientWidth;
                let scrollPercent = (slider.scrollLeft / maxScroll) * 100;
                if (maxScroll - slider.scrollLeft < 5) scrollPercent = 100;
                progressBar.style.width = `${scrollPercent}%`;

                // Tính toán Step để disable nút và dùng cho resize
                const item = slider.querySelector('.journey-item');
                if (item) {
                    let gap = width >= 820 ? 15 : (width >= 768 ? 10 : 9);
                    const stepWidth = item.offsetWidth + gap;
                    const newStep = Math.round(slider.scrollLeft / stepWidth);
                    if (newStep !== currentStep) {
                        currentStep = newStep;
                        // Không gọi updateUI(true) ở đây để tránh giật, chỉ cập nhật nút
                        if (nextBtn && prevBtn) {
                            prevBtn.disabled = (currentStep === 0);
                            nextBtn.disabled = (currentStep >= 4);
                        }
                    }
                }
            }
        }, { passive: true });

        // LOGIC CLICK NÚT (DÀNH CHO DESKTOP)
        if (nextBtn && prevBtn) {
            const handleBtnClick = (dir) => {
                const limit = window.innerWidth > 1439 ? 2 : 4;
                if (dir === 'next' && currentStep < limit) currentStep++;
                else if (dir === 'prev' && currentStep > 0) currentStep--;
                updateUI(false);
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
