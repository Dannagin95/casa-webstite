const scriptURL = 'https://script.google.com/macros/s/AKfycbx26VHPXpQjYvNzxq7c36xyJntk2TLLX-_QHTxpBPy-WnK6abXfEggSHbzH0a8XOL4I/exec';
const form = document.getElementById('casa-contact-form');
const btn = document.getElementById('submit-btn');
const fileInput = document.getElementById('file-upload');
const fileNote = document.getElementById('file-count');

// Gọi cái thẻ div để chứa danh sách file (Mày nhớ thêm div này vào HTML nhé)
const fileListContainer = document.getElementById('file-list'); 
let selectedFiles = []; // Mảng ảo để chứa file khách chọn

fileInput.addEventListener('change', () => {
    const newFiles = Array.from(fileInput.files);
    
    // Thêm file mới vào mảng, tối đa 10 file
    newFiles.forEach(file => {
        if (selectedFiles.length < 10) {
            selectedFiles.push(file);
        }
    });

    renderFileList();
    fileInput.value = ""; // Xóa value của input để khách có thể chọn lại file vừa xóa nếu đổi ý
});

// Hàm hiển thị danh sách file ra màn hình
function renderFileList() {
    if (!fileListContainer) return; // Đề phòng mày quên chưa thêm div vào HTML
    fileListContainer.innerHTML = "";
    
    selectedFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = `
            <span>📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
            <span class="remove-btn" onclick="removeFile(${index})">✕</span>
        `;
        fileListContainer.appendChild(item);
    });
    
    fileNote.innerText = selectedFiles.length > 0 ? `Đã chọn ${selectedFiles.length} tệp.` : "Đính kèm tối đa 10 tệp.";
}

// Hàm xóa file khi bấm dấu X (phải gắn vào window để chạy được onclick trên HTML)
window.removeFile = (index) => {
    selectedFiles.splice(index, 1);
    renderFileList();
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.disabled = true;
    btn.innerText = "Đang gửi...";

    const payload = {
        fullname: form.querySelector('[name="fullname"]').value,
        email: form.querySelector('[name="email"]').value,
        category: form.querySelector('[name="category"]').value,
        message: form.querySelector('[name="message"]').value,
        allFiles: []
    };

    // Đọc file từ cái mảng selectedFiles thay vì fileInput
    if (selectedFiles.length > 0) {
        for (let file of selectedFiles) {
            const reader = new Promise((resolve) => {
                const fr = new FileReader();
                fr.onload = () => resolve({
                    data: fr.result.split(',')[1],
                    mimeType: file.type,
                    fileName: file.name
                });
                fr.readAsDataURL(file);
            });
            payload.allFiles.push(await reader);
        }
    }

    fetch(scriptURL, { 
        method: 'POST', 
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' } 
    })
    .then(() => {
        alert("Casa Parquet đã nhận được thông tin và tệp của bạn!"); 
        form.reset();
        
        // Gửi xong thì dọn dẹp sạch sẽ giao diện
        selectedFiles = []; 
        if (fileListContainer) fileListContainer.innerHTML = ""; 
        fileNote.innerText = "Đính kèm tối đa 10 tệp.";
        
        btn.disabled = false;
        btn.innerText = "Send";
    })
    .catch(err => {
        alert("Lỗi Fetch: " + err.message);
        btn.disabled = false;
        btn.innerText = "Send";
    });
});

