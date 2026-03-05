document.querySelectorAll('.faq-header-row').forEach(header => {
    header.addEventListener('click', function() {
        const parent = this.closest('.faq-item');
        const isActive = parent.classList.contains('active');

        // Đóng tất cả các cái khác nếu đang mở (đúng UX QUOC)
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== parent) {
                item.classList.remove('active');
            }
        });

        // Toggle cái hiện tại
        parent.classList.toggle('active');
    });
});
