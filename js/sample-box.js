(function () {
    'use strict';

    const initSampleBox = () => {
        const modal = document.getElementById('casa-sample-modal');
        const form = document.getElementById('casa-sample-form');
        const successMsg = document.getElementById('sample-success-msg');

      
        const openModal = () => {
            if (modal) {
                modal.classList.add('is-open');
                document.body.style.overflow = 'hidden'; // Khóa cuộn trang
            }
        };

      
        const closeModal = () => {
            if (modal) {
                modal.classList.remove('is-open');
                document.body.style.overflow = ''; // Mở lại cuộn trang
            }
        };

       
        document.addEventListener('click', (e) => {
            // Click Nút Mở (Bắt theo ID #open-sample-modal hoặc Class .sample-box-icon)
            const triggerBtn = e.target.closest('#open-sample-modal, .sample-box-icon');
            if (triggerBtn) {
                e.preventDefault();
                openModal();
                return;
            }

          
            if (e.target.closest('#casa-modal-close')) {
                closeModal();
                return;
            }

            // Click ra ngoài vùng tối Overlay
            if (e.target === modal) {
                closeModal();
            }
        });

        // 2. BẤM PHÍM ESC ĐỂ ĐÓNG POPUP
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
                closeModal();
            }
        });

        // 3. XỬ LÝ SUBMIT FORM
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

    // Đảm bảo DOM đã tải xong mới khởi chạy
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
    const optionsList = customSelect.querySelectorAll(".select-option");
    const hiddenInput = document.getElementById("sample-wood-type");
    const selectedText = customSelect.querySelector(".selected-text");

    // Click mở / đóng dropdown
    selectedBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        customSelect.classList.toggle("is-open");
    });

    // Chọn option trong danh sách
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