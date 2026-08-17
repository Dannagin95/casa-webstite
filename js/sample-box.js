
/*(function () {
    'use strict';

    const initSampleBox = () => {
        const modal = document.getElementById('casa-sample-modal');
        const form = document.getElementById('casa-sample-form');
        const successMsg = document.getElementById('sample-success-msg');

        const openModal = () => {
            if (modal) {
                modal.classList.add('is-open');
                document.body.classList.add('modal-open', 'sample-open'); 
                document.body.style.overflow = 'hidden';

                if (form) {
                    form.style.display = 'block'; 
                    form.reset(); 
                   
                    const selectedText = document.querySelector('#casaWoodSelect .selected-text');
                    if (selectedText) selectedText.textContent = 'Chọn loại gỗ / Tông màu';
                    const hiddenInput = document.getElementById('sample-wood-type');
                    if (hiddenInput) hiddenInput.value = '';
                }
                if (successMsg) successMsg.style.display = 'none';
            }
        };

        const closeModal = () => {
            if (modal) {
                modal.classList.remove('is-open');
                document.body.classList.remove('modal-open', 'sample-open');
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

       
        if (modal) {
            modal.addEventListener('touchmove', (e) => {
                if (e.target === modal || e.target.classList.contains('casa-modal-overlay') || e.target.classList.contains('sample-drawer')) {
                    e.preventDefault();
                }
            }, { passive: false });
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
            const submitBtn = document.getElementById('sample-submit-btn');

            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const btnTextSpan = submitBtn ? submitBtn.querySelector('span') : null;
                const originalText = btnTextSpan ? btnTextSpan.textContent : 'Gửi yêu cầu';
                
                if (submitBtn) {
                    if (btnTextSpan) btnTextSpan.textContent = 'Đang gửi...';
                    submitBtn.disabled = true;
                }

          
                const formData = {
                    name: document.getElementById('sample-name').value,
                    phone: document.getElementById('sample-phone').value,
                    address: document.getElementById('sample-address').value,
                    wood_type: document.getElementById('sample-wood-type').value,
                    note: document.getElementById('sample-note').value
                };

              
                const scriptURL = "https://script.google.com/macros/s/AKfycbxW9Wh7KbWZJA0XiItTL4vHmreaz2eGwu-jOsiMzMRhvUjewgDEoEInQavkNnEFTsc-/exec";

                fetch(scriptURL, {
                    method: 'POST',
                    mode: 'no-cors', // Bắt buộc khi gọi Google Apps Script từ client
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(() => {
                    // Thành công: Ẩn form, hiển thị thông báo
                    form.style.display = 'none';
                    if (successMsg) {
                        successMsg.style.display = 'block';
                    }
                    form.reset();

                    // Khôi phục trạng thái nút bấm
                    if (submitBtn) {
                        if (btnTextSpan) btnTextSpan.textContent = originalText;
                        submitBtn.disabled = false;
                    }
                })
                .catch(error => {
                    console.error('Lỗi kết nối:', error);
                    alert('Đã có lỗi xảy ra, mày thử kiểm tra lại kết nối rồi gửi lại nhé!');
                    if (submitBtn) {
                        if (btnTextSpan) btnTextSpan.textContent = originalText;
                        submitBtn.disabled = false;
                    }
                });
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSampleBox);
    } else {
        initSampleBox();
    }
})();

// Xử lý Custom Select Dropdown cho chọn loại gỗ
document.addEventListener("DOMContentLoaded", function() {
    const customSelect = document.getElementById("casaWoodSelect");
    if (!customSelect) return;

    const selectedBtn = customSelect.querySelector(".select-selected");
    const optionsContainer = customSelect.querySelector(".select-options"); 
    const optionsList = customSelect.querySelectorAll(".select-option");
    const hiddenInput = document.getElementById("sample-wood-type");
    const selectedText = customSelect.querySelector(".selected-text");

    selectedBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        customSelect.classList.toggle("is-open");
    });

    optionsContainer.addEventListener("click", function(e) {
        e.stopPropagation();
    });

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
});*/