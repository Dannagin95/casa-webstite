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









/*==========================================================================
   CASA BLOG FILTER SYSTEM - ENGINE CHIA CỘT ĐỘNG CHUẨN XÁC THEO VIEWPORT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. KHAI BÁO DOM ELEMENTS ---
    const mainContainer = document.querySelector('main') || document.querySelector('.casa-container');
    const blogGrid = document.querySelector('.blog-grid');
    const toggleBtn = document.getElementById('toggle-filter-btn');
    const searchInput = document.getElementById("blog-keyword");
    const clearBtn = document.getElementById("casa-clear-search");
    const selectEl = document.getElementById("blog-category");
    const suggestionsBox = document.getElementById("search-suggestions");
    const submitBtn = document.querySelector(".casa-filter-submit-btn");
    const blogCards = document.querySelectorAll(".blog-card");
    const filterFields = document.querySelectorAll(".casa-filter-field");

    let observer = null;

    // --- 2. HÀM KIỂM TRA CARD CÓ THỰC SỰ HIỂN THỊ TRÊN MÀN HÌNH KHÔNG ---
    const isCardActuallyVisible = (card) => {
        // Kiểm tra nếu bản thân card bị ẩn bằng inline style hoặc class ẩn
        if (card.style.display === 'none' || card.classList.contains('hidden') || card.classList.contains('is-hidden')) {
            return false;
        }

        // KIỂM TRA THẰNG CHA (.blog-page-wrapper): Cực kỳ quan trọng để xử lý lỗi Phân Trang!
        const parentWrapper = card.closest('.blog-page-wrapper');
        if (parentWrapper) {
            const isParentHiddenInline = parentWrapper.style.display === 'none' || parentWrapper.getAttribute('style')?.includes('display: none');
            if (isParentHiddenInline) return false;

            const computedParentStyle = window.getComputedStyle(parentWrapper);
            if (computedParentStyle.display === 'none') return false;
        }

        // Cuối cùng: Kiểm tra kích thước vật lý hiển thị thực tế
        return card.offsetWidth > 0 || card.offsetHeight > 0;
    };

    // --- 3. HÀM PHÂN CỘT ĐỘNG CHUẨN XÁC ---
    const updateCardColumns = () => {
        if (blogCards.length === 0 || !blogGrid) return;
        
        // Ngắt giám sát tạm thời để tránh lặp vô hạn khi JS sửa class trong DOM
        if (observer) observer.disconnect();

        // CHỈ lấy những card đang THỰC SỰ HIỂN THỊ trên trang hiện tại
        const visibleCards = Array.from(blogCards).filter(card => isCardActuallyVisible(card));

        // Clear toàn bộ class cột cũ của toàn bộ card
        blogCards.forEach(card => {
            card.classList.remove('casa-col-1', 'casa-col-2', 'casa-col-3');
        });

        // Gán lại class cột dựa trên đúng thứ tự của các card đang thực sự hiển thị
        visibleCards.forEach((card, idx) => {
            const colNum = (idx % 3) + 1; // 1, 2, hoặc 3
            card.classList.add(`casa-col-${colNum}`);
        });

        // Đo chiều cao thực tế của Card hiện tại và set CSS Variable cho Grid
        if (visibleCards.length > 0) {
            const firstCard = visibleCards[0];
            const cardHeight = firstCard.offsetHeight;
            if (cardHeight > 0) {
                blogGrid.style.setProperty('--casa-card-height', `${cardHeight}px`);
            }
        }

        // Kiểm tra xem việc dịch chuyển Domino có làm tăng thêm hàng mới hay không
        if (mainContainer) {
            const isFilterActive = mainContainer.classList.contains('filter-activated');
            // Nếu tổng số card hiển thị chia hết cho 3 (3, 6, 9...), khi đẩy dạt sẽ phát sinh thêm 1 hàng mới tinh
            const needsExpansion = isFilterActive && (visibleCards.length % 3 === 0) && visibleCards.length > 0;
            blogGrid.classList.toggle('grid-expanded', needsExpansion);
        }

        // Bật lại chế độ giám sát DOM
        if (observer) observer.observe(blogGrid, observerConfig);
    };

    // --- 4. HỆ THỐNG GIÁM SÁT DOM TỰ ĐỘNG (MUTATION OBSERVER) ---
    const observerConfig = {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['style', 'class']
    };

    observer = new MutationObserver(() => {
        updateCardColumns();
    });

    if (blogGrid) {
        observer.observe(blogGrid, observerConfig);
    }

    // Chạy lần đầu tiên để thiết lập cột ban đầu
    updateCardColumns();

    // --- 5. TOGGLE BỘ LỌC TÌM KIẾM ---
    if (toggleBtn && mainContainer) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mainContainer.classList.toggle('filter-activated');
            updateCardColumns(); // Đồng bộ lại cột và khoảng đẩy FAQ ngay tức thì
        });

        mainContainer.addEventListener('click', (e) => {
            if (mainContainer.classList.contains('filter-activated') && !e.target.closest('.casa-filter-wrapper')) {
                mainContainer.classList.remove('filter-activated');
                updateCardColumns();
            }
        });
    }

    // --- 6. KHỞI TẠO CUSTOM SELECT UI ---
    filterFields.forEach(field => {
        const select = field.querySelector("select");
        if (!select) return;

        // Tránh tạo trùng lặp nếu code chạy lại nhiều lần
        if (field.querySelector(".casa-custom-select-trigger")) return;

        const trigger = document.createElement("div");
        trigger.className = "casa-custom-select-trigger";
        trigger.innerHTML = `<span>${select.options[select.selectedIndex].text}</span>`;
        field.appendChild(trigger);

        const optionsBox = document.createElement("div");
        optionsBox.className = "casa-custom-options-box";

        Array.from(select.options).forEach((opt, index) => {
            const optItem = document.createElement("div");
            optItem.className = "casa-custom-option-item";
            if (index === select.selectedIndex) optItem.classList.add("active");
            optItem.textContent = opt.text;
            optItem.setAttribute("data-value", opt.value);

            optItem.addEventListener("click", (e) => {
                e.stopPropagation();
                
                trigger.querySelector("span").textContent = opt.text;
                select.value = opt.value;
                select.dispatchEvent(new Event('change'));

                optionsBox.querySelectorAll(".casa-custom-option-item").forEach(item => item.classList.remove("active"));
                optItem.classList.add("active");
                field.classList.remove("is-open");
            });

            optionsBox.appendChild(optItem);
        });

        field.appendChild(optionsBox);

        trigger.addEventListener("click", (e) => {
            e.stopPropagation();
            filterFields.forEach(otherField => {
                if (otherField !== field) otherField.classList.remove("is-open");
            });
            field.classList.toggle("is-open");
        });
    });

    document.addEventListener("click", () => {
        filterFields.forEach(field => field.classList.remove("is-open"));
    });

    // --- 7. DATABASE SUGGEST NHANH ---
    const getBlogDatabase = () => {
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
    };

    const blogDatabase = getBlogDatabase();

    const getCategoryName = (catValue) => {
        if (!selectEl) return "Danh mục khác";
        const opt = selectEl.querySelector(`option[value="${catValue}"]`);
        return opt ? opt.textContent.trim() : "Danh mục khác";
    };

    // --- 8. LOGIC Ô TÌM KIẾM ---
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const query = this.value.trim().toLowerCase();

            if (clearBtn) {
                clearBtn.classList.toggle("is-visible", query.length > 0);
            }

            if (suggestionsBox) {
                suggestionsBox.innerHTML = "";

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
                        
                        const catName = getCategoryName(article.category);

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
            }
        });
    }

    if (clearBtn && searchInput) {
        clearBtn.addEventListener("click", () => {
            searchInput.value = "";
            clearBtn.classList.remove("is-visible");
            if (suggestionsBox) {
                suggestionsBox.innerHTML = "";
                suggestionsBox.classList.remove("is-visible");
            }
            blogCards.forEach(card => card.style.display = "");
            updateCardColumns();
            searchInput.focus();
        });
    }

    document.addEventListener("click", (e) => {
        if (searchInput && suggestionsBox && !searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.classList.remove("is-visible");
        }
    });

    // --- 9. LOGIC LỌC BÀI VIẾT (SUBMIT) ---
    const performFiltering = () => {
        const selectedCategory = selectEl ? selectEl.value : "all";
        const keywordValue = searchInput ? searchInput.value.trim().toLowerCase() : "";

        blogCards.forEach(card => {
            const cardCategory = card.getAttribute("data-category") || "all";
            const titleEl = card.querySelector(".blog-card-title h3");
            const descEl = card.querySelector(".blog-card-desc");
            
            const cardTitle = titleEl ? titleEl.textContent.toLowerCase() : "";
            const cardDesc = descEl ? descEl.textContent.toLowerCase() : "";

            const matchCategory = (selectedCategory === "all" || cardCategory === selectedCategory);
            const matchKeyword = (keywordValue === "" || cardTitle.includes(keywordValue) || cardDesc.includes(keywordValue));

            card.style.display = (matchCategory && matchKeyword) ? "" : "none";
        });

        updateCardColumns();
    };

    if (submitBtn) {
        submitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            performFiltering();

            if (mainContainer) mainContainer.classList.remove("filter-activated");
            if (suggestionsBox) suggestionsBox.classList.remove("is-visible");
        });
    }

    const syncCustomSelectsToNative = () => {
        filterFields.forEach(field => {
            const select = field.querySelector("select");
            const triggerText = field.querySelector(".casa-custom-select-trigger span");
            const customOptions = field.querySelectorAll(".casa-custom-option-item");

            if (select && triggerText) {
                const selectedOpt = select.options[select.selectedIndex];
                triggerText.textContent = selectedOpt ? selectedOpt.text : "";

                customOptions.forEach(optItem => {
                    const val = optItem.getAttribute("data-value");
                    optItem.classList.toggle("active", val === select.value);
                });
            }
        });
    };

    // --- 10. BẢO VỆ KHI PAGESHOW (BFCACHE BACK BUTTON) ---
    window.addEventListener("pageshow", () => {
        if (searchInput) searchInput.value = "";
        if (clearBtn) clearBtn.classList.remove("is-visible");
        if (suggestionsBox) {
            suggestionsBox.innerHTML = "";
            suggestionsBox.classList.remove("is-visible");
        }
        if (selectEl) selectEl.value = "all";

        syncCustomSelectsToNative();

        blogCards.forEach(card => card.style.display = "");

        if (mainContainer) mainContainer.classList.remove('filter-activated');
        
        updateCardColumns();
    });
});