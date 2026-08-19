document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const megaMenu = document.getElementById('megaMenu');
    const triggers = document.querySelectorAll('.has-dropdown');
    const langTrigger = document.getElementById('lang-trigger');
    const langDropdown = document.querySelector('.lang-dropdown');
    const body = document.body;

    // Nếu thiếu bất kỳ phần tử cốt lõi nào của header, dừng luôn khối này
    // (tránh lỗi null trên các trang không có đủ header giống trang chủ)
    if (!header || !megaMenu || !langTrigger || !langDropdown) return;

    let closeTimer;

    // --- HÀM CƠ CHẾ ĐÓNG/MỞ ---
    const setHeaderWhite = (isActive) => {
        if (isActive) {
            header.classList.add('header-is-white');
        } else {
            if (body.getAttribute('data-lang-active') !== 'true' && !megaMenu.classList.contains('is-visible')) {
                header.classList.remove('header-is-white');
            }
        }
    };

    // 1. CLICK LANG
    langTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        langTrigger.classList.toggle('is-active');
        const isOpen = body.getAttribute('data-lang-active') === 'true';

        if (!isOpen) {
            body.setAttribute('data-lang-active', 'true');
            langDropdown.style.display = 'block';
            megaMenu.classList.remove('is-visible');
            header.classList.add('header-is-white');
        } else {
            body.setAttribute('data-lang-active', 'false');
            langDropdown.style.display = 'none';
            if (!header.matches(':hover')) {
                header.classList.remove('header-is-white');
            }
        }
    });

    // 2. HOVER MEGA MENU
    triggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', () => {
            body.setAttribute('data-lang-active', 'false');
            langDropdown.style.display = 'none';

            clearTimeout(closeTimer);
            megaMenu.classList.add('is-visible');
            setHeaderWhite(true);

            const targetId = `menu-${trigger.getAttribute('data-menu')}`;
            document.querySelectorAll('.mega-section').forEach(sec => {
                sec.classList.toggle('is-active', sec.id === targetId);
            });
        });
    });

    // 3. LOGIC THOÁT
    const handleExit = (e) => {
        if (body.getAttribute('data-lang-active') === 'true') return;

        const isOverTrigger = Array.from(triggers).some(t => t.contains(e.target));
        if (!isOverTrigger && !megaMenu.contains(e.target)) {
            clearTimeout(closeTimer);
            closeTimer = setTimeout(() => {
                megaMenu.classList.remove('is-visible');
                setTimeout(() => setHeaderWhite(false), 300);
            }, 300);
        }
    };

    header.addEventListener('mousemove', handleExit);
    header.addEventListener('mouseleave', (e) => {
        if (!megaMenu.contains(e.relatedTarget)) handleExit(e);
    });

    // 4. CLICK RA NGOÀI
    document.addEventListener('click', (e) => {
        if (!langTrigger.contains(e.target)) {
            if (body.getAttribute('data-lang-active') === 'true') {
                body.setAttribute('data-lang-active', 'false');
                langDropdown.style.display = 'none';
                if (!header.matches(':hover')) {
                    header.classList.remove('header-is-white');
                }
            }
        }
    });

    megaMenu.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    megaMenu.addEventListener('mouseleave', (e) => {
        if (!header.contains(e.relatedTarget)) handleExit(e);
    });

    // --- LOGIC CHỌN NGÔN NGỮ ---
    const langItems = document.querySelectorAll('.lang-item');
    const currentLangText = document.querySelector('#lang-trigger span');
    const currentLangFlag = document.querySelector('#lang-trigger .flag-icon');

    if (currentLangText && currentLangFlag) {
        const savedLang = localStorage.getItem('selectedLanguage');
        const savedFlag = localStorage.getItem('selectedFlag');
        if (savedLang && savedFlag) {
            currentLangText.innerText = savedLang;
            currentLangFlag.src = savedFlag;
        }
    }

    langItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();

            const flagSrc = item.querySelector('img').src;
            const fullText = item.querySelector('span').innerText;
            const match = fullText.match(/\(([^)]+)\)/);
            const langCode = match ? match[1] : fullText;

            if (currentLangText) currentLangText.innerText = langCode;
            if (currentLangFlag) currentLangFlag.src = flagSrc;
            localStorage.setItem('selectedLanguage', langCode);
            localStorage.setItem('selectedFlag', flagSrc);

            body.setAttribute('data-lang-active', 'false');
            langTrigger.classList.remove('is-active');
            langDropdown.style.display = 'none';
            header.classList.remove('header-is-white');

            langItems.forEach(li => li.classList.remove('active'));
            item.classList.add('active');
        });
    });

    window.addEventListener('click', (e) => {
        if (langTrigger.classList.contains('is-active') && !langTrigger.contains(e.target) && !langDropdown.contains(e.target)) {
            body.setAttribute('data-lang-active', 'false');
            langTrigger.classList.remove('is-active');
            langDropdown.style.display = 'none';
            header.classList.remove('header-is-white');
        }
    });
});


// --- MOBILE MENU (hamburger) ---
// LƯU Ý: bản gốc có 1 khối DOMContentLoaded bị dán lồng nhầm bên trong
// closeBtn.onclick, làm hỏng cấu trúc hàm. Đã dọn lại đúng, chỉ giữ 1 khối duy nhất.
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.m-trigger-btn');
    const closeBtn = document.querySelector('.close-menu');
    const menuOverlay = document.getElementById('mobileMenu');

    if (hamburger && menuOverlay) {
        hamburger.onclick = () => {
            menuOverlay.style.display = 'flex';
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
    }

    if (closeBtn && menuOverlay) {
        closeBtn.onclick = () => {
            menuOverlay.classList.remove('active');
            setTimeout(() => {
                menuOverlay.style.display = 'none';
            }, 300);
            document.body.style.overflow = 'auto';
        };
    }

    if (menuOverlay && closeBtn) {
        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay) {
                closeBtn.click();
            }
        });
    }
});


// --- SLIDER SẢN PHẨM ("Lượt") ---
const spTrack = document.querySelector('.luot-track');
const spNext = document.querySelector('.next');
const spPrev = document.querySelector('.prev');
const spBar = document.querySelector('.luot-progress-bar');
const spViewport = document.querySelector('.luot-viewport');

let spIdx = 0;

function syncSlider() {
    if (!spTrack) return;

    if (window.innerWidth < 1440) {
        spTrack.style.transform = 'none';
        return;
    }

    const card = document.querySelector('.sanpham-card');
    if (!card) return;

    const move = spIdx * (card.offsetWidth + 25);
    spTrack.style.transform = `translateX(-${move}px)`;

    if (spBar) {
        spBar.style.transition = 'width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        spBar.style.width = `${50 + (spIdx * 25)}%`;
    }

    if (spPrev) spPrev.style.opacity = spIdx === 0 ? "0.3" : "1";
    if (spNext) spNext.style.opacity = spIdx >= 2 ? "0.3" : "1";
}

if (spViewport) {
    let isScrolling;

    spViewport.addEventListener('scroll', () => {
        if (window.innerWidth < 1440 && spBar) {
            window.cancelAnimationFrame(isScrolling);

            isScrolling = window.requestAnimationFrame(() => {
                const scrollLeft = spViewport.scrollLeft;
                const maxScroll = spViewport.scrollWidth - spViewport.clientWidth;

                const percentage = maxScroll > 0 ? scrollLeft / maxScroll : 0;
                const finalWidth = 20 + (percentage * 80);

                spBar.style.transition = 'none';
                spBar.style.width = `${finalWidth.toFixed(2)}%`;
            });
        }
    }, { passive: true });
}

spNext?.addEventListener('click', () => {
    if (window.innerWidth >= 1440 && spIdx < 2) {
        spIdx++; syncSlider();
    }
});
spPrev?.addEventListener('click', () => {
    if (window.innerWidth >= 1440 && spIdx > 0) {
        spIdx--; syncSlider();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth < 1440 && spBar) {
        spBar.style.width = '20%';
    }
    syncSlider();
});

if (spTrack) syncSlider();


// --- FEATURES GRID DOTS (mobile) ---
document.addEventListener('DOMContentLoaded', function () {
    const grid = document.querySelector('.features-grid');
    const dots = document.querySelectorAll('.features-dots .feat-dot');

    if (grid && dots.length > 0) {
        grid.addEventListener('scroll', () => {
            const itemWidth = grid.clientWidth;
            const index = Math.round(grid.scrollLeft / itemWidth);

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        });
    }
});


// --- SLIDER "KHÁM PHÁ" (discover-card) - chỉ có ở trang chủ ---
const track = document.getElementById('sliderTrack');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

let counter = 0;

const getSlideWidth = () => {
    const card = document.querySelector('.discover-card');
    if (!card || !track) return 0;
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.columnGap) || 20;
    return card.offsetWidth + gap;
};

if (track && nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
        const containerEl = document.querySelector('.slider-container');
        if (!containerEl) return;
        const containerWidth = containerEl.offsetWidth;
        const trackWidth = track.scrollWidth;

        const currentTranslate = getSlideWidth() * (counter + 1);

        if (currentTranslate + containerWidth <= trackWidth + getSlideWidth()) {
            counter++;
            const amountToMove = getSlideWidth() * counter;
            track.style.transform = `translateX(-${amountToMove}px)`;
        }
    });

    prevBtn.addEventListener('click', () => {
        if (counter > 0) {
            counter--;
            const amountToMove = getSlideWidth() * counter;
            track.style.transform = `translateX(-${amountToMove}px)`;
        }
    });

    let touchStartX = 0;
    let touchCurrentX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    }, { passive: false });

    track.addEventListener('touchmove', e => {
        touchCurrentX = e.touches[0].clientX;
    }, { passive: false });

    track.addEventListener('touchend', () => {
        const swipeDistance = touchStartX - touchCurrentX;
        const threshold = 50;

        if (swipeDistance > threshold) {
            nextBtn.click();
        } else if (swipeDistance < -threshold) {
            prevBtn.click();
        }

        touchStartX = 0;
        touchCurrentX = 0;
    });
}


// --- PROGRESS BAR 3 NẤC (đi kèm slider "Khám phá") - chỉ có ở trang chủ ---
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.slider-container');
    const trackEl = document.getElementById('sliderTrack');
    const progressBar = document.getElementById('progressBar');
    const nextBtnEl = document.getElementById('nextBtn');
    const prevBtnEl = document.getElementById('prevBtn');

    if (!container || !trackEl || !progressBar || !nextBtnEl || !prevBtnEl) return;

    const steps = [60, 80, 100];
    let currentStep = 0;

    const updateUI = () => {
        progressBar.style.width = steps[currentStep] + '%';

        if (currentStep === 0) {
            prevBtnEl.disabled = true;
            prevBtnEl.style.opacity = "0.3";
            prevBtnEl.style.cursor = "not-allowed";
        } else {
            prevBtnEl.disabled = false;
            prevBtnEl.style.opacity = "1";
            prevBtnEl.style.cursor = "pointer";
        }

        if (currentStep === steps.length - 1) {
            nextBtnEl.disabled = true;
            nextBtnEl.style.opacity = "0.3";
            nextBtnEl.style.cursor = "not-allowed";
        } else {
            nextBtnEl.disabled = false;
            nextBtnEl.style.opacity = "1";
            nextBtnEl.style.cursor = "pointer";
        }
    };

    nextBtnEl.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            updateUI();
        }
    });

    prevBtnEl.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateUI();
        }
    });

    updateUI();

    const handleMobileProgress = () => {
        if (window.innerWidth <= 768) {
            const scrollWidth = container.scrollWidth - container.clientWidth;
            const scrollLeft = container.scrollLeft;
            const mobilePercent = 20 + (scrollWidth > 0 ? (scrollLeft / scrollWidth) * 80 : 0);
            progressBar.style.width = mobilePercent + '%';
        }
    };

    container.addEventListener('scroll', handleMobileProgress);

    if (window.innerWidth <= 768) {
        progressBar.style.width = '20%';
    }
});
