document.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.getElementById('main-nav-level'); 
    const subContainer = document.querySelector('.sub-menu-container');
    const backBtn = document.querySelector('.sub-back-trigger');
    const backText = document.querySelector('.back-text');
    const overlay = document.getElementById('mobileMenu');
    let menuHistory = []; 


    function switchLevel(targetId, title) {
        const currentActive = document.querySelector('.mobile-nav.active, .sub-menu-layer.active');
        const targetLayer = document.getElementById(targetId);

        if (targetLayer) {
            if (currentActive) {
                menuHistory.push(currentActive.id);
                currentActive.classList.remove('active');
                currentActive.style.display = 'none';
            }
            
            subContainer.style.display = 'block';
            targetLayer.classList.add('active');
            targetLayer.style.display = 'flex';
            
            backBtn.style.display = 'flex';
            backText.innerText = title || "Quay lại";
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

    
    backBtn.onclick = (e) => {
        e.stopPropagation();
        const prevId = menuHistory.pop();
        const currentActive = document.querySelector('.sub-menu-layer.active');

        if (currentActive) {
            currentActive.classList.remove('active');
            currentActive.style.display = 'none';
        }

        const prevLayer = document.getElementById(prevId);
        prevLayer.classList.add('active');
        prevLayer.style.display = (prevId === 'main-nav-level') ? 'flex' : 'flex';

        if (menuHistory.length === 0) {
            backBtn.style.display = 'none';
            subContainer.style.display = 'none';
        }
    };

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.querySelector('.close-menu').click();
        }
    });

    document.addEventListener('click', function(e) {
    const trigger = e.target.closest('.casa-lang-trigger');
    const closeBtn = e.target.closest('.casa-sheet-close');
    const overlay = e.target.closest('.casa-sheet-overlay');
    const item = e.target.closest('.casa-sheet-item');


    if (trigger) {
        document.body.classList.add('sheet-open');
        return;
    }

    // Đóng bảng & Trả mũi tên về vị trí cũ
    if (closeBtn || overlay || item) {
        document.body.classList.remove('sheet-open');
        
        if (item) {
            const currentFlag = document.querySelector('.casa-current-flag');
            const currentText = document.querySelector('.casa-current-text');
            currentFlag.src = item.getAttribute('data-flag');
            currentText.textContent = item.getAttribute('data-lang');
            
            document.querySelectorAll('.casa-sheet-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        }
    }
});
});






