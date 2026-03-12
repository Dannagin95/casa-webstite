document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('blog-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    
    // Tìm tất cả ảnh trong nội dung bài viết
    const blogImages = document.querySelectorAll('.secondblog-single-image img, .secondblog-gallery-item img');

    blogImages.forEach(img => {
        img.addEventListener('click', () => {
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('active'), 10);
            lightboxImg.src = img.src;
            document.body.style.overflow = 'hidden'; // Khóa cuộn trang khi đang zoom
        });
    });

    // Đóng khi click nút X hoặc click ra ngoài ảnh
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) closeLightbox();
    });
});