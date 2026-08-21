const topBarDataVI = [
    { text: "Chính sách bảo hành - tìm hiểu ngay", link: "/baohanh.html" },
    { text: "Ghé thăm chúng tôi - xem bản đồ", link: "/showroom.html" }
];

const topBarDataEN = [
    { text: "Warranty policy - learn more", link: "/en/warranty.html" },
    { text: "Visit us - view map", link: "/en/showroom.html" }
];

const isEnglishPage =
    window.location.pathname === "/en" ||
    window.location.pathname === "/en/" ||
    window.location.pathname.startsWith("/en/");

const topBarData = isEnglishPage
    ? topBarDataEN
    : topBarDataVI;

let currentIndex = 0;
let isAnimating = false;
let autoFlipTimer;

function toggleTopbar() {
    if (isAnimating) return;
    isAnimating = true;

    const container = document.querySelector('.top-bar-content');
    const textElement = document.getElementById('top-bar-text');
    const linkElement = document.getElementById('top-bar-link');

    if (!container || !textElement || !linkElement) {
        isAnimating = false;
        return;
    }

    container.classList.add('is-changing');

    setTimeout(() => {
        currentIndex = currentIndex === 0 ? 1 : 0;

        textElement.innerText = topBarData[currentIndex].text;
        linkElement.href = topBarData[currentIndex].link;

        container.classList.remove('is-changing');

        setTimeout(() => {
            isAnimating = false;
        }, 400);
    }, 400);
}

const startAutoFlip = () => {
    if (autoFlipTimer) {
        clearInterval(autoFlipTimer);
    }

    autoFlipTimer = setInterval(() => {
        toggleTopbar();
    }, 4000);
};

document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('top-bar-text');
    const linkElement = document.getElementById('top-bar-link');

    if (textElement && linkElement) {
        textElement.innerText = topBarData[0].text;
        linkElement.href = topBarData[0].link;
    }

    startAutoFlip();

    const nextBtn = document.querySelector('.top-bar-next');
    const prevBtn = document.querySelector('.top-bar-prev');

    [nextBtn, prevBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                toggleTopbar();
                startAutoFlip();
            });
        }
    });
});