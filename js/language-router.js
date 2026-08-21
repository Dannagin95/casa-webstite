(function () {
    'use strict';

    const ROUTE_PAIRS = [
        ['/', '/en/'],
        ['/index.html', '/en/'],

        // =========================================================
        // LEVEL 1
        // =========================================================

        ['/lichsu.html', '/en/lichsu.html'],
        ['/Cau_truc.html', '/en/Cau_truc.html'],

        ['/Du_an.html', '/en/Du_an.html'],
        ['/chungchi.html', '/en/chungchi.html'],
        ['/hethang.html', '/en/hethang.html'],
        ['/quytrinh.html', '/en/quytrinh.html'],

        ['/Tai_lieu.html', '/en/Tai_lieu.html'],
        ['/tintuc.html', '/en/tintuc.html'],
        ['/wood.html', '/en/wood.html'],
        ['/xuongca.html', '/en/xuongca.html'],

        ['/blog.html', '/en/blog.html'],
        ['/contactus.html', '/en/contactus.html'],
        ['/international-collection.html', '/en/international-collection.html'],
        ['/san-pham.html', '/en/san-pham.html'],

        ['/baohanh.html', '/en/baohanh.html'],
        ['/showroom.html', '/en/showroom.html'],
        ['/surface.html', '/en/surface.html'],
        ['/tinhtrangbaohanh.html', '/en/tinhtrangbaohanh.html'],
        ['/tracuubaohanh.html', '/en/tracuubaohanh.html'],

        // =========================================================
        // BLOG — BATCH 01
        // =========================================================

        [
            '/blog/Cau-truc-va-dac-tinh-cua-go-tu-nhien.html',
            '/en/Blog/natural-wood-structure-and-characteristics.html'
        ],

        [
            '/blog/Designed-to-Last_Huong-dan-bao-duong-san-go-ky-thuat.html',
            '/en/Blog/engineered-wood-flooring-care-guide.html'
        ],

        [
            '/blog/Cac-kieu-lat-san-go.html',
            '/en/Blog/wood-flooring-patterns.html'
        ],

        [
            '/blog/Cac-loai-san-go-tu-nhien-pho-bien-trong-san-go.html',
            '/en/Blog/natural-wood-species-for-flooring.html'
        ],

        // =========================================================
        // BLOG — BATCH 02
        // =========================================================

        [
            '/blog/Dieu-gi-tao-nen-gia-tri-cua-mot-tam-van-san-go-cao-cap.html',
            '/en/Blog/what-defines-premium-wood-flooring.html'
        ],

        [
            '/blog/Go-Oc-Cho-(Walnut)-Vi-sao-luon-xuat-hien-trong-nhieu-cong-trinh-cao-cap.html',
            '/en/Blog/walnut-wood-characteristics-and-interior-applications.html'
        ],

        [
            '/blog/Go-Soi-(Oak)-Dac-diem-van-go-do-cung-va-ung-dung.html',
            '/en/Blog/oak-wood-grain-hardness-and-interior-applications.html'
        ],

        [
            '/blog/Go-Teak-Mot-trong-nhung-vat-lieu-ben-vung-cua-kien-truc-hien-dai.html',
            '/en/Blog/teak-wood-in-modern-architecture.html'
        ],

        [
            '/blog/Điều-gì-khiến-sàn-gỗ-bị-cong-vênh.html',
            '/en/Blog/what-causes-wood-flooring-to-warp.html'
        ],

        // =========================================================
        // BLOG — BATCH 03
        // =========================================================

        [
            '/blog/Phan-biet-san-go-Tu-nhien-Cong-nghiep-va-san-go-Ky-thuat.html',
            '/en/Blog/natural-vs-laminate-vs-engineered-wood-flooring.html'
        ],

        [
            '/blog/San-go-ky-thuat.html',
            '/en/Blog/engineered-wood-flooring.html'
        ],

        [
            '/blog/Herringbone-90°.html',
            '/en/Blog/herringbone-90-italian-heritage.html'
        ],

        [
            '/blog/Hieu-ung-be-mat-anh-huong-den-cam-giac-san-go-nhu-the-nao.html',
            '/en/Blog/wood-flooring-surface-textures.html'
        ],

        [
            '/blog/Nhịp-điệu-của-vân-gỗ-tự-nhiên.html',
            '/en/Blog/natural-wood-grain-rhythm.html'
        ],

        // =========================================================
        // BLOG — BATCH 04
        // =========================================================

        [
            '/blog/Son-goc-dau-(Oil Finish)-va-son-goc-nuoc-(Water-Based Finish)-khac-nhau-nhu-the-nao.html',
            '/en/Blog/oil-finish-vs-water-based-finish.html'
        ],

        [
            '/blog/So-sánh-gỗ-tự-nhiên(Veneer)-và-nhân-tạo(Laminate).html',
            '/en/Blog/natural-wood-veneer-vs-laminate.html'
        ],

        [
            '/blog/Tam-anh-huong-cua-mau-san-go.html',
            '/en/Blog/how-wood-flooring-color-shapes-a-space.html'
        ],

        [
            '/blog/San-go-va-Suc-khoe_Giai-ma-cac-tieu-chuan-phat-thai-Formaldehyde(E1, CARB P2, F★★★★).html',
            '/en/Blog/wood-flooring-formaldehyde-emission-standards.html'
        ],

        // =========================================================
        // BLOG — FINAL BATCH
        // =========================================================

        [
            '/blog/The-Quiet-Foundation-Khi-san-go-tro-thanh-ngon-ngu-chung-cua-nhung-khong-gian-khac-biet.html',
            '/en/Blog/the-quiet-foundation-wood-flooring-across-distinct-spaces.html'
        ],

        [
            '/blog/Vi-sao-engineered-wood-phu-hop-voi-khi-hau-nong-am.html',
            '/en/Blog/why-engineered-wood-suits-hot-humid-climates.html'
        ]
    ];


    // =========================================================
    // ROUTE NORMALIZATION
    // =========================================================

    function normalizeRouteKey(pathname) {
        let path = pathname || '/';

        try {
            path = decodeURIComponent(path);
        } catch (error) {
            // Keep original pathname if decoding fails.
        }

        if (!path.startsWith('/')) {
            path = '/' + path;
        }

        path = path.replace(/\/{2,}/g, '/');

        if (path === '/index.html') {
            return '/';
        }

        if (
            path === '/en' ||
            path === '/en/' ||
            path === '/en/index.html'
        ) {
            return '/en/';
        }

        if (path.length > 1) {
            path = path.replace(/\/+$/, '');
            path = path.replace(/\.html$/i, '');
        }

        return path.toLowerCase();
    }


    // =========================================================
    // BUILD ROUTE MAPS
    // =========================================================

    const VI_TO_EN = new Map();
    const EN_TO_VI = new Map();

    ROUTE_PAIRS.forEach(([vi, en]) => {
        VI_TO_EN.set(
            normalizeRouteKey(vi),
            en
        );

        EN_TO_VI.set(
            normalizeRouteKey(en),
            vi
        );
    });

    VI_TO_EN.set(
        normalizeRouteKey('/'),
        '/en/'
    );

    EN_TO_VI.set(
        normalizeRouteKey('/en/'),
        '/'
    );


    // =========================================================
    // DETECT LANGUAGE FROM CLICKED ELEMENT
    // =========================================================

    function getTargetLanguage(element) {
        const declared = element && element.getAttribute
            ? element.getAttribute('data-lang')
            : null;

        if (declared) {
            const value = declared.trim().toUpperCase();

            if (value === 'VN' || value === 'VIE') {
                return 'VN';
            }

            if (value === 'EN' || value === 'ENG') {
                return 'EN';
            }
        }

        const text = (
            element && element.textContent
                ? element.textContent
                : ''
        )
            .trim()
            .toLowerCase();

        if (
            text.includes('english') ||
            text.includes('(eng)')
        ) {
            return 'EN';
        }

        if (
            text.includes('vietnam') ||
            text.includes('(vie)')
        ) {
            return 'VN';
        }

        return null;
    }


    // =========================================================
    // DETECT CURRENT SITE LANGUAGE
    // =========================================================

    function currentSiteLanguage(pathname) {
        let path = pathname || '/';

        try {
            path = decodeURIComponent(path);
        } catch (error) {
            // Keep original pathname if decoding fails.
        }

        if (
            path === '/en' ||
            path === '/en/' ||
            path.startsWith('/en/')
        ) {
            return 'EN';
        }

        return 'VN';
    }


    // =========================================================
    // RESOLVE TARGET ROUTE
    // =========================================================

    function resolveLanguageRoute(targetLanguage) {
        const currentPath = normalizeRouteKey(
            window.location.pathname
        );

        const currentLanguage = currentSiteLanguage(
            window.location.pathname
        );

        if (targetLanguage === currentLanguage) {
            return null;
        }

        if (targetLanguage === 'EN') {
            if (VI_TO_EN.has(currentPath)) {
                return VI_TO_EN.get(currentPath);
            }

            console.warn(
                '[CASA Language Router] EN route not found:',
                window.location.pathname
            );

            return '/en/';
        }

        if (targetLanguage === 'VN') {
            if (EN_TO_VI.has(currentPath)) {
                return EN_TO_VI.get(currentPath);
            }

            console.warn(
                '[CASA Language Router] VN route not found:',
                window.location.pathname
            );

            return '/';
        }

        return null;
    }


    // =========================================================
    // SWITCH LANGUAGE
    // =========================================================

    function switchCasaLanguage(targetLanguage) {
        const targetPath = resolveLanguageRoute(
            targetLanguage
        );

        if (!targetPath) {
            return;
        }

        const destination =
            targetPath +
            window.location.search +
            window.location.hash;

        window.location.replace(destination);
    }


    // =========================================================
    // LANGUAGE CLICK LISTENER
    // =========================================================

    document.addEventListener(
        'click',
        function (event) {
            const option = event.target.closest(
                '.lang-item, ' +
                '.casa-sheet-item, ' +
                '.langg-dropdown li, ' +
                '.lang-sheet-list li'
            );

            if (!option) {
                return;
            }

            const targetLanguage =
                getTargetLanguage(option);

            if (!targetLanguage) {
                return;
            }

            switchCasaLanguage(
                targetLanguage
            );
        },
        true
    );


    // =========================================================
    // PUBLIC API
    // =========================================================

    window.CASALanguageRouter = Object.freeze({
        switchLanguage: switchCasaLanguage
    });

})();