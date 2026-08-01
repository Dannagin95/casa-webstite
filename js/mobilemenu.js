document.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.getElementById('main-nav-level'); 
    const subContainer = document.querySelector('.sub-menu-container');
    const backBtn = document.querySelector('.sub-back-trigger');
    const backText = document.querySelector('.back-text');
    const overlay = document.getElementById('mobileMenu');
    let menuHistory = []; 

    function resetMenuState() {
        menuHistory = [];
        if (subContainer) subContainer.style.display = 'none';
        if (backBtn) backBtn.style.display = 'none';
        
        document.querySelectorAll('.sub-menu-layer').forEach(layer => {
            layer.classList.remove('active');
            layer.style.display = 'none';
        });
        
        if (mainNav) {
            mainNav.classList.add('active');
            mainNav.style.display = 'flex';
        }
    }

    if (overlay) {
        const observer = new MutationObserver(() => {
            const isVisible = window.getComputedStyle(overlay).display !== 'none';
            if (isVisible) {
                document.documentElement.classList.add('menu-open');
                document.body.classList.add('menu-open');
            } else {
                document.documentElement.classList.remove('menu-open');
                document.body.classList.remove('menu-open');
            }
        });
        observer.observe(overlay, { attributes: true, attributeFilter: ['style', 'class'] });
    }

    function switchLevel(targetId, title) {
        const currentActive = document.querySelector('.mobile-nav.active, .sub-menu-layer.active');
        const targetLayer = document.getElementById(targetId);

        if (targetLayer) {
            if (currentActive) {
                menuHistory.push(currentActive.id);
                currentActive.classList.remove('active');
                currentActive.style.display = 'none';
            }
            
            if (subContainer) subContainer.style.display = 'block';
            targetLayer.classList.add('active');
            targetLayer.style.display = 'flex';
            
            if (backBtn) backBtn.style.display = 'flex';
            if (backText) backText.innerText = title || "Quay lại";
        }
    }

    document.querySelectorAll('.has-sub, .has-sub-level-3').forEach(item => {
        item.onclick = (e) => {
            e.stopPropagation();
            const targetId = item.getAttribute('data-sub');
            const title = item.innerText.trim();
            switchLevel(targetId, title);
        };
    });

    if (backBtn) {
        backBtn.onclick = (e) => {
            e.stopPropagation();
            const prevId = menuHistory.pop();
            const currentActive = document.querySelector('.sub-menu-layer.active');

            if (currentActive) {
                currentActive.classList.remove('active');
                currentActive.style.display = 'none';
            }

            const prevLayer = document.getElementById(prevId);
            if (prevLayer) {
                prevLayer.classList.add('active');
                prevLayer.style.display = 'flex';
                

                if (prevId === 'main-nav-level') {
                    if (backBtn) backBtn.style.display = 'none';
                    if (subContainer) subContainer.style.display = 'none';
                } else if (prevId === 'casa-sub') {
                    if (backText) backText.innerText = "CASA";
                } else if (prevId === 'product-sub') {
                    if (backText) backText.innerText = "Sản phẩm";
                } else {
                    if (backText) backText.innerText = "Quay lại";
                }
            }

            if (menuHistory.length === 0) {
                if (backBtn) backBtn.style.display = 'none';
                if (subContainer) subContainer.style.display = 'none';
            }
        };
    }

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;
            
            if (!isTablet) {
                if (e.target === overlay) {
                    const closeBtn = document.querySelector('.close-menu');
                    if (closeBtn) closeBtn.click();
                }
            }
        });

        overlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                const closeBtn = document.querySelector('.close-menu');
                if (closeBtn) {
                    closeBtn.click();
                } else {
                    overlay.style.display = 'none';
                }
                resetMenuState();
            });
        });
    }

    document.addEventListener('click', function(e) {
        const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;
        if (isTablet && overlay) {
            const isOpen = window.getComputedStyle(overlay).display !== 'none';
            if (isOpen) {
                const clickedInside = overlay.contains(e.target);
                const triggerBtn = e.target.closest('.hamburger-btn, .mobile-menu-trigger, .menu-toggle');
                if (!clickedInside && !triggerBtn) {
                    const closeBtn = overlay.querySelector('.close-menu');
                    if (closeBtn) {
                        closeBtn.click();
                    }
                }
            }
        }

        const closeMenuTrigger = e.target.closest('.close-menu');
        if (closeMenuTrigger) {
            resetMenuState();
        }

        const trigger = e.target.closest('.casa-lang-trigger');
        const closeBtn = e.target.closest('.casa-sheet-close');
        const sheetOverlay = e.target.closest('.casa-sheet-overlay');
        const item = e.target.closest('.casa-sheet-item');

        if (trigger) {
            document.body.classList.add('sheet-open');
            return;
        }

        if (closeBtn || sheetOverlay || item) {
            document.body.classList.remove('sheet-open');
            
            if (item) {
                const currentFlag = document.querySelector('.casa-current-flag');
                const currentText = document.querySelector('.casa-current-text');
                if (currentFlag) currentFlag.src = item.getAttribute('data-flag');
                if (currentText) currentText.textContent = item.getAttribute('data-lang');
                
                document.querySelectorAll('.casa-sheet-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
        }
    });

    window.addEventListener('pageshow', (event) => {
        if (overlay) {
            overlay.style.display = 'none';
        }
        resetMenuState();
        document.body.classList.remove('sheet-open');
        document.documentElement.classList.remove('menu-open');
        document.body.classList.remove('menu-open');
    });
});