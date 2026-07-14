/* ==========================================================================
   SCROLL INDICATOR - TABLET LỚN (60% WIDTH)
   ========================================================================== */
const initGalleryScroll = () => {
    const gallery = document.querySelector('.firstblog-gallery-grid, .thirdblog-gallery-grid, .fourthblog-gallery-grid, .fifthblog-gallery-grid, .sixblog-gallery-grid, .seventhblog-gallery-grid, .eighthblog-gallery-grid, .ninthblog-gallery-grid, .tenthblog-gallery-grid, .eleventhblog-gallery-grid');
    const progress = document.querySelector('.scroll-progress');
    const indicator = document.querySelector('.blog-scroll-indicator, .thirdblog-scroll-indicator, .fourthblog-scroll-indicator, .fifthblog-scroll-indicator, .sixblog-scroll-indicator, .seventhblog-gallery-grid, .eighthblog-gallery-grid, .ninthblog-gallery-grid, .tenthblog-gallery-grid, .eleventhblog-gallery-grid');

    if (gallery && progress && indicator) {
        gallery.addEventListener('scroll', () => {
            // 1. Tính tỷ lệ phần trăm đã cuộn (từ 0 đến 1)
            const maxScroll = gallery.scrollWidth - gallery.clientWidth;
            const scrollFraction = gallery.scrollLeft / maxScroll;

            // 2. Tính khoảng không gian còn trống để thanh đen di chuyển
            // (Độ dài ray - Độ dài thanh đen)
            const indicatorWidth = indicator.clientWidth;
            const progressWidth = progress.clientWidth;
            const availableSpace = indicatorWidth - progressWidth;

            // 3. Di chuyển thanh đen dựa trên tỷ lệ cuộn
            const moveX = scrollFraction * availableSpace;

            // Dùng thủ thuật để bám tay mượt hơn trên iPad
            requestAnimationFrame(() => {
                progress.style.transform = `translateX(${moveX}px)`;
            });
        });
    }
};

// Đảm bảo chạy sau khi trang load xong
if (document.readyState === 'complete') {
    initGalleryScroll();
} else {
    window.addEventListener('load', initGalleryScroll);
}









/**
 * CASA BLOG PAGINATION & URL HANDLER
 * Hỗ trợ chuyển trang, cập nhật URL ?page=X và giữ nguyên layout Grid
 */
const initBlogPagination = () => {
    const prevBtn = document.querySelector('.pag-btn.prev');
    const nextBtn = document.querySelector('.pag-btn.next');
    const pagNumber = document.querySelector('.pag-number');
    const pages = document.querySelectorAll('.blog-page-wrapper');
    const totalPages = pages.length;

    if (!prevBtn || !nextBtn || pages.length === 0) return;

    /**
     * Hàm cập nhật hiển thị và URL
     * @param {number} page - Số trang hiện tại
     * @param {boolean} pushState - Có đẩy lịch sử URL hay không
     */
    const updateDisplay = (page, pushState = true) => {
        // 1. Ẩn/Hiện cụm blog
        // Dùng style.display = '' để nó nhận display: contents từ CSS của mày
        pages.forEach(p => {
            const isTargetPage = parseInt(p.getAttribute('data-page')) === page;
            p.style.display = isTargetPage ? '' : 'none';
        });

        // 2. Cập nhật số trang hiển thị (1 / 2)
        if (pagNumber) {
            pagNumber.textContent = `${page} / ${totalPages}`;
        }

        // 3. Cập nhật trạng thái nút (Mờ nút khi không bấm được nữa)
        prevBtn.style.opacity = (page === 1) ? '0.3' : '1';
        prevBtn.style.pointerEvents = (page === 1) ? 'none' : 'auto';
        nextBtn.style.opacity = (page === totalPages) ? '0.3' : '1';
        nextBtn.style.pointerEvents = (page === totalPages) ? 'none' : 'auto';

        // 4. Cập nhật thanh URL
        if (pushState) {
            const newUrl = `${window.location.pathname}?page=${page}`;
            window.history.pushState({ page: page }, '', newUrl);
        }

        // 5. Cuộn nhẹ lên đầu trang blog cho mượt
        // Tao trừ hao 100px để không bị dính sát mép trên
        const blogGrid = document.querySelector('.blog-grid');
        if (blogGrid) {
            window.scrollTo({
                top: blogGrid.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    };

    // --- KHỞI TẠO: Check URL khi vừa load trang ---
    const urlParams = new URLSearchParams(window.location.search);
    let currentPage = parseInt(urlParams.get('page')) || 1;

    // Fix lỗi nếu user nhập bậy số trang lên URL
    if (currentPage > totalPages) currentPage = 1;
    if (currentPage < 1) currentPage = 1;

    // Hiển thị trang đầu tiên dựa trên URL
    updateDisplay(currentPage, false);

    // --- SỰ KIỆN NÚT BẤM ---
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            updateDisplay(currentPage);
        }
    });

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            updateDisplay(currentPage);
        }
    });

    // --- XỬ LÝ NÚT BACK/FORWARD CỦA TRÌNH DUYỆT ---
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page) {
            currentPage = event.state.page;
            updateDisplay(currentPage, false);
        } else {
            // Trường hợp quay lại trang mặc định không có tham số
            currentPage = 1;
            updateDisplay(1, false);
        }
    });
};

// Chạy hàm khi trang đã load xong
if (document.readyState === 'complete') {
    initBlogPagination();
} else {
    window.addEventListener('load', initBlogPagination);
}









/*==================================
BỌ LỌC TÌM KIẾM BLOG
==================================*/
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-filter-btn');
    const mainContainer = document.querySelector('main.casa-container');

    if (toggleBtn && mainContainer) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mainContainer.classList.toggle('filter-activated');
        });

        mainContainer.addEventListener('click', (e) => {
            if (mainContainer.classList.contains('filter-activated') && !e.target.closest('.casa-filter-wrapper')) {
                mainContainer.classList.remove('filter-activated');
            }
        });
    }
});   




document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("blog-keyword");
    const clearBtn = document.getElementById("casa-clear-search");

    if (searchInput && clearBtn) {
        // Lắng nghe khi gõ chữ
        searchInput.addEventListener("input", function () {
            if (this.value.trim().length > 0) {
                clearBtn.classList.add("is-visible"); // Hiện nút "x"
            } else {
                clearBtn.classList.remove("is-visible"); // Ẩn nút "x"
            }
        });

        // Click nút "x" để xóa sạch chữ và ẩn nút đi
        clearBtn.addEventListener("click", function () {
            searchInput.value = ""; // Xóa text
            clearBtn.classList.remove("is-visible"); // Ẩn nút "x"
            searchInput.focus(); // Focus lại vào input
        });
    }
});







document.addEventListener("DOMContentLoaded", function () {
    const filterFields = document.querySelectorAll(".casa-filter-field");

    filterFields.forEach(field => {
        const selectEl = field.querySelector("select");
        if (!selectEl) return; // Nếu div không chứa select thì bỏ qua (như ô Input tìm kiếm)

        // 1. Tạo giao diện Trigger hiển thị lựa chọn hiện tại
        const trigger = document.createElement("div");
        trigger.className = "casa-custom-select-trigger";
        trigger.innerHTML = `<span>${selectEl.options[selectEl.selectedIndex].text}</span>`;
        field.appendChild(trigger);

        // 2. Tạo hộp tùy chọn xổ xuống
        const optionsBox = document.createElement("div");
        optionsBox.className = "casa-custom-options-box";

        // Duyệt qua các option gốc để tạo option custom tương ứng
        Array.from(selectEl.options).forEach((opt, index) => {
            const optItem = document.createElement("div");
            optItem.className = "casa-custom-option-item";
            if (index === selectEl.selectedIndex) optItem.classList.add("active");
            optItem.textContent = opt.text;
            optItem.setAttribute("data-value", opt.value);

            // Sự kiện khi click vào 1 option custom
            optItem.addEventListener("click", function (e) {
                e.stopPropagation();
                
                // Cập nhật text hiển thị trên trigger
                trigger.querySelector("span").textContent = opt.text;
                
                // Cập nhật giá trị vào thẻ select gốc để phục vụ tìm kiếm/submit
                selectEl.value = opt.value;
                selectEl.dispatchEvent(new Event('change')); // Kích hoạt sự kiện change của select gốc nếu cần

                // Đổi class active
                optionsBox.querySelectorAll(".casa-custom-option-item").forEach(item => item.classList.remove("active"));
                optItem.classList.add("active");

                // Đóng dropdown
                field.classList.remove("is-open");
            });

            optionsBox.appendChild(optItem);
        });

        field.appendChild(optionsBox);

        // 3. Sự kiện Click để Đóng/Mở dropdown
        trigger.addEventListener("click", function (e) {
            e.stopPropagation();
            
            // Đóng tất cả các select khác đang mở trên trang trước khi mở cái này
            document.querySelectorAll(".casa-filter-field").forEach(otherField => {
                if (otherField !== field) otherField.classList.remove("is-open");
            });

            field.classList.toggle("is-open");
        });
    });

    // Click ra ngoài bất kỳ đâu thì tự động đóng dropdown lại
    document.addEventListener("click", function () {
        document.querySelectorAll(".casa-filter-field").forEach(field => {
            field.classList.remove("is-open");
        });
    });
});







document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("blog-keyword");
    const selectEl = document.getElementById("blog-category");
    const clearBtn = document.getElementById("casa-clear-search");
    const suggestionsBox = document.getElementById("search-suggestions");
    const submitBtn = document.querySelector(".casa-filter-submit-btn");
    const blogCards = document.querySelectorAll(".blog-card");

    // ==========================================
    // 1. TỰ ĐỘNG QUÉT GRID ĐỂ TẠO DATABASE TÌM KIẾM NHANH
    // ==========================================
    function getBlogDatabase() {
        const database = [];
        blogCards.forEach(card => {
            const titleLink = card.querySelector(".blog-card-title");
            const titleEl = card.querySelector(".blog-card-title h3");
            const category = card.getAttribute("data-category") || "all";
            
            if (titleEl && titleLink) {
                database.push({
                    title: titleEl.textContent.trim(),
                    url: titleLink.getAttribute("href"),
                    category: category
                });
            }
        });
        return database;
    }

    const blogDatabase = getBlogDatabase();

    // ==========================================
    // 2. LOGIC GỢI Ý TÌM KIẾM NHANH (INSTANT SUGGESTION)
    // ==========================================
    if (searchInput && suggestionsBox) {
        searchInput.addEventListener("input", function () {
            const query = this.value.trim().toLowerCase();
            suggestionsBox.innerHTML = ""; // Xóa gợi ý cũ

            if (query.length === 0) {
                suggestionsBox.classList.remove("is-visible");
                return;
            }

   
            const matchedArticles = blogDatabase.filter(article => 
                article.title.toLowerCase().includes(query)
            );

            if (matchedArticles.length > 0) {
                matchedArticles.forEach(article => {
                    const item = document.createElement("a");
                    item.href = article.url;
                    item.className = "suggestion-item";
                    
           
                    let catName = "Danh mục khác";
                    if (article.category === "Go") catName = "Gỗ & sàn gỗ";
                    if (article.category === "ky-thuat") catName = "Kỹ thuật thi công";
                    if (article.category === "hieu-ung") catName = "Màu sắc và bề mặt";

                    item.innerHTML = `
                        <span class="suggestion-title">${article.title}</span>
                        <span class="suggestion-meta">${catName}</span>
                    `;
                    suggestionsBox.appendChild(item);
                });
            } else {
                const noResult = document.createElement("div");
                noResult.className = "suggestion-no-result";
                noResult.textContent = "Không tìm thấy bài viết nào phù hợp.";
                suggestionsBox.appendChild(noResult);
            }

            suggestionsBox.classList.add("is-visible");
        });

        // Click ra ngoài thì đóng bảng gợi ý
        document.addEventListener("click", function (e) {
            if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
                suggestionsBox.classList.remove("is-visible");
            }
        });
    }

    // ==========================================
    // 3. LOGIC LỌC TẠI CHỖ TRÊN GRID (Khi bấm nút Tìm kiếm)
    // ==========================================
    if (submitBtn) {
        submitBtn.addEventListener("click", function (e) {
            e.preventDefault();
            
            const selectedCategory = selectEl.value; // 'all', 'xu-huong', 'ky-thuat'
            const keywordValue = searchInput.value.trim().toLowerCase(); 

            blogCards.forEach(card => {
                const cardCategory = card.getAttribute("data-category") || "all";
                
             
                const titleEl = card.querySelector(".blog-card-title h3");
                const descEl = card.querySelector(".blog-card-desc");
                
                const cardTitle = titleEl ? titleEl.textContent.toLowerCase() : "";
                const cardDesc = descEl ? descEl.textContent.toLowerCase() : "";

               
                const matchCategory = (selectedCategory === "all" || cardCategory === selectedCategory);
                const matchKeyword = (keywordValue === "" || cardTitle.includes(keywordValue) || cardDesc.includes(keywordValue));

                // Thỏa mãn cả 2 thì hiện, không thì ẩn
                if (matchCategory && matchKeyword) {
                    card.style.display = ""; 
                } else {
                    card.style.display = "none";
                }
            });

            // Đóng toàn bộ box lọc cho gọn gàng sau khi tìm kiếm xong
            document.querySelector("main").classList.remove("filter-activated");
            if (suggestionsBox) suggestionsBox.classList.remove("is-visible");
        });
    }


    if (clearBtn && searchInput) {
        clearBtn.addEventListener("click", function () {
            searchInput.value = "";
            clearBtn.classList.remove("is-visible");
            if (suggestionsBox) {
                suggestionsBox.innerHTML = "";
                suggestionsBox.classList.remove("is-visible");
            }
            searchInput.focus();
        });
    }


    window.addEventListener("pageshow", function (event) {
    // Sự kiện pageshow chạy bất cứ khi nào trang được tải, 
    // kể cả khi tải bình thường hoặc khi người dùng bấm nút BACK/FORWARD
    const searchInput = document.getElementById("blog-keyword");
    const clearBtn = document.getElementById("casa-clear-search");
    const suggestionsBox = document.getElementById("search-suggestions");
    const selectEl = document.getElementById("blog-category");
    const blogCards = document.querySelectorAll(".blog-card");

    if (searchInput) {
        searchInput.value = ""; // Xóa sạch chữ sót lại trong ô tìm kiếm
    }
    
    if (clearBtn) {
        clearBtn.classList.remove("is-visible"); // Ẩn hoàn toàn nút "x"
    }
    
    if (suggestionsBox) {
        suggestionsBox.innerHTML = ""; // Xóa sạch danh sách gợi ý cũ
        suggestionsBox.classList.remove("is-visible"); // Ẩn bảng gợi ý
    }

    if (selectEl) {
        selectEl.value = "all"; // Đưa dropdown danh mục về lại "Tất cả danh mục"
        // Nếu mày dùng Custom Select bằng Div từ bước trước, hãy kích hoạt dòng dưới để đồng bộ chữ hiển thị:
        const triggerText = document.querySelector(".casa-custom-select-trigger span");
        if (triggerText) triggerText.textContent = "Tất cả danh mục";
    }

    // Phục hồi lại toàn bộ các Card trên Grid hiển thị đầy đủ
    blogCards.forEach(card => {
        card.style.display = ""; 
    });

    // Đóng luôn box bộ lọc cho giao diện sạch sẽ, gọn gàng
    const mainEl = document.querySelector("main");
    if (mainEl) {
        mainEl.classList.remove("filter-activated");
    }
});


});