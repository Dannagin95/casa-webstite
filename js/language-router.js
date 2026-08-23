(function () {
    'use strict';

    const ROUTE_PAIRS = [
        ['/', '/en/'],
        ['/index.html', '/en/'],

        ['/lichsu.html', '/en/about.html'],
        ['/Cau_truc.html', '/en/structure.html'],
        ['/Du_an.html', '/en/Our_Projects.html'],
        ['/chungchi.html', '/en/Certifications.html'],
        ['/hethang.html', '/en/straight-lay-flooring.html'],
        ['/quytrinh.html', '/en/process.html'],
        ['/Tai_lieu.html', '/en/catalogue.html'],
        ['/tintuc.html', '/en/news.html'],
        ['/wood.html', '/en/Our_Wood.html'],
        ['/xuongca.html', '/en/herringbone-and-chevron.html'],
        ['/blog.html', '/en/blog.html'],
        ['/contactus.html', '/en/contactus.html'],
        ['/international-collection.html', '/en/international-collection.html'],
        ['/san-pham.html', '/en/products.html'],
        ['/baohanh.html', '/en/warranty.html'],
        ['/showroom.html', '/en/showroom.html'],
        ['/surface.html', '/en/surface.html'],
        ['/tinhtrangbaohanh.html', '/en/warranty_status.html'],
        ['/tracuubaohanh.html', '/en/warranty_lookup.html'],



        [
            '/San_pham/Riva.html',
            '/en/Products/Riva.html'
        ],

        [
            '/San_pham/Alpi.html',
            '/en/Products/Alpi.html'
        ],

        [
            '/San_pham/Mastro.html',
            '/en/Products/Mastro.html'
        ],

        [
            '/San_pham/La-Dolce.html',
            '/en/Products/La-Dolce.html'
        ],

        [
            '/San_pham/Parma.html',
            '/en/Products/Parma.html'
        ],




        [
            '/Du_an/Du-an-khach-san-5-sao.html',
            '/en/Our-Projects/Five-Star-Hotel.html'
        ],

        [
            '/Du_an/Penthouse.html',
            '/en/Our-Projects/Penthouse.html'
        ],

        [
            '/Du_an/Showroom-ADES-Lighting.html',
            '/en/Our-Projects/Showroom-ADES-Lighting.html'
        ],

        [
            '/Du_an/Bao-tang.html',
            '/en/Our-Projects/Antique-Museum.html'
        ],




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
        [
            '/blog/The-Quiet-Foundation-Khi-san-go-tro-thanh-ngon-ngu-chung-cua-nhung-khong-gian-khac-biet.html',
            '/en/Blog/the-quiet-foundation-wood-flooring-across-distinct-spaces.html'
        ],
        [
            '/blog/Vi-sao-engineered-wood-phu-hop-voi-khi-hau-nong-am.html',
            '/en/Blog/why-engineered-wood-suits-hot-humid-climates.html'
        ],



        [
            '/The_Collection/Aesop-Central-House-19.html',
            '/en/The_Collection/Aesop-Central-House-19.html'
        ],
        [
            '/The_Collection/Bauwerk-Parkett-Villapark.html',
            '/en/The_Collection/Bauwerk-Parkett-Villapark.html'
        ],
        [
            '/The_Collection/Best-of-est-Contemporary-Homes.html',
            '/en/The_Collection/Best-of-est-Contemporary-Homes.html'
        ],
        [
            '/The_Collection/Cangshan-Villa.html',
            '/en/The_Collection/Cangshan-Villa.html'
        ],
        [
            '/The_Collection/Fritz-Hansen-Jing-An-Showroom.html',
            '/en/The_Collection/Fritz-Hansen-Jing-An-Showroom.html'
        ],
        [
            '/The_Collection/Home-Tour-Collector’s-Penthouse.html',
            '/en/The_Collection/Home-Tour-Collector’s-Penthouse.html'
        ],
        [
            '/The_Collection/Home-Tour-Colony.html',
            '/en/The_Collection/Home-Tour-Colony.html'
        ],
        [
            '/The_Collection/Home-Tour-Elystan.html',
            '/en/The_Collection/Home-Tour-Elystan.html'
        ],
        [
            '/The_Collection/Home-Tour-Residence-GF.html',
            '/en/The_Collection/Home-Tour-Residence-GF.html'
        ],
        [
            '/The_Collection/Home-Tour-Southampton.html',
            '/en/The_Collection/Home-Tour-Southampton.html'
        ],
        [
            '/The_Collection/Home-Tour-Woodland-House.html',
            '/en/The_Collection/Home-Tour-Woodland-House.html'
        ],
        [
            '/The_Collection/Koloru-House.html',
            '/en/The_Collection/Koloru-House.html'
        ],
        [
            '/The_Collection/Layered-Sydney-Home.html',
            '/en/The_Collection/Layered-Sydney-Home.html'
        ],
        [
            '/The_Collection/Lost-&-Found.html',
            '/en/The_Collection/Lost-&-Found.html'
        ],
        [
            '/The_Collection/Open-House.html',
            '/en/The_Collection/Open-House.html'
        ]

    ];

    const LANGUAGE_STORAGE_KEY = 'casaPreferredLanguage';

    function normalizeRouteKey(pathname) {
        let path = pathname || '/';

        try {
            path = decodeURIComponent(path);
        } catch (error) {}

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

    const VI_TO_EN = new Map();
    const EN_TO_VI = new Map();

    ROUTE_PAIRS.forEach(([vi, en]) => {
        VI_TO_EN.set(normalizeRouteKey(vi), en);
        EN_TO_VI.set(normalizeRouteKey(en), vi);
    });

    VI_TO_EN.set(normalizeRouteKey('/'), '/en/');
    EN_TO_VI.set(normalizeRouteKey('/en/'), '/');

    function currentSiteLanguage(pathname) {
        let path = pathname || '/';

        try {
            path = decodeURIComponent(path);
        } catch (error) {}

        if (
            path === '/en' ||
            path === '/en/' ||
            path.startsWith('/en/')
        ) {
            return 'EN';
        }

        return 'VN';
    }

    function getPreferredLanguage() {
        try {
            const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);

            if (saved === 'EN' || saved === 'VN') {
                return saved;
            }
        } catch (error) {}

        return currentSiteLanguage(window.location.pathname);
    }

    function savePreferredLanguage(language) {
        if (language !== 'EN' && language !== 'VN') {
            return;
        }

        try {
            localStorage.setItem(
                LANGUAGE_STORAGE_KEY,
                language
            );
        } catch (error) {}
    }

    function getTargetLanguage(element) {
        const declared =
            element && element.getAttribute
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

    function syncLanguageUI() {
        const currentLanguage =
            currentSiteLanguage(
                window.location.pathname
            );

        const isEnglish =
            currentLanguage === 'EN';

        const headerFlag =
            document.querySelector(
                '#lang-trigger > .flag-icon'
            );

        const headerText =
            document.querySelector(
                '#lang-trigger > span'
            );

        if (headerFlag) {
            headerFlag.src = isEnglish
                ? 'https://flagcdn.com/w40/us.png'
                : 'https://flagcdn.com/w40/vn.png';

            headerFlag.alt = isEnglish
                ? 'EN Flag'
                : 'VN Flag';
        }

        if (headerText) {
            headerText.textContent = isEnglish
                ? 'ENG'
                : 'VIE';
        }

        document
            .querySelectorAll('.casa-current-flag')
            .forEach(flag => {
                flag.src = isEnglish
                    ? 'https://flagcdn.com/w40/us.png'
                    : 'https://flagcdn.com/w40/vn.png';

                flag.alt = isEnglish
                    ? 'EN'
                    : 'VN';
            });

        document
            .querySelectorAll('.casa-current-text')
            .forEach(text => {
                text.textContent = isEnglish
                    ? 'ENG'
                    : 'VIE';
            });

        const footerFlag =
            document.getElementById(
                'currentFlag'
            );

        const footerText =
            document.getElementById(
                'currentLanggText'
            );

        if (footerFlag) {
            footerFlag.src = isEnglish
                ? 'https://flagcdn.com/w80/us.png'
                : 'https://flagcdn.com/w80/vn.png';

            footerFlag.alt = isEnglish
                ? 'EN'
                : 'VN';
        }

        if (footerText) {
            footerText.textContent = isEnglish
                ? 'ENG'
                : 'VIE';
        }

        document
            .querySelectorAll('.lang-item')
            .forEach(item => {
                item.classList.toggle(
                    'active',
                    getTargetLanguage(item) ===
                        currentLanguage
                );
            });

        document
            .querySelectorAll('.casa-sheet-item')
            .forEach(item => {
                item.classList.toggle(
                    'active',
                    getTargetLanguage(item) ===
                        currentLanguage
                );
            });

        document
            .querySelectorAll('.langg-dropdown li')
            .forEach(item => {
                item.classList.toggle(
                    'active',
                    getTargetLanguage(item) ===
                        currentLanguage
                );
            });

        document
            .querySelectorAll('.lang-sheet-list li')
            .forEach(item => {
                item.classList.toggle(
                    'active',
                    getTargetLanguage(item) ===
                        currentLanguage
                );
            });
    }

    function resolveLanguageRoute(targetLanguage) {
        const currentPath =
            normalizeRouteKey(
                window.location.pathname
            );

        const currentLanguage =
            currentSiteLanguage(
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

    function switchCasaLanguage(targetLanguage) {
        savePreferredLanguage(targetLanguage);

        const targetPath =
            resolveLanguageRoute(
                targetLanguage
            );

        if (!targetPath) {
            syncLanguageUI();
            return;
        }

        const destination =
            targetPath +
            window.location.search +
            window.location.hash;

        window.location.replace(destination);
    }

    function enforcePreferredLanguage() {
        const preferredLanguage =
            getPreferredLanguage();

        const currentLanguage =
            currentSiteLanguage(
                window.location.pathname
            );

        if (
            preferredLanguage ===
            currentLanguage
        ) {
            return false;
        }

        const currentPath =
            normalizeRouteKey(
                window.location.pathname
            );

        let targetPath = null;

        if (
            preferredLanguage === 'EN' &&
            VI_TO_EN.has(currentPath)
        ) {
            targetPath =
                VI_TO_EN.get(currentPath);
        }

        if (
            preferredLanguage === 'VN' &&
            EN_TO_VI.has(currentPath)
        ) {
            targetPath =
                EN_TO_VI.get(currentPath);
        }

        if (!targetPath) {
            return false;
        }

        const destination =
            targetPath +
            window.location.search +
            window.location.hash;

        window.location.replace(destination);

        return true;
    }

    document.addEventListener(
        'click',
        function (event) {
            const option =
                event.target.closest(
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

    function initializeLanguageState() {
        const redirected =
            enforcePreferredLanguage();

        if (!redirected) {
            syncLanguageUI();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            initializeLanguageState
        );
    } else {
        initializeLanguageState();
    }

    window.addEventListener(
        'pageshow',
        function () {
            const redirected =
                enforcePreferredLanguage();

            if (!redirected) {
                syncLanguageUI();
            }
        }
    );

    window.CASALanguageRouter =
        Object.freeze({
            switchLanguage:
                switchCasaLanguage
        });
})();