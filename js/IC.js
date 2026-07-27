document.addEventListener("DOMContentLoaded", () => {
        const filterBtns = document.querySelectorAll(".filter-btn");
        const bentoItems = document.querySelectorAll(".bento-item");

        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                // Đổi trạng thái active của nút
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const filterValue = btn.getAttribute("data-filter");

                bentoItems.forEach(item => {
                    const category = item.getAttribute("data-category");
                    if (filterValue === "all" || category === filterValue) {
                        item.classList.remove("is-hidden");
                    } else {
                        item.classList.add("is-hidden");
                    }
                });
            });
        });
    });