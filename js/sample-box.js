(function () {
    'use strict';

    const initSampleBox = () => {
        const modal = document.getElementById('casa-sample-modal');
        const form = document.getElementById('casa-sample-form');
        const successMsg = document.getElementById('sample-success-msg');

        const openModal = () => {
            if (modal) {
                modal.classList.add('is-open');
                document.body.classList.add('modal-open', 'sample-open'); // Kích hoạt CSS khóa cuộn nền
                document.body.style.overflow = 'hidden';

                if (form) form.style.display = 'block'; 
                if (successMsg) successMsg.style.display = 'none';
            }
        };

        const closeModal = () => {
            if (modal) {
                modal.classList.remove('is-open');
                document.body.classList.remove('modal-open', 'sample-open'); // Gỡ class khóa cuộn
                document.body.style.overflow = '';
            }
        };


        const nameInput = document.getElementById('sample-name');
            const phoneInput = document.getElementById('sample-phone');

            if (nameInput) {
                nameInput.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/[^\p{L}\s]/gu, '');
                });
            }

            if (phoneInput) {
                phoneInput.setAttribute('inputmode', 'numeric');
                
                phoneInput.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/\D/g, '');
                });
            }


        document.addEventListener('click', (e) => {
            const triggerBtn = e.target.closest('#open-sample-modal, .sample-box-icon, .open-sample-btn, .sample-trigger-btn, [data-sample-modal]');
            if (triggerBtn) {
                e.preventDefault();
                openModal();
                return;
            }

            if (e.target.closest('#casa-modal-close, .casa-modal-close-btn, .casa-modal-close')) {
                e.preventDefault();
                closeModal();
                return;
            }

            if (e.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
                closeModal();
            }
        });

  
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                form.style.display = 'none';
                if (successMsg) {
                    successMsg.style.display = 'block';
                }
                form.reset();
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSampleBox);
    } else {
        initSampleBox();
    }
})();





document.addEventListener("DOMContentLoaded", function() {
    const customSelect = document.getElementById("casaWoodSelect");
    if (!customSelect) return;

    const selectedBtn = customSelect.querySelector(".select-selected");
    const optionsContainer = customSelect.querySelector(".select-options"); // Bổ sung biến này
    const optionsList = customSelect.querySelectorAll(".select-option");
    const hiddenInput = document.getElementById("sample-wood-type");
    const selectedText = customSelect.querySelector(".selected-text");

    selectedBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        customSelect.classList.toggle("is-open");
    });

    // 🔥 NGĂN CLICK/KÉO THANH CUỘN CỦA LIST LÀM ĐÓNG SẬP DROPDOWN 🔥
    optionsContainer.addEventListener("click", function(e) {
        e.stopPropagation();
    });

    // Chọn option trong danh sách (Giữ nguyên của mày)
    optionsList.forEach(option => {
        option.addEventListener("click", function(e) {
            e.stopPropagation();
            const value = this.getAttribute("data-value");
            const text = this.textContent;

            selectedText.textContent = text;
            hiddenInput.value = value;

            optionsList.forEach(opt => opt.classList.remove("is-selected"));
            this.classList.add("is-selected");

            customSelect.classList.remove("is-open");
        });
    });

    document.addEventListener("click", function() {
        customSelect.classList.remove("is-open");
    });
});