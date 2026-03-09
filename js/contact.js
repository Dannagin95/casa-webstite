const scriptURL = 'https://script.google.com/macros/s/AKfycbzYGd7djERnrVQIsIu2DE59GjgLlr5E_7gAMCUQ96mwpn1dIsXzX9i-hLUIfx6LAvLA/exec';
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

        
        if (file) {
            const reader = new FileReader();
            reader.onload = function() {
                const base64Data = reader.result.split(',')[1];
                const data = new URLSearchParams();
                for (const pair of formData) { data.append(pair[0], pair[1]); }
                data.append("fileData", base64Data);
                data.append("mimeType", file.type);
                data.append("fileName", file.name);
                sendData(data);
            };
            reader.readAsDataURL(file);
        } else {
            const data = new URLSearchParams(formData);
            sendData(data);
        }
    });

    function sendData(data) {
        fetch(scriptURL, { method: 'POST', body: data })
        .then(res => {
            alert("Gửi thành công rồi Danna! Check Google Sheets đi.");
            form.reset();
            fileNote.innerText = "Đính kèm tối đa 10 tệp.";
            btn.disabled = false;
            btn.innerText = "Send";
        })
        .catch(err => {
            alert("Lỗi rồi mày ơi: " + err.message);
            btn.disabled = false;
            btn.innerText = "Send";
        });
    }