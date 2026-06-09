const topBarData = [
    { text: "Chính sách bảo hành - tìm hiểu ngay", link: "/baohanh.html" },
    { text: "Ghé thăm chúng tôi - xem bản đồ", link: "/showroom.html" }
];

let currentIndex = 0;
let isAnimating = false; // Chặn spam click liên tục
let autoFlipTimer;

function toggleTopbar() {
    if (isAnimating) return;
    isAnimating = true;

    const container = document.querySelector('.top-bar-content');
    const textElement = document.getElementById('top-bar-text');
    const linkElement = document.getElementById('top-bar-link');

    // Bước 1: Kích hoạt hiệu ứng biến mất
    container.classList.add('is-changing');

    // Bước 2: Đợi hiệu ứng mờ đi xong (400ms) rồi mới đổi chữ
    setTimeout(() => {
        currentIndex = currentIndex === 0 ? 1 : 0;
        
        textElement.innerText = topBarData[currentIndex].text;
        linkElement.href = topBarData[currentIndex].link;

        // Bước 3: Hiện chữ mới lên
        container.classList.remove('is-changing');
        
        // Giải phóng để có thể click tiếp
        setTimeout(() => { isAnimating = false; }, 400);
    }, 400);
}


/**
 * START AUTO PLAY
 * Sets an interval to trigger the toggle every 4 seconds.
 */
const startAutoFlip = () => {
    // Clear any existing timer to prevent duplicates
    if (autoFlipTimer) clearInterval(autoFlipTimer);
    
    autoFlipTimer = setInterval(() => {
        toggleTopbar();
    }, 4000); // 4000ms = 4 seconds
};

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // Start the auto-flip immediately on page load
    startAutoFlip();

    // OPTIONAL: Reset timer when user manually clicks (Next/Prev buttons)
    // Assuming your buttons have these classes:
    const nextBtn = document.querySelector('.top-bar-next'); 
    const prevBtn = document.querySelector('.top-bar-prev');

    [nextBtn, prevBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                toggleTopbar();
                startAutoFlip(); // Reset the 4s countdown
            });
        }
    });
});
// ==== topbar.js =====