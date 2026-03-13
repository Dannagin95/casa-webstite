const topBarData = [
    { text: "Chính sách bảo hành - tìm hiểu ngay", link: "/baohanh.html" },
    { text: "Ghé thăm chúng tôi - xem bản đồ", link: "/showroom.html" }
];

let currentIndex = 0;
let isAnimating = false; // Chặn spam click liên tục

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