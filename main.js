// Main JS for CHRONOS Website

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const heroImage = document.querySelector('.hero-image img');
    const preloader = document.getElementById('preloader');
    const toastContainer = document.getElementById('toastContainer');

    function showToast(message) {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerText = message;
        toastContainer.appendChild(toast);

        // Force reflow
        toast.offsetHeight;

        toast.classList.add('active');

        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');
    const cartCount = document.querySelector('.cart-count');
    let inventory = 0;

    // Mobile Menu Toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.querySelector('i').classList.toggle('fa-bars');
            navToggle.querySelector('i').classList.toggle('fa-times');
        });
    }

    // Remove active menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (navToggle.querySelector('i')) {
                    navToggle.querySelector('i').classList.add('fa-bars');
                    navToggle.querySelector('i').classList.remove('fa-times');
                }
            }
        });
    });

    // Shopping Bag & Inquiry Interaction
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            inventory++;
            if (cartCount) {
                cartCount.innerText = inventory;
                cartCount.style.transform = 'scale(1.5)';
                setTimeout(() => cartCount.style.transform = 'scale(1)', 300);
            }

            // Open Inquiry Modal for a premium experience
            const card = e.target.closest('.product-card');
            if (card && modal) {
                const title = card.querySelector('h3').innerText;
                const imgSrc = card.querySelector('.img-container img').src;
                if (modalTitle) modalTitle.innerText = `Acquisition Inquiry: ${title}`;
                if (modalImg) modalImg.src = imgSrc;
                modal.classList.add('active');
            }
        });
    });

    // Magnifying Lens Logic
    const containers = document.querySelectorAll('.img-container');
    containers.forEach(container => {
        const img = container.querySelector('img');
        const magnifier = container.querySelector('.magnifier');

        if (magnifier) {
            container.addEventListener('mousemove', (e) => {
                magnifier.style.display = 'block';
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                magnifier.style.left = `${x - magnifier.offsetWidth / 2}px`;
                magnifier.style.top = `${y - magnifier.offsetHeight / 2}px`;

                const zoom = 2;
                magnifier.style.backgroundImage = `url(${img.src})`;
                magnifier.style.backgroundSize = `${img.width * zoom}px ${img.height * zoom}px`;
                magnifier.style.backgroundPosition = `-${x * zoom - magnifier.offsetWidth / 2}px -${y * zoom - magnifier.offsetHeight / 2}px`;
            });

            container.addEventListener('mouseleave', () => {
                magnifier.style.display = 'none';
            });
        }
    });

    // Remove preloader
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                preloader.style.opacity = '0';
                setTimeout(() => preloader.style.display = 'none', 1000);
            }
        }, 1500);
    });

    // Horizontal Scroll Logic
    const scrollWrapper = document.querySelector('.horizontal-scroll-wrapper');
    const scrollContainer = document.querySelector('.horizontal-scroll-container');

    if (scrollWrapper && scrollContainer) {
        window.addEventListener('scroll', () => {
            const wrapperTop = scrollWrapper.offsetTop;
            const wrapperHeight = scrollWrapper.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollPos = window.pageYOffset;

            if (scrollPos >= wrapperTop && scrollPos <= (wrapperTop + wrapperHeight - windowHeight)) {
                const percentage = (scrollPos - wrapperTop) / (wrapperHeight - windowHeight);
                const transform = percentage * (scrollContainer.offsetWidth - window.innerWidth);
                scrollContainer.style.transform = `translateX(-${transform}px)`;
            }
        });
    }

    // Scroll Logic: Progress Bar & Back to Top
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.pageYOffset;
        const scrollPercentage = (scrollPosition / totalHeight) * 100;

        if (scrollProgress) {
            scrollProgress.style.width = scrollPercentage + '%';
        }

        if (backToTop) {
            if (scrollPosition > 500) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        }

        // Navbar scroll effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Countdown Logic
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7); // 7 days from now

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = targetDate - now;

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        if (document.getElementById('days')) {
            document.getElementById('days').innerText = d.toString().padStart(2, '0');
            document.getElementById('hours').innerText = h.toString().padStart(2, '0');
            document.getElementById('mins').innerText = m.toString().padStart(2, '0');
            document.getElementById('secs').innerText = s.toString().padStart(2, '0');
        }
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Word Time Clocks
    function setClock(id, timezone) {
        const clock = document.getElementById(id);
        if (!clock) return;

        const hourHand = clock.querySelector('.hour-hand');
        const minHand = clock.querySelector('.min-hand');
        const secHand = clock.querySelector('.sec-hand');

        const now = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();

        const secDeg = (seconds / 60) * 360;
        const minDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
        const hourDeg = (hours / 12) * 360 + (minutes / 60) * 30;

        if (secHand) secHand.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
        if (minHand) minHand.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
        if (hourHand) hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    }

    function updateAllClocks() {
        setClock('clock-geneva', 'Europe/Zurich');
        setClock('clock-ny', 'America/New_York');
        setClock('clock-tokyo', 'Asia/Tokyo');
    }
    setInterval(updateAllClocks, 1000);
    updateAllClocks();

    // Bespoke Atelier Logic
    const colorDots = document.querySelectorAll('.color-dot');
    const atelierWatch = document.getElementById('atelier-watch');
    const atelierStatus = document.getElementById('atelier-status');

    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');

            const color = dot.getAttribute('data-color');
            const imgSrc = dot.getAttribute('data-img');

            if (atelierWatch) {
                atelierWatch.style.filter = 'blur(10px) opacity(0)';
                setTimeout(() => {
                    atelierWatch.src = imgSrc;
                    atelierWatch.style.filter = 'blur(0) opacity(1)';
                    if (atelierStatus) {
                        atelierStatus.innerText = `Titanium ${color.charAt(0).toUpperCase() + color.slice(1)} Finish Selected`;
                    }
                }, 400);
            }
        });
    });

    // Certificate Generator Logic
    const generateBtn = document.getElementById('generateCert');
    const certModal = document.getElementById('certModal');
    const closeCert = document.getElementById('closeCert');
    const verifyBtn = document.querySelector('#ledger .btn-secondary');

    if (generateBtn && certModal) {
        generateBtn.addEventListener('click', () => {
            certModal.classList.add('active');
            showToast("Generating Encrypted Certificate...");
            if (cursorFollower) {
                cursorFollower.style.borderColor = '#000';
            }
        });

        if (closeCert) {
            closeCert.addEventListener('click', () => {
                certModal.classList.remove('active');
                if (cursorFollower) {
                    cursorFollower.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                }
            });
        }
    }

    if (verifyBtn) {
        verifyBtn.addEventListener('click', () => {
            showToast("Connecting to Geneva Node...");
            setTimeout(() => {
                showToast("Authenticity Verified on Blockchain.");
            }, 1000);
        });
    }

    // Verify on Node Interaction
    document.querySelectorAll('.btn-secondary').forEach(btn => {
        if (btn.innerText.includes('Verify on Node')) {
            btn.addEventListener('click', () => {
                showToast('Synchronizing with Chronos Mainnet...');
                setTimeout(() => showToast('Authenticity Verified: Block #827,104'), 1500);
            });
        }
    });

    // Concierge Panel Actions
    const conciergeActions = document.querySelectorAll('.concierge-panel .btn');
    conciergeActions.forEach(btn => {
        btn.addEventListener('click', () => {
            showToast("Notifying your Private Concierge...");
            setTimeout(() => {
                showToast("A consultant will be with you shortly.");
                if (conciergePanel) conciergePanel.classList.remove('active');
            }, 1500);
        });
    });


    // Newsletter Subscription Simulation
    const newsletterBtn = document.querySelector('.newsletter .btn');
    const newsletterInput = document.querySelector('.newsletter input');

    if (newsletterBtn && newsletterInput) {
        newsletterBtn.addEventListener('click', () => {
            if (newsletterInput.value.includes('@')) {
                showToast("Securing Private Access...");
                setTimeout(() => {
                    showToast("Welcome to the Chronos Club.");
                    newsletterInput.value = '';
                }, 1500);
            } else {
                showToast("Please enter a valid luxury email.");
            }
        });
    }

    // Ledger Card 3D Tilt (Enhanced)
    const ledgerCard = document.querySelector('.ledger-card');
    if (ledgerCard) {
        ledgerCard.addEventListener('mousemove', (e) => {
            const rect = ledgerCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (centerY - y) / 10;
            const rotateY = (x - centerX) / 10;

            ledgerCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        ledgerCard.addEventListener('mouseleave', () => {
            ledgerCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    }

    // Lume Mode Toggle
    const lumeToggle = document.getElementById('lumeToggle');
    if (lumeToggle) {
        lumeToggle.addEventListener('click', () => {
            document.body.classList.toggle('lume-mode');
            const icon = lumeToggle.querySelector('i');
            if (document.body.classList.contains('lume-mode')) {
                icon.classList.replace('fa-eye', 'fa-eye-slash');
                if (cursorFollower) {
                    cursorFollower.style.borderColor = 'var(--accent-color)';
                }
            } else {
                icon.classList.replace('fa-eye-slash', 'fa-eye');
                if (cursorFollower) {
                    cursorFollower.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                }
            }
        });
    }

    // Unboxing Experience Logic
    const watchBox = document.getElementById('watchBox');
    const serialReveal = document.querySelector('.serial-reveal');
    if (watchBox) {
        watchBox.addEventListener('click', () => {
            watchBox.classList.toggle('open');
            if (watchBox.classList.contains('open')) {
                if (serialReveal) {
                    serialReveal.style.opacity = '1';
                    serialReveal.style.transform = 'translateX(-50%) translateY(-20px)';
                    serialReveal.style.transition = 'all 1s 1s ease';
                }
                if (cursorFollower) {
                    cursorFollower.style.background = 'rgba(212, 175, 55, 0.4)';
                    cursorFollower.style.boxShadow = '0 0 50px var(--accent-color)';
                }
            } else {
                if (serialReveal) {
                    serialReveal.style.opacity = '0';
                    serialReveal.style.transform = 'translateX(-50%) translateY(0)';
                }
                if (cursorFollower) {
                    cursorFollower.style.background = 'transparent';
                    cursorFollower.style.boxShadow = 'none';
                }
            }
        });

        newFunction();
    }

    // Comparison Compass Logic
    const selectorItems = document.querySelectorAll('.selector-item');
    const slotA = document.getElementById('slot-a');
    const slotB = document.getElementById('slot-b');
    const comparisonData = document.getElementById('comparison-data');
    let selectedWatches = [null, null];

    selectorItems.forEach(item => {
        item.addEventListener('click', () => {
            const watchData = {
                name: item.getAttribute('data-name'),
                caliber: item.getAttribute('data-caliber'),
                case: item.getAttribute('data-case'),
                material: item.getAttribute('data-material'),
                res: item.getAttribute('data-res'),
                img: item.getAttribute('data-img')
            };

            if (!selectedWatches[0]) {
                selectedWatches[0] = watchData;
                updateSlot(slotA, watchData);
            } else if (!selectedWatches[1]) {
                selectedWatches[1] = watchData;
                updateSlot(slotB, watchData);
            } else {
                selectedWatches[0] = selectedWatches[1];
                selectedWatches[1] = watchData;
                updateSlot(slotA, selectedWatches[0]);
                updateSlot(slotB, selectedWatches[1]);
            }

            updateComparisonTable();
        });
    });

    function newFunction() {
        watchBox.addEventListener('mouseenter', () => {
            cursor.classList.add('viewing');
            cursor.innerText = 'OPEN';
        });

        watchBox.addEventListener('mouseleave', () => {
            cursor.classList.remove('viewing');
            cursor.innerText = '';
        });
    }

    function updateSlot(slot, data) {
        slot.classList.add('active');
        slot.querySelector('img').src = data.img;
        slot.querySelector('.watch-name').innerText = data.name;
    }

    function updateComparisonTable() {
        if (selectedWatches[0] && selectedWatches[1]) {
            comparisonData.classList.add('active');
            comparisonData.innerHTML = `
                <div class="data-row">
                    <div class="data-value" style="text-align:right">${selectedWatches[0].caliber}</div>
                    <div class="data-label">Caliber</div>
                    <div class="data-value">${selectedWatches[1].caliber}</div>
                </div>
                <div class="data-row">
                    <div class="data-value" style="text-align:right">${selectedWatches[0].case}</div>
                    <div class="data-label">Case</div>
                    <div class="data-value">${selectedWatches[1].case}</div>
                </div>
                <div class="data-row">
                    <div class="data-value" style="text-align:right">${selectedWatches[0].material}</div>
                    <div class="data-label">Material</div>
                    <div class="data-value">${selectedWatches[1].material}</div>
                </div>
                <div class="data-row">
                    <div class="data-value" style="text-align:right">${selectedWatches[0].res}</div>
                    <div class="data-label">Water Resistance</div>
                    <div class="data-value">${selectedWatches[1].res}</div>
                </div>
            `;
        }
    }

    // Modal Logic & Inquiries
    const modal = document.getElementById('productModal');
    const modalClose = document.getElementById('modalClose');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');

    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            showToast("Acquisition started...");
            const card = e.target.closest('.product-card');
            if (!card) return;

            const title = card.querySelector('h3').innerText;
            const imgSrc = card.querySelector('img').src;

            setTimeout(() => {
                showToast(`Opening registry for ${title}`);
                if (modalTitle) modalTitle.innerText = `Inquire: ${title}`;
                if (modalImg) modalImg.src = imgSrc;
                if (modal) modal.style.display = 'flex';
            }, 800);
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // 3D Card Tilt Physics
    const cards = document.querySelectorAll('.product-card, .premium-card, .craft-image img, .compass-slot, .testimonial-card, .boutique-item');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });

    // Cinematic Text Splitting
    const headers = document.querySelectorAll('.hero-content h1, .section-title h2');
    headers.forEach(header => {
        const text = header.innerText;
        header.innerHTML = text.split('').map((char, index) =>
            `<span class="char" style="display:inline-block; transition-delay: ${index * 0.03}s">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
    });

    // Custom Cursor Movement
    document.addEventListener('mousemove', (e) => {
        if (cursor && cursorFollower) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }
    });

    // Cursor hover effects
    document.querySelectorAll('a, button, .product-card, .hotspot, #back-to-top, .cart-icon, .clock, .color-dot, .selector-item, .compass-slot, .testimonial-card, .boutique-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) cursor.style.background = 'var(--accent-color)';
            if (cursorFollower) cursorFollower.style.transform = 'translate(-50%, -50%) scale(2)';
        });
        el.addEventListener('mouseleave', () => {
            if (cursor) cursor.style.background = 'transparent';
            if (cursorFollower) cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Product Card Hover
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            cursor.innerText = 'VIEW';
            cursor.classList.add('viewing');
        });
        card.addEventListener('mouseleave', () => {
            cursor.innerText = '';
            cursor.classList.remove('viewing');
        });
    });

    // Testimonial Hover
    document.querySelectorAll('.testimonial-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            cursor.innerText = 'VOICES';
            cursor.classList.add('viewing');
        });
        card.addEventListener('mouseleave', () => {
            cursor.innerText = '';
            cursor.classList.remove('viewing');
        });
    });

    // Boutique Hover
    document.querySelectorAll('.boutique-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            cursor.innerText = 'GLOBAL';
            cursor.classList.add('viewing');
        });
        item.addEventListener('mouseleave', () => {
            cursor.innerText = '';
            cursor.classList.remove('viewing');
        });
    });

    // Contextual Cursor for Horizontal Panels & Images
    document.querySelectorAll('.horizontal-scroll-container .scroll-panel').forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            cursor.classList.add('viewing');
            cursor.innerText = 'VIEW';
        });
        panel.addEventListener('mouseleave', () => {
            cursor.classList.remove('viewing');
            cursor.innerText = '';
        });
    });

    document.querySelectorAll('.img-container, .compass-container').forEach(container => {
        container.addEventListener('mouseenter', () => {
            cursor.classList.add('viewing');
            cursor.innerText = container.classList.contains('compass-container') ? 'COMPARE' : 'ZOOM';
        });
        container.addEventListener('mouseleave', () => {
            cursor.classList.remove('viewing');
            cursor.innerText = '';
        });
    });

    // Magnetic Buttons Effect
    const magneticElements = document.querySelectorAll('.btn, .logo, .nav-links a, .social-links a, .cart-icon');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = `translate(0px, 0px)`;
        });
    });

    // Currency Switcher Logic
    const currencySelect = document.getElementById('currencySelect');
    const rates = { USD: 1, CHF: 0.92, EUR: 0.85, GBP: 0.73 };
    const symbols = { USD: '$', CHF: '₣', EUR: '€', GBP: '£' };

    if (currencySelect) {
        currencySelect.addEventListener('change', (e) => {
            const currency = e.target.value;
            const rate = rates[currency];
            const symbol = symbols[currency];

            // High-precision price engine using data-price attributes
            document.querySelectorAll('[data-price]').forEach(el => {
                const basePrice = parseFloat(el.getAttribute('data-price'));
                const newPrice = (basePrice * rate).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                el.innerText = `${symbol}${newPrice}`;
            });
            currencySelect.setAttribute('data-prev', currency);
        });
    }

    // Concierge Logic
    const conciergeToggle = document.getElementById('conciergeToggle');
    const conciergePanel = document.getElementById('conciergePanel');
    if (conciergeToggle && conciergePanel) {
        conciergeToggle.addEventListener('click', () => {
            conciergePanel.classList.toggle('active');
            const badge = conciergeToggle.querySelector('.concierge-badge');
            if (badge) badge.style.display = 'none';
        });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!conciergeToggle.contains(e.target) && !conciergePanel.contains(e.target)) {
                conciergePanel.classList.remove('active');
            }
        });
    }


    // Side Navigation Dots with Professional Mapping
    const sectionLabels = {
        home: "Arrival",
        about: "Heritage",
        anatomy: "Precision",
        specifications: "Manifesto",
        features: "Features",
        limited: "Exclusive",
        masterpieces: "Spotlight",
        products: "Gallery",
        atelier: "Atelier",
        compass: "Compass",
        ledger: "Ledger",
        membership: "Inner Circle",
        access: "Services",
        timeline: "Legacy",
        masterclass: "Workshop",
        unboxing: "Reveal",
        testimonials: "Voices",
        boutiques: "World",
        contact: "Connect"
    };

    const sections = document.querySelectorAll('section[id]');
    const sideNav = document.createElement('div');
    sideNav.className = 'side-nav';
    sections.forEach(section => {
        const dot = document.createElement('a');
        dot.href = `#${section.id}`;
        dot.className = 'side-dot';
        dot.setAttribute('data-target', section.id);
        dot.setAttribute('data-label', sectionLabels[section.id] || (section.id.charAt(0).toUpperCase() + section.id.slice(1)));
        sideNav.appendChild(dot);
    });
    document.body.appendChild(sideNav);

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.side-dot').forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-target') === current) {
                dot.classList.add('active');
            }
        });
    });

    // Parallax effect
    window.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.02;

        if (heroImage) {
            heroImage.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${moveX * 0.5}deg)`;
        }

        document.querySelectorAll('.floating-gear').forEach(gear => {
            const speed = gear.getAttribute('data-speed');
            const gx = (e.clientX - window.innerWidth / 2) * speed;
            const gy = (e.clientY - window.innerHeight / 2) * speed;
            gear.style.transform = `translate(${gx}px, ${gy}px) rotate(${gx}deg)`;
        });
    });

    // Initialize Particles & Gears
    const particlesContainer = document.querySelector('.particles');
    if (particlesContainer) {
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particlesContainer.appendChild(particle);
        }

        for (let i = 0; i < 5; i++) {
            const gear = document.createElement('i');
            gear.className = 'fas fa-cog floating-gear';
            gear.setAttribute('data-speed', (Math.random() * 0.05 + 0.02).toFixed(2));
            gear.style.left = `${Math.random() * 100}%`;
            gear.style.top = `${Math.random() * 100}%`;
            gear.style.fontSize = `${Math.random() * 10 + 5}rem`;
            particlesContainer.appendChild(gear);
        }
    }

    // Horological Glossary Logic
    const glossaryPopup = document.getElementById('glossaryPopup');
    const glossaryTitle = document.getElementById('glossaryTitle');
    const glossaryText = document.getElementById('glossaryText');
    const glossaryData = {
        caliber: {
            title: "The Caliber",
            text: "The 'heart' of the timepiece. Refers to the internal mechanical movement, often hand-assembled with hundreds of microscopic parts."
        },
        lume: {
            title: "Super-LumiNova®",
            text: "A high-performance photo-luminescent pigment that provides non-radioactive, long-lasting glow after exposure to light."
        },
        titanium: {
            title: "Grade 5 Titanium",
            text: "An aerospace-grade alloy consisting of 90% titanium, 6% aluminum, and 4% vanadium. Famous for being as strong as steel but 45% lighter."
        }
    };

    document.querySelectorAll('.glossary-term').forEach(term => {
        term.addEventListener('mouseenter', (e) => {
            const data = glossaryData[term.getAttribute('data-term')];
            if (data) {
                glossaryTitle.innerText = data.title;
                glossaryText.innerText = data.text;

                const rect = term.getBoundingClientRect();
                glossaryPopup.style.left = `${rect.left}px`;
                glossaryPopup.style.top = `${rect.top - 150}px`;
                glossaryPopup.classList.add('active');
            }
        });

        term.addEventListener('mouseleave', () => {
            glossaryPopup.classList.remove('active');
        });
    });

    // Membership Card Hover Sound Simulation (Visual)
    const membershipCard = document.querySelector('.card-flip-container');
    if (membershipCard) {
        membershipCard.addEventListener('mouseenter', () => {
            if (cursorFollower) {
                cursorFollower.style.background = 'rgba(212, 175, 55, 0.4)';
                cursorFollower.style.boxShadow = '0 0 50px var(--accent-color)';
            }
        });
        membershipCard.addEventListener('mouseleave', () => {
            if (cursorFollower) {
                cursorFollower.style.background = 'transparent';
                cursorFollower.style.boxShadow = 'none';
            }
        });
    }

    // Global Boutique Time Logic
    function updateBoutiqueTimes() {
        document.querySelectorAll('.local-time').forEach(el => {
            const timezone = el.getAttribute('data-timezone');
            if (timezone) {
                const now = new Date();
                const timeString = now.toLocaleTimeString('en-US', {
                    timeZone: timezone,
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                el.innerText = timeString;
            }
        });
    }
    setInterval(updateBoutiqueTimes, 1000);
    updateBoutiqueTimes();

    // Intersection Observer
    const revealCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };
    const revealObserver = new IntersectionObserver(revealCallback, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});
