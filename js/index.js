document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const megaMenu = document.getElementById('megaMenu');
    const triggers = document.querySelectorAll('.has-dropdown');
    const langTrigger = document.getElementById('lang-trigger');
    const langDropdown = document.querySelector('.lang-dropdown');
    const body = document.body;
    
    let closeTimer;

    // --- HÀM CƠ CHẾ ĐÓNG/MỞ ---
    const setHeaderWhite = (isActive) => {
        if (isActive) {
            header.classList.add('header-is-white');
        } else {
            // Chỉ gỡ màu trắng nếu KHÔNG mở Lang và KHÔNG hover Mega
            if (body.getAttribute('data-lang-active') !== 'true' && !megaMenu.classList.contains('is-visible')) {
                header.classList.remove('header-is-white');
            }
        }
    };

    // 1. CLICK LANG (ƯU TIÊN SỐ 1 - ĐÓNG MỞ TỨC THÌ)
    langTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        langTrigger.classList.toggle('is-active');
        const isOpen = body.getAttribute('data-lang-active') === 'true';

        if (!isOpen) {
            // MỞ: Ép Header trắng ngay lập tức
            body.setAttribute('data-lang-active', 'true');
            langDropdown.style.display = 'block';
            megaMenu.classList.remove('is-visible'); // Đóng mega menu nếu đang mở
            header.classList.add('header-is-white');
        } else {
            // ĐÓNG: Tắt ngay lập tức
            body.setAttribute('data-lang-active', 'false');
            langDropdown.style.display = 'none';
            if (!header.matches(':hover')) {
                header.classList.remove('header-is-white');
            }
        }
    });

    // 2. HOVER MEGA MENU (GIỮ NGUYÊN NHỊP TRỄ 300MS)
    triggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', () => {
            // Vào Mega thì tự động dẹp Lang
            body.setAttribute('data-lang-active', 'false');
            langDropdown.style.display = 'none';

            clearTimeout(closeTimer);
            megaMenu.classList.add('is-visible');
            setHeaderWhite(true);
            
            // Logic hiện section của mày
            const targetId = `menu-${trigger.getAttribute('data-menu')}`;
            document.querySelectorAll('.mega-section').forEach(sec => {
                sec.classList.toggle('is-active', sec.id === targetId);
            });
        });
    });

    // 3. LOGIC THOÁT (MOUSEMOVE/MOUSELEAVE)
    const handleExit = (e) => {
        // Nếu Lang đang mở, vô hiệu hóa hoàn toàn logic thoát này
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

    // 4. CLICK RA NGOÀI (ĐÓNG LANG TỨC THÌ)
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

    // Giữ menu khi hover vào vùng trắng
    megaMenu.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    megaMenu.addEventListener('mouseleave', (e) => {
        if (!header.contains(e.relatedTarget)) handleExit(e);
    });






   
// --- LOGIC CHỌN NGÔN NGỮ (BẢN ĐÓNG CỰC MẠNH) ---
const langItems = document.querySelectorAll('.lang-item');
const currentLangText = document.querySelector('#lang-trigger span'); 
const currentLangFlag = document.querySelector('#lang-trigger .flag-icon');

// Kiểm tra bộ nhớ khi vừa load trang
const savedLang = localStorage.getItem('selectedLanguage');
const savedFlag = localStorage.getItem('selectedFlag');
if (savedLang && savedFlag) {
    currentLangText.innerText = savedLang;
    currentLangFlag.src = savedFlag;
}

langItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation(); 

        const flagSrc = item.querySelector('img').src;
        const fullText = item.querySelector('span').innerText;
        const match = fullText.match(/\(([^)]+)\)/);
        const langCode = match ? match[1] : fullText;

        // 1. Cập nhật giao diện & Bộ nhớ
        currentLangText.innerText = langCode;
        currentLangFlag.src = flagSrc;
        localStorage.setItem('selectedLanguage', langCode);
        localStorage.setItem('selectedFlag', flagSrc);

        // 2. ĐÓNG DỨT KHOÁT (Xóa điều kiện hover để nó đóng ngay lập tức)
        body.setAttribute('data-lang-active', 'false');
        langTrigger.classList.remove('is-active');
        langDropdown.style.display = 'none';
        header.classList.remove('header-is-white'); // Đóng cái rụp bất chấp chuột ở đâu

        // 3. Cập nhật class active
        langItems.forEach(li => li.classList.remove('active'));
        item.classList.add('active');
    });
});
// CHỈ BỔ SUNG ĐOẠN NÀY ĐỂ FIX LỖI BẤM RA NGOÀI [cite: 2026-02-11]
window.addEventListener('click', (e) => {
    // Nếu cái menu đang mở (is-active) và mày bấm trượt ra ngoài vùng trigger/dropdown
    if (langTrigger.classList.contains('is-active') && !langTrigger.contains(e.target) && !langDropdown.contains(e.target)) {
        
        // Thì ép nó đóng lại và trả mũi tên về vị trí cũ [cite: 2026-02-11]
        body.setAttribute('data-lang-active', 'false');
        langTrigger.classList.remove('is-active');
        langDropdown.style.display = 'none';
        header.classList.remove('header-is-white');
    }
});
});





document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.m-trigger-btn');
    const closeBtn = document.querySelector('.close-menu');
    const menuOverlay = document.getElementById('mobileMenu');
    

    if (hamburger && menuOverlay) {
        hamburger.onclick = () => {
            menuOverlay.style.display = 'flex'; // Hiện khung trước
            setTimeout(() => {
                menuOverlay.classList.add('active'); // Rồi mới mờ dần (opacity) và bay menu ra
            }, 100);
            document.body.style.overflow = 'hidden'; // Chặn cuộn trang
        };
    }

    if (closeBtn && menuOverlay) {
        closeBtn.onclick = () => {document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.m-trigger-btn');
    const closeBtn = document.querySelector('.close-menu');
    const menuOverlay = document.getElementById('mobileMenu');

    if (hamburger && menuOverlay) {
        hamburger.onclick = () => {
            // Bước 1: Hiện cái khung và cái Shadow NGAY LẬP TỨC
            menuOverlay.style.display = 'flex'; 
            
            // Bước 2: Thêm class active ngay để Shadow (0s) ăn luôn, 
            // còn Menu (0.3s) sẽ bắt đầu mượt mà hiện ra
            menuOverlay.classList.add('active'); 
            
            document.body.style.overflow = 'hidden';
        };
    }

    if (closeBtn && menuOverlay) {
        closeBtn.onclick = () => {
            // Khi đóng, Shadow cũng mất ngay (0s) còn Menu mờ dần
            menuOverlay.classList.remove('active');
            
            setTimeout(() => {
                menuOverlay.style.display = 'none';
            }, 300); // Chờ menu mờ hết mới ẩn display
            document.body.style.overflow = 'auto';
        };
    }
});
            menuOverlay.classList.remove('active'); // Làm mờ nền và thu menu lại
            setTimeout(() => {
                menuOverlay.style.display = 'none'; // Sau khi hiệu ứng xong mới ẩn hẳn
            }, 100); 
            document.body.style.overflow = 'auto'; // Mở lại cuộn trang
        };
    }

    // Click vào vùng tối (overlay) để đóng menu cho giống QUOC
    menuOverlay.addEventListener('click', (e) => {
        // Nếu click đúng vào cái nền (chứ không phải vào cái menu trắng bên trong)
        if (e.target === menuOverlay) {
            closeBtn.click();
        }
    });
});










const spTrack = document.querySelector('.luot-track');
const spNext = document.querySelector('.next');
const spPrev = document.querySelector('.prev');
const spBar = document.querySelector('.luot-progress-bar');
const spViewport = document.querySelector('.luot-viewport');

let spIdx = 0;

function syncSlider() {
    if (window.innerWidth <= 768) {
        spTrack.style.transform = 'none';
        return;
    }
    const card = document.querySelector('.sanpham-card');
    if (!card) return;
    
    const move = spIdx * (card.offsetWidth + 25);
    spTrack.style.transform = `translateX(-${move}px)`;

    // Update bar & buttons cho Desktop
    if (spBar) spBar.style.width = `${50 + (spIdx * 25)}%`;
    if (spPrev) spPrev.style.opacity = spIdx === 0 ? "0.3" : "1";
    if (spNext) spNext.style.opacity = spIdx >= 2 ? "0.3" : "1";
}

// --- LOGIC MOBILE: FIX NHẠY & CHẠY DỨT KHOÁT ---
if (spViewport) {
    let isScrolling; // Biến kiểm soát khung hình

    spViewport.addEventListener('scroll', () => {
        if (window.innerWidth <= 768 && spBar) {
            // Hủy frame cũ nếu đang đợi, giúp giảm độ nhạy dư thừa
            window.cancelAnimationFrame(isScrolling);

            isScrolling = window.requestAnimationFrame(() => {
                const scrollLeft = spViewport.scrollLeft;
                const maxScroll = spViewport.scrollWidth - spViewport.clientWidth;
                
                // Tính % dựa trên vị trí cuộn (0 đến 1)
                const percentage = maxScroll > 0 ? scrollLeft / maxScroll : 0;

                // Cập nhật thanh bar: Bắt đầu từ 20%, kết thúc 100%
                const finalWidth = 20 + (percentage * 80);
                
                // Tắt transition để thanh bar bám sát tay, dùng toFixed để mượt hơn
                spBar.style.transition = 'none'; 
                spBar.style.width = `${finalWidth.toFixed(2)}%`;
            });
        }
    }, { passive: true });
}

// Event Listeners cho Desktop
spNext?.addEventListener('click', () => { if (spIdx < 2) { spIdx++; syncSlider(); } });
spPrev?.addEventListener('click', () => { if (spIdx > 0) { spIdx--; syncSlider(); } });

window.addEventListener('resize', () => {
    if (window.innerWidth <= 768 && spBar) {
        // Nếu resize về mobile, reset nhẹ để tính lại theo scroll
        spBar.style.width = '20%';
    }
    syncSlider();
});

syncSlider();









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
  





const track = document.getElementById('sliderTrack');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

let counter = 0;

// Tính toán kích thước dịch chuyển: 1 Card + 1 Gap
// Tao lấy trực tiếp từ CSS để đảm bảo độ chính xác
const getSlideWidth = () => {
    const card = document.querySelector('.discover-card');
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.columnGap) || 20; // Lấy gap từ CSS
    return card.offsetWidth + gap;
};

nextBtn.addEventListener('click', () => {
    const cards = document.querySelectorAll('.discover-card');
    const containerWidth = document.querySelector('.slider-container').offsetWidth;
    const trackWidth = track.scrollWidth; // Tổng độ dài của cả 5 hình
    
    // Tính xem còn bao nhiêu khoảng trống có thể trượt được
    // Nếu khoảng cách đã trượt cộng với chiều rộng khung nhìn mà vẫn nhỏ hơn tổng độ dài track thì mới cho trượt tiếp
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
    const dragDistance = touchStartX - touchCurrentX;

    // Nếu vuốt ngang mạnh hơn vuốt dọc thì chặn cuộn trang để ưu tiên slider
    if (Math.abs(dragDistance) > 10) {
        // e.preventDefault(); // Mở cái này nếu mày muốn khóa cuộn dọc khi đang vuốt ngang
    }
}, { passive: false });

track.addEventListener('touchend', () => {
    const swipeDistance = touchStartX - touchCurrentX;
    const threshold = 50; // Vuốt trên 50px mới tính là 1 lần chuyển slide

    if (swipeDistance > threshold) {
        // Vuốt sang trái -> Next
        nextBtn.click();
    } else if (swipeDistance < -threshold) {
        // Vuốt sang phải -> Prev
        prevBtn.click();
    }
    
    // Reset giá trị
    touchStartX = 0;
    touchCurrentX = 0;
});




document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.slider-container');
    const track = document.getElementById('sliderTrack');
    const progressBar = document.getElementById('progressBar');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    // Mảng 3 nấc của mày
    const steps = [60, 80, 100];
    let currentStep = 0; // 0 tương ứng với 60%

    const updateUI = () => {
        // 1. Cập nhật thanh progress
        if (progressBar) {
            progressBar.style.width = steps[currentStep] + '%';
        }

        // 2. Kiểm tra nút Prev (Lùi)
        if (currentStep === 0) {
            prevBtn.disabled = true;
            prevBtn.style.opacity = "0.3";
            prevBtn.style.cursor = "not-allowed";
        } else {
            prevBtn.disabled = false;
            prevBtn.style.opacity = "1";
            prevBtn.style.cursor = "pointer";
        }

        // 3. Kiểm tra nút Next (Tới)
        if (currentStep === steps.length - 1) {
            nextBtn.disabled = true;
            nextBtn.style.opacity = "0.3";
            nextBtn.style.cursor = "not-allowed";
        } else {
            nextBtn.disabled = false;
            nextBtn.style.opacity = "1";
            nextBtn.style.cursor = "pointer";
        }
    };

    // Sự kiện click nút Tới
    nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            updateUI();
        }
    });

    // Sự kiện click nút Lùi
    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateUI();
        }
    });

    // Chạy lần đầu để nút Prev mờ ngay khi load trang
    updateUI();


// --- PHẦN FIX CHO MOBILE: KHÔNG CHẠM VÀO LOGIC NÚT BẤM ---
    const handleMobileProgress = () => {
        if (window.innerWidth <= 768) {
            const scrollWidth = container.scrollWidth - container.clientWidth;
            const scrollLeft = container.scrollLeft;

            // Mặc định xuất phát từ 20%, chạy dần đến 100%
            // Công thức: 20 + (Tỷ lệ cuộn thực tế * 80)
            const mobilePercent = 20 + (scrollLeft / scrollWidth) * 80;
            
            progressBar.style.width = mobilePercent + '%';
        }
    };

    // Chỉ chạy khi người dùng vuốt trên Mobile
    container.addEventListener('scroll', handleMobileProgress);

    // Ép mặc định 20% cho Mobile khi vừa load trang
    if (window.innerWidth <= 768) {
        progressBar.style.width = '20%';
    }
    // --- HẾT PHẦN FIX MOBILE ---


});












