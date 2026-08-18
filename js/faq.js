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
    const modalOverlay = document.getElementById('faqModal');

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
        setTimeout(() => {
            const modalContent = modalOverlay.querySelector('.askcasa-modal-card');
            if (modalContent && originalModalHTML) {
                modalContent.innerHTML = originalModalHTML;
                bindFormEvents();
            }
        }, 300);
    };

    openModalBtn.addEventListener('click', openModal);

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

    let originalModalHTML = '';
    const modalCard = modalOverlay.querySelector('.askcasa-modal-card');
    if (modalCard) {
        originalModalHTML = modalCard.innerHTML;
    }

    const bindFormEvents = () => {
        const closeModalBtn = document.getElementById('closeFaqModal');
        const faqForm = document.getElementById('faqContactForm');

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }

        if (!faqForm) return;

        faqForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = faqForm.querySelector('.askcasa-submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Đang gửi...';
            submitBtn.disabled = true;

            
            grecaptcha.ready(() => {
                grecaptcha.execute('6LfZ-YotAAAAAO4pktKGLZaHl0o7nLrShyF8R_PF', { action: 'submit' }).then(async (token) => {
                    const checkboxes = faqForm.querySelectorAll('.askcasa-checkbox-input');
                    const formData = {
                        name: document.getElementById('casaUserName')?.value || '',
                        email: document.getElementById('casaUserEmail')?.value || '',
                        question: document.getElementById('casaUserQuestion')?.value || '',
                        dataConsent: checkboxes[0] ? checkboxes[0].checked : false,
                        marketingConsent: checkboxes[1] ? checkboxes[1].checked : false,
                        recaptchaToken: token
                    };

                    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0Gy9vk6Rf-wInQgByDye1QJgjI5JC51cugw2AnkQ-fmb4GrGhR0hXRN3HDlbPz62f9g/exec';

                    try {
                        await fetch(SCRIPT_URL, {
                            method: 'POST',
                            mode: 'no-cors',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(formData)
                        });

                        const card = faqForm.closest('.askcasa-modal-card');
                        card.innerHTML = `
                            <button class="askcasa-modal-close-btn" id="closeFaqModalSuccess" aria-label="Đóng" type="button">
                                <svg viewBox="0 0 24 24">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                            <div class="askcasa-modal-header" style="text-align: center; padding: 40px 20px;">
                                <h3 class="askcasa-modal-title" style="font-family: var(--special-font); margin-bottom: 16px;">Cảm ơn bạn!</h3>
                                <p class="askcasa-modal-subtitle" style="margin-bottom: 24px;">Câu hỏi của bạn đã được gửi tới CASA Parquet thành công.</p>
                                <button type="button" class="askcasa-submit-btn" id="successCloseBtn" style="max-width: 200px; margin: 0 auto;">Đóng</button>
                            </div>
                        `;

                        document.getElementById('closeFaqModalSuccess').addEventListener('click', closeModal);
                        document.getElementById('successCloseBtn').addEventListener('click', closeModal);

                    } catch (error) {
                        alert('Có lỗi xảy ra, vui lòng thử lại sau.');
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }
                });
            });
        });
    };

    bindFormEvents();
});