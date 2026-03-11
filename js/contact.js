const scriptURL = 'https://script.google.com/macros/s/AKfycbxWAMD85djtSP5P2rDMENldlnxXDQ7iHA2KWI-xxkEkuJow-eu4YoIjYSODZh26ZFaf/exec';
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

        const files = fileInput.files;
        const payload = {
            fullname: form.querySelector('[name="fullname"]').value,
            email: form.querySelector('[name="email"]').value,
            category: form.querySelector('[name="category"]').value,
            message: form.querySelector('[name="message"]').value,
            allFiles: []
        };

        if (files.length > 0) {
            for (let file of files) {
                // ÉP FILE NHỎ XUỐNG: Nếu tổng file > 5MB là dễ tèo lắm [cite: 2025-12-29]
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