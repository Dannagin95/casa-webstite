document.addEventListener('DOMContentLoaded', () => {
    const scrollArea = document.getElementById('scrollArea');
    const thumb = document.getElementById('myThumb');
    const container = document.querySelector('.quoc-scroll-container');

    if (scrollArea && thumb) {
        scrollArea.onscroll = () => {
            const scrollTop = scrollArea.scrollTop;
            const scrollHeight = scrollArea.scrollHeight - scrollArea.clientHeight;
            const trackHeight = container.clientHeight - thumb.clientHeight;

            if (scrollHeight > 0) {
                const moveY = (scrollTop / scrollHeight) * trackHeight;
                thumb.style.transform = `translateY(${moveY}px)`;
            }
        };
    }
});





// Hàm này sẽ được gọi mỗi khi có người gõ phím
function checkValidation() {
    // 1. Xử lý cho Step 2
    const textarea = document.getElementById('issue-text');
    const step2 = document.getElementById('step-2');
    if (textarea && step2) {
        // Tìm cái nút Next nằm TRONG step-2
        const nextBtn2 = step2.querySelector('.btn-action');
        if (nextBtn2) {
            if (textarea.value.trim().length > 0) {
                nextBtn2.classList.remove('disabled');
                nextBtn2.removeAttribute('disabled'); // Thêm dòng này cho chắc
            } else {
                nextBtn2.classList.add('disabled');
                nextBtn2.setAttribute('disabled', 'true');
            }
        }
    }

    // --- Kiểm tra Step 3 (EMAIL) ---
    // Tao dùng querySelector để tìm cái input bên trong step-3 cho chắc ăn
    const step3 = document.getElementById('step-3');
    if (step3 && step3.classList.contains('active')) {
        const emailInput = step3.querySelector('input[type="email"]') || document.getElementById('email-input');
        const submitBtn = step3.querySelector('.btn-action');

        if (emailInput && submitBtn) {
            // Regex kiểm tra email chuẩn
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValueValid = emailPattern.test(emailInput.value.trim());

            if (isValueValid) {
                submitBtn.classList.remove('disabled');
                console.log("Email hợp lệ - Mở nút");
            } else {
                submitBtn.classList.add('disabled');
                console.log("Email chưa hợp lệ...");
            }
        }
    }
}

// Lắng nghe sự kiện gõ phím cho TẤT CẢ các input và textarea trên trang
document.addEventListener('input', (e) => {
    checkValidation();
});

// Hàm chuyển Step (Giữ nguyên logic của mày nhưng thêm checkValidation)
function goToStep(n) {
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    const targetStep = document.getElementById(`step-${n}`);
    if (targetStep) {
        targetStep.classList.add('active');
        
        // Luôn check ngay khi vừa hiện step mới
        checkValidation();

        // Cuộn cái "lõi" lên đầu (QUOC 100%)
        const viewport = targetStep.querySelector('.step2-viewport') || targetStep.querySelector('.scroll-area');
        if (viewport) viewport.scrollTop = 0;
    }
}

// Khi vừa load trang phải chạy ngay để khóa nút
document.addEventListener('DOMContentLoaded', checkValidation);











let currentStep = 1;

function goToStep(stepNumber) {
    // 1. Ẩn bước hiện tại
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    
    // 2. Hiện bước mới
    const target = document.getElementById(`step-${stepNumber}`);
    if (target) {
        target.classList.add('active');
        currentStep = stepNumber;
    }

    // 3. Logic hiển thị nút PREV
    const prevBtn = document.getElementById('prevBtn');
    if (currentStep === 2) {
        prevBtn.style.display = 'block'; // Hiện ở bước 2
    } else {
        prevBtn.style.display = 'none';  // Ẩn ở bước 1 và bước 3
    }
}

function prevStep() {
    if (currentStep > 1) {
        goToStep(currentStep - 1);
    }
}

function updateCount() {
    const text = document.getElementById('issue-text').value;
    document.getElementById('charCount').innerText = `${text.length}/5000 characters`;
}