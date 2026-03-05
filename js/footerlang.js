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