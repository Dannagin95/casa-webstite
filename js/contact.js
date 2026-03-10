const scriptURL = 'https://script.google.com/macros/s/AKfycby_Yud_YX-sTXBnUz6PjOklk9pV7c83Sj_oNnFBPnDhlxTvj02y5azvRfT5Mp6JPnc8/exec';
    const form = document.getElementById('casa-contact-form');
    const btn = document.getElementById('submit-btn');
    const fileInput = document.getElementById('file-upload');
    const fileNote = document.getElementById('file-count');

    fileInput.addEventListener('change', () => {
        const count = fileInput.files.length;
        fileNote.innerText = count > 0 ? `Đã chọn ${count} tệp.` : "Đính kèm tối đa 10 tệp.";
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        btn.disabled = true;
        btn.innerText = "Sending...";

        const formData = new FormData(form);
        const file = fileInput.files[0];

        // Tạo đối tượng chứa dữ liệu để gửi đi
        const data = new URLSearchParams();
        
        // Đưa toàn bộ chữ từ form vào data (Full name, Email, Category, Message)
        for (const pair of formData) {
            data.append(pair[0], pair[1]);
        }

        if (file) {
            const reader = new FileReader();
            reader.onload = function() {
                // Lấy phần Base64 của file
                const base64Data = reader.result.split(',')[1];
                
                // Thêm các trường file vào data
                data.append("fileData", base64Data);
                data.append("mimeType", file.type);
                data.append("fileName", file.name);
                
                sendData(data);
            };
            reader.onerror = function() {
                alert("Lỗi khi đọc file!");
                btn.disabled = false;
                btn.innerText = "Send";
            };
            reader.readAsDataURL(file);
        } else {
            // Nếu không có file thì gửi luôn
            sendData(data);
        }
    });

    function sendData(data) {
        fetch(scriptURL, { 
            method: 'POST', 
            body: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(res => {
            alert("Cảm ơn bạn đã gửi thông tin! Casa Parquet sẽ liên hệ lại sớm nhất."); 
            form.reset();
            fileNote.innerText = "Đính kèm tối đa 10 tệp.";
            btn.disabled = false;
            btn.innerText = "Send";
        })
        .catch(err => {
            alert("Lỗi hệ thống: " + err.message);
            btn.disabled = false;
            btn.innerText = "Send";
        });
    }