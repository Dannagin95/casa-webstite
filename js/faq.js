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