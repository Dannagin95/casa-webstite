document.addEventListener('DOMContentLoaded', function() {
    
    const headerRows = document.querySelectorAll('.faq-header-row');
    headerRows.forEach(header => {
        header.addEventListener('click', function() {
            const parent = this.closest('.faq-item');

            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== parent) {
                    item.classList.remove('active');
                }
            });

            parent.classList.toggle('active');
        });
    });

    const loadMoreBtn = document.querySelector('.faq-load-more-btn');
    const moreContainer = document.querySelector('.faq-more-container');

    if (loadMoreBtn && moreContainer) {
        loadMoreBtn.addEventListener('click', function() {
            const isExpanded = moreContainer.classList.contains('is-expanded');

            if (isExpanded) {
                moreContainer.classList.remove('is-expanded');
                loadMoreBtn.classList.remove('is-active');
            } else {
                moreContainer.classList.add('is-expanded');
                loadMoreBtn.classList.add('is-active');
            }
        });
    }

});









document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.getElementById('openFaqModal');
    const closeModalBtn = document.getElementById('closeFaqModal');
    const modalOverlay = document.getElementById('faqModal');
    const faqForm = document.getElementById('faqContactForm');

    if (!modalOverlay || !openModalBtn) return;

    // 1. Mở Modal
    const openModal = () => {
        modalOverlay.classList.add('is-open');
        modalOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Khóa cuộn trang bên dưới
    };

    // 2. Đóng Modal
    const closeModal = () => {
        modalOverlay.classList.remove('is-open');
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Mở lại cuộn trang
    };

    // Event mở modal khi bấm nút "Hỏi askcasa"
    openModalBtn.addEventListener('click', openModal);

    // Event đóng modal khi bấm nút X
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Event đóng modal khi click ra ngoài vùng card (click vào nền mờ)
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Event đóng modal khi nhấn phím ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
            closeModal();
        }
    });

    // 3. Xử lý Submit Form
    if (faqForm) {
        faqForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Lấy dữ liệu nếu cần gửi qua API
            const formData = {
                name: document.getElementById('askcasaUserName')?.value,
                email: document.getElementById('askcasaUserEmail')?.value,
                question: document.getElementById('askcasaUserQuestion')?.value
            };

            console.log('Dữ liệu câu hỏi:', formData);

            // Thông báo demo & Reset form
            alert('Cảm ơn bạn! Câu hỏi của bạn đã được gửi tới CASA Parquet.');
            faqForm.reset();
            closeModal();
        });
    }
});