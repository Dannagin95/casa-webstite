const scriptURL = 'https://script.google.com/macros/s/AKfycbyTjDPefktNzanaD6qjVSscKuxqBm71SGKmNNYAL6ETrmMQQ_5zQBCGDsnFYZZSX2xo/exec';
    const form = document.getElementById('casa-contact-form');
    const btn = document.getElementById('submit-btn');
    const fileInput = document.getElementById('file-upload');
    const fileNote = document.getElementById('file-count');

    fileInput.addEventListener('change', () => {
        const count = fileInput.files.length;
        fileNote.innerText = count > 0 ? `Đã chọn ${count} tệp.` : "Đính kèm tối đa 10 tệp.";
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        btn.disabled = true;
        btn.innerText = "Sending...";

        const formData = new FormData(form);
        const files = fileInput.files;
        const data = new URLSearchParams();

        // 1. Đưa thông tin chữ vào trước
        for (const pair of formData) {
            if (pair[0] !== 'file-upload') data.append(pair[0], pair[1]);
        }

        // 2. Xử lý nén và gửi nhiều file
        if (files.length > 0) {
            const filePromises = Array.from(files).map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve({
                        data: reader.result.split(',')[1],
                        mimeType: file.type,
                        fileName: file.name
                    });
                    reader.readAsDataURL(file);
                });
            });

            const allFiles = await Promise.all(filePromises);
            data.append("allFiles", JSON.stringify(allFiles)); // Gửi nguyên cục file dưới dạng JSON
        }

        sendData(data);
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