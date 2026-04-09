
const scriptURL = 'https://script.google.com/macros/s/AKfycbx8i3OoHl5eEWvl3BFJT1JTtuM1rqhmmf3KLY0INkCjpLMbjXGiH00oMj7A_SfD-eHhKg/exec';


const newsletterForm = document.querySelector('#casa-newsletter-form');
const successBox = document.querySelector('#newsletter-success-msg');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
        e.preventDefault();
        newsletterForm.style.display = 'none';
        successBox.style.display = 'flex';

        fetch(scriptURL, { method: 'POST', body: new FormData(newsletterForm) })
        .then(response => console.log('Newsletter: Thành công!'))
        .catch(error => console.error('Newsletter: Lỗi!', error.message));
    });
}

// Hàm gửi dành riêng cho Form Bảo Hành
function submitForm() { // Tao đổi tên thành submitForm cho khớp với HTML của mày
    console.log("Đã kích hoạt gửi form bảo hành!");

    // 1. Lấy đúng ID từ HTML mày vừa gửi
    const noiDungBox = document.getElementById('issue-text');
    const emailBox = document.getElementById('email-input');

    if (!noiDungBox || !emailBox) {
        console.error("Lỗi: Không tìm thấy ô nhập liệu. Kiểm tra lại ID!");
        return;
    }

    const noiDung = noiDungBox.value;
    const emailKhach = emailBox.value;

    // Kiểm tra xem khách có để trống không
    if (!noiDung || !emailKhach) {
        alert("Danna ơi, bảo khách điền đủ thông tin đã!");
        return;
    }

    // 2. Đóng gói dữ liệu (Phải khớp với tên cột A, B trên Sheet)
    const formData = new FormData();
    formData.append('SheetName', 'Bảo hành');
    formData.append('Thông tin bảo hành', noiDung); // Tên này phải khớp cột A1
    formData.append('Email', emailKhach);           // Tên này phải khớp cột B1

    // 3. Hiệu ứng nút bấm cho nó xịn
    const btn = event.target;
    btn.innerText = "Đang gửi...";
    btn.style.opacity = "0.5";
    btn.disabled = true;

    // 4. Gửi đi
    fetch(scriptURL, { method: 'POST', body: formData })
    .then(res => {
        console.log('Bảo hành: Thành công!');
        alert("CASA đã nhận được thông tin bảo hành của bạn.");
        // Mày có thể thêm lệnh chuyển sang trang cảm ơn ở đây
        // window.location.href = "/thank-you"; 
    })
    .catch(error => {
        console.error('Lỗi rồi:', error.message);
        alert("Lỗi kết nối rồi mày ơi!");
    })
    .finally(() => {
        btn.innerText = "Gửi";
        btn.disabled = false;
        btn.style.opacity = "1";
    });
}