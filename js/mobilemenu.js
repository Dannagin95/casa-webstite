document.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.getElementById('main-nav-level'); 
    const subContainer = document.querySelector('.sub-menu-container');
    const backBtn = document.querySelector('.sub-back-trigger');
    const backText = document.querySelector('.back-text');
    const overlay = document.getElementById('mobileMenu') || document.querySelector('.mobile-overlay');
    const triggerBtn = document.querySelector('.m-trigger-btn');
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

    if (triggerBtn && overlay) {
        triggerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            overlay.style.display = 'flex';
            overlay.classList.add('active');
        });
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
                    overlay.classList.remove('active');
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
                const triggerBtnEl = e.target.closest('.m-trigger-btn');
                if (!clickedInside && !triggerBtnEl) {
                    const closeBtn = overlay.querySelector('.close-menu');
                    if (closeBtn) {
                        closeBtn.click();
                    } else {
                        overlay.style.display = 'none';
                        overlay.classList.remove('active');
                    }
                }
            }
        }

        const closeMenuTrigger = e.target.closest('.close-menu');
        if (closeMenuTrigger) {
            if (overlay) {
                overlay.style.display = 'none';
                overlay.classList.remove('active');
            }
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

    window.addEventListener('pageshow', () => {
        if (overlay) {
            overlay.style.display = 'none';
            overlay.classList.remove('active');
        }
        resetMenuState();
        document.body.classList.remove('sheet-open');
        document.documentElement.classList.remove('menu-open');
        document.body.classList.remove('menu-open');
    });
});









function applyCasaFont() {
    const className = "auto-casa-font";
    const regex = /(CASA Parquet|CASA)/g;

    if (!document.getElementById('casa-font-style')) {
        const style = document.createElement('style');
        style.id = 'casa-font-style';
        style.innerHTML = `
            /* Style font chữ CASA */
            .${className} { 
                font-family: var(--CASA-Parquet-font, 'Cal Sans'), sans-serif !important; 
                letter-spacing: 2px !important;
                font-weight: 400 !important;
                display: inline !important;
                white-space: nowrap !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
            }


            span .${className} {
                font-family: var(--CASA-Parquet-font, 'Cal Sans'), sans-serif !important; 
                font-weight: 600 !important; 
                letter-spacing: 1px !important; 
            }


            p .${className} {
                font-family: var(--CASA-Parquet-font, 'Cal Sans'), sans-serif !important; 
                font-weight: 600 !important; 
                letter-spacing: 1px !important; 
            }

            /* FIX CỐT LÕI: Dùng display: inline để giữ nguyên khoảng trắng (dấu cách) */
            .casa-wrapper-inline {
                display: inline !important;
            }
        `;
        document.head.appendChild(style);
    }

    function walkAndWrap(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                const parent = node.parentNode;
                if (!parent) return NodeFilter.FILTER_REJECT;
                const tag = parent.tagName ? parent.tagName.toLowerCase() : '';
                
                if (tag === 'script' || tag === 'style' || (parent.classList && (parent.classList.contains(className) || parent.classList.contains('casa-wrapper-inline')))) {
                    return NodeFilter.FILTER_REJECT;
                }
                
                regex.lastIndex = 0;
                if (regex.test(node.nodeValue)) {
                    regex.lastIndex = 0;
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_SKIP;
            }
        });

        let nodesToProcess = [];
        while (walker.nextNode()) {
            nodesToProcess.push(walker.currentNode);
        }

        nodesToProcess.forEach(node => {
            const val = node.nodeValue;
            const parent = node.parentNode;
            if (!parent) return;

            const frag = document.createDocumentFragment();
            let lastIdx = 0;
            let match;
            
            regex.lastIndex = 0;
            while ((match = regex.exec(val)) !== null) {
                const idx = match.index;
                const matchedText = match[0];

                if (idx > lastIdx) {
                    frag.appendChild(document.createTextNode(val.substring(lastIdx, idx)));
                }
                const span = document.createElement('span');
                span.className = className;
                span.textContent = matchedText;
                frag.appendChild(span);
                lastIdx = idx + matchedText.length;
            }

            if (lastIdx < val.length) {
                frag.appendChild(document.createTextNode(val.substring(lastIdx)));
            }

            const wrapper = document.createElement('span');
            wrapper.className = 'casa-wrapper-inline';
            wrapper.appendChild(frag);

            parent.replaceChild(wrapper, node);
        });
    }

    walkAndWrap(document.body);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCasaFont);
} else {
    applyCasaFont();
}