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

    const openModal = () => {
        modalOverlay.classList.add('is-open');
        modalOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modalOverlay.classList.remove('is-open');
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    openModalBtn.addEventListener('click', openModal);

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
            closeModal();
        }
    });

    if (faqForm) {
        faqForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = faqForm.querySelector('.askcasa-submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Đang gửi...';
            submitBtn.disabled = true;

            const checkboxes = faqForm.querySelectorAll('.askcasa-checkbox-input');
            const formData = {
                name: document.getElementById('casaUserName')?.value || '',
                email: document.getElementById('casaUserEmail')?.value || '',
                question: document.getElementById('casaUserQuestion')?.value || '',
                dataConsent: checkboxes[0] ? checkboxes[0].checked : false,
                marketingConsent: checkboxes[1] ? checkboxes[1].checked : false
            };

            const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0Gy9vk6Rf-wInQgByDye1QJgjI5JC51cugw2AnkQ-fmb4GrGhR0hXRN3HDlbPz62f9g/exec';

            try {
                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                alert('Cảm ơn bạn! Câu hỏi của bạn đã được gửi tới CASA Parquet.');
                faqForm.reset();
                closeModal();
            } catch (error) {
                alert('Có lỗi xảy ra, vui lòng thử lại sau.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});