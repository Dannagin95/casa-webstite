const newsletterForm = document.querySelector('#casa-newsletter-form');
const successBox = document.querySelector('#newsletter-success-msg');
const scriptURL = 'https://script.google.com/macros/s/AKfycbykU09FJZsGTGFVUBL688vgFg-M-UuSb74zuhpMq8deKascHdkEOl4fy6NGPo9r2H6d-w/exec';

if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
        e.preventDefault();
        
        // 1. Hiệu ứng ngay lập tức cho khách hàng
        newsletterForm.style.display = 'none';
        successBox.style.display = 'flex';

        // 2. Gửi dữ liệu âm thầm lên Google Sheet
        fetch(scriptURL, { 
            method: 'POST', 
            body: new FormData(newsletterForm)
        })
        .then(response => console.log('Newsletter: Thành công!', response))
        .catch(error => console.error('Newsletter: Lỗi rồi!', error.message));
    });
}