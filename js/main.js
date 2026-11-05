/**
 * YES2HEALTH BEAUTY - Main JavaScript
 * Premium Quantum Energy Landing Page
 */

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // PWA SERVICE WORKER REGISTRATION
    // ============================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('service-worker.js')
                .then(function(registration) {
                    console.log('ServiceWorker registered:', registration.scope);
                })
                .catch(function(error) {
                    console.log('ServiceWorker registration failed:', error);
                });
        });
    }

    // ============================================
    // PRELOADER
    // ============================================
    const preloader = document.querySelector('.preloader');

    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hidden');
        }, 800);
    });

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.getElementById('header');

    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll();

    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        // Create menu backdrop
        const menuBackdrop = document.createElement('div');
        menuBackdrop.className = 'nav-menu-backdrop';
        menuBackdrop.setAttribute('aria-hidden', 'true');
        document.body.appendChild(menuBackdrop);

        function openMenu() {
            menuToggle.classList.add('active');
            navMenu.classList.add('active');
            menuBackdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            menuBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        }

        menuToggle.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        menuBackdrop.addEventListener('click', closeMenu);

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(function(link) {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && !menuBackdrop.contains(e.target)) {
                closeMenu();
            }
        });
    }

    // ============================================
    // SMOOTH SCROLLING
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // ACTIVE NAVIGATION LINK
    // ============================================
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(function(section) {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector('.nav-menu a[href="#' + sectionId + '"]');

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink();

    // ============================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ============================================
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animationObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(function(element) {
        animationObserver.observe(element);
    });

    // ============================================
    // CINZAL HERO SLIDER
    // ============================================
    const cinzalTrack = document.getElementById('cinzal-track');
    const cinzalPrev = document.getElementById('cinzal-prev');
    const cinzalNext = document.getElementById('cinzal-next');
    const cinzalDots = document.querySelectorAll('#cinzal-dots .cinzal-dot');

    if (cinzalTrack) {
        let currentSlide = 0;
        const slides = cinzalTrack.querySelectorAll('.cinzal-slide');
        const totalSlides = slides.length;
        let slideInterval;

        function updateSlide(index) {
            currentSlide = (index + totalSlides) % totalSlides;
            cinzalTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
            cinzalDots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentSlide);
            });
        }

        function nextSlide() {
            updateSlide(currentSlide + 1);
        }

        function prevSlide() {
            updateSlide(currentSlide - 1);
        }

        function startAutoplay() {
            stopAutoplay();
            slideInterval = setInterval(nextSlide, 5500);
        }

        function stopAutoplay() {
            if (slideInterval) clearInterval(slideInterval);
        }

        if (cinzalNext) {
            cinzalNext.addEventListener('click', function() {
                nextSlide();
                startAutoplay();
            });
        }

        if (cinzalPrev) {
            cinzalPrev.addEventListener('click', function() {
                prevSlide();
                startAutoplay();
            });
        }

        cinzalDots.forEach((dot) => {
            dot.addEventListener('click', function() {
                const targetIdx = parseInt(this.getAttribute('data-slide'), 10);
                updateSlide(targetIdx);
                startAutoplay();
            });
        });

        // Pause on hover
        const sliderWrapper = cinzalTrack.closest('.cinzal-hero-slider');
        if (sliderWrapper) {
            sliderWrapper.addEventListener('mouseenter', stopAutoplay);
            sliderWrapper.addEventListener('mouseleave', startAutoplay);
        }

        // Mobile swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        cinzalTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });

        cinzalTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) {
                nextSlide();
            } else if (touchEndX - touchStartX > 50) {
                prevSlide();
            }
            startAutoplay();
        }, { passive: true });

        startAutoplay();
    }

    // ============================================
    // BENEFITS SLIDER (Desktop Only)
    // ============================================
    const benefitsTrack = document.getElementById('benefits-track');
    const benefitPrev = document.getElementById('benefit-prev');
    const benefitNext = document.getElementById('benefit-next');
    const benefitDots = document.querySelectorAll('#benefit-dots .slider-dot');

    if (benefitsTrack) {
        let benefitIndex = 0;
        const benefitCards = benefitsTrack.querySelectorAll('.benefit-card');
        const totalBenefits = benefitCards.length;

        function isMobileView() {
            return window.innerWidth <= 768;
        }

        function updateBenefitsSlider() {
            if (!isMobileView()) {
                benefitsTrack.style.transform = `translateX(-${benefitIndex * 100}%)`;
            } else {
                benefitsTrack.style.transform = 'none';
            }

            // Update dots
            benefitDots.forEach(function(dot, index) {
                dot.classList.toggle('active', index === benefitIndex);
            });
        }

        function nextBenefit() {
            if (!isMobileView()) {
                benefitIndex = (benefitIndex + 1) % totalBenefits;
                updateBenefitsSlider();
            }
        }

        function prevBenefit() {
            if (!isMobileView()) {
                benefitIndex = (benefitIndex - 1 + totalBenefits) % totalBenefits;
                updateBenefitsSlider();
            }
        }

        if (benefitNext) {
            benefitNext.addEventListener('click', nextBenefit);
        }

        if (benefitPrev) {
            benefitPrev.addEventListener('click', prevBenefit);
        }

        // Dot navigation
        benefitDots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                if (!isMobileView()) {
                    benefitIndex = parseInt(this.dataset.index);
                    updateBenefitsSlider();
                }
            });
        });

        // Auto-slide benefits (desktop only)
        let benefitAutoSlide = setInterval(function() {
            if (!isMobileView()) {
                nextBenefit();
            }
        }, 4000);

        // Pause on hover
        benefitsTrack.addEventListener('mouseenter', function() {
            clearInterval(benefitAutoSlide);
        });

        benefitsTrack.addEventListener('mouseleave', function() {
            benefitAutoSlide = setInterval(function() {
                if (!isMobileView()) {
                    nextBenefit();
                }
            }, 4000);
        });

        // Handle window resize
        window.addEventListener('resize', updateBenefitsSlider);
    }

    // ============================================
    // FORM SUBMISSION (Handled by Formspree)
    // ============================================
    // Form submission is now handled by Formspree Ajax library
    // The form will submit to your email automatically

    // ============================================
    // NOTIFICATION SYSTEM
    // ============================================
    function showNotification(message, type) {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 18px 30px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #1a6b3c 0%, #0d4a29 100%)' : '#e74c3c'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 10000;
            animation: slideIn 0.4s ease;
            font-weight: 500;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        `;

        closeBtn.addEventListener('click', function() {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(function() {
                notification.remove();
            }, 300);
        });

        setTimeout(function() {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(function() {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }

    // ============================================
    // PARALLAX EFFECT FOR FLOATING SHAPES
    // ============================================
    const shapes = document.querySelectorAll('.shape');

    window.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        shapes.forEach(function(shape, index) {
            const speed = (index + 1) * 15;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;

            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // ============================================
    // IMAGE GALLERY LIGHTBOX
    // ============================================
    const productImages = document.querySelectorAll('.product-image img, .spray-images img, .about-image img');

    productImages.forEach(function(img) {
        img.style.cursor = 'zoom-in';

        img.addEventListener('click', function() {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                cursor: zoom-out;
                animation: fadeIn 0.3s ease;
            `;

            const lightboxImg = document.createElement('img');
            lightboxImg.src = this.src;
            lightboxImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                border-radius: 12px;
                box-shadow: 0 20px 80px rgba(0, 0, 0, 0.5);
            `;

            const closeBtn = document.createElement('div');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.cssText = `
                position: absolute;
                top: 20px;
                right: 30px;
                color: #fff;
                font-size: 40px;
                font-weight: bold;
                cursor: pointer;
                z-index: 10002;
                transition: color 0.3s;
            `;
            closeBtn.onmouseover = function() { this.style.color = 'var(--primary-gold)'; };
            closeBtn.onmouseout = function() { this.style.color = '#fff'; };
            
            lightbox.appendChild(closeBtn);
            lightbox.appendChild(lightboxImg);
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';

            lightbox.addEventListener('click', function() {
                lightbox.style.animation = 'fadeOut 0.3s ease';
                setTimeout(function() {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }, 300);
            });

            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape') {
                    lightbox.click();
                    document.removeEventListener('keydown', escHandler);
                }
            });
        });
    });

    // Add fade animation styles
    const fadeStyles = document.createElement('style');
    fadeStyles.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(fadeStyles);

    // ============================================
    // BACK TO TOP BUTTON
    // ============================================
    const backToTop = document.createElement('a');
    backToTop.href = '#home';
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/>
        </svg>
    `;
    backToTop.style.cssText = `
        position: fixed;
        bottom: 110px;
        right: 35px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #d30000 0%, #EF0000 50%, #b80000 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 8px 30px rgba(239, 0, 0, 0.4);
        z-index: 998;
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s ease;
    `;

    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });

    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    backToTop.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });

    backToTop.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });

    // ============================================
    // PRODUCT CARDS STAGGER ANIMATION
    // ============================================
    const productCards = document.querySelectorAll('.product-card');

    const productObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry, index) {
            if (entry.isIntersecting) {
                setTimeout(function() {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                productObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    productCards.forEach(function(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        productObserver.observe(card);
    });

    // ============================================
    // SMOOTH REVEAL FOR BENEFITS
    // ============================================
    const benefitCards = document.querySelectorAll('.benefit-card');

    const benefitObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry, index) {
            if (entry.isIntersecting) {
                setTimeout(function() {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                benefitObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    benefitCards.forEach(function(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'all 0.7s ease';
        benefitObserver.observe(card);
    });

    // ============================================
    // ENERGY PARTICLES ANIMATION
    // ============================================
    const particlesContainer = document.getElementById('particles-container');

    if (particlesContainer) {
        function createParticle() {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Random particle type - mostly gold for subtle effect
            const types = ['particle-gold', 'particle-gold', 'particle-white'];
            particle.classList.add(types[Math.floor(Math.random() * types.length)]);

            // Smaller size for subtle effect
            const size = Math.random() * 4 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';

            // Random position
            particle.style.left = Math.random() * 100 + '%';

            // Slower animation for subtlety
            const duration = Math.random() * 15 + 12;
            particle.style.animationDuration = duration + 's';

            // Random delay
            particle.style.animationDelay = Math.random() * 8 + 's';

            particlesContainer.appendChild(particle);

            // Remove particle after animation
            setTimeout(function() {
                particle.remove();
            }, (duration + 8) * 1000);
        }

        // Create fewer initial particles
        for (let i = 0; i < 20; i++) {
            setTimeout(createParticle, i * 300);
        }

        // Create particles less frequently for subtlety
        setInterval(createParticle, 800);
    }

    (function () {
        const modal    = document.getElementById('video-modal');
        const video    = document.getElementById('product-video');
        const openBtn  = document.getElementById('open-video-modal');
        const closeBtn = document.getElementById('close-video-modal');
        const backdrop = document.getElementById('video-modal-backdrop');

        function openModal() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            video.play();
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            video.pause();
            video.currentTime = 0;
        }

        openBtn.addEventListener('click', openModal);
        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });
    })();

    // ============================================
    // INTERACTIVE ORB EFFECT
    // ============================================
    const orbs = document.querySelectorAll('.orb');

    if (orbs.length > 0) {
        document.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            orbs.forEach(function(orb, index) {
                const speed = (index + 1) * 10;
                const x = (mouseX - 0.5) * speed;
                const y = (mouseY - 0.5) * speed;

                orb.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // ============================================
    // PURCHASE MODAL LOGIC
    // ============================================
    const purchaseModal = document.getElementById('purchase-modal');
    const purchasePriceInput = document.getElementById('purchase-price');
    const closePurchaseModal = document.getElementById('close-purchase-modal');
    const purchaseBackdrop = document.getElementById('purchase-modal-backdrop');
    const orderBtns = document.querySelectorAll('.order-btn');
    const shopNowBtn = document.getElementById('shop-now-cta');
    const totalPriceDisplay = document.getElementById('total-price-display');
    const calcTotalPrice = document.getElementById('calc-total-price');
    const productCheckboxes = document.querySelectorAll('.product-checkbox');
    const productQuantities = document.querySelectorAll('.product-qty');
    
    function formatNaira(amount) {
        return '\u20A6' + amount.toLocaleString('en-NG');
    }

    function updateTotalPrice() {
        let total = 0;
        
        productCheckboxes.forEach((cb, index) => {
            const qtyInput = productQuantities[index];
            if (cb.checked) {
                const price = parseInt(cb.getAttribute('data-price'), 10) || 0;
                const qty = parseInt(qtyInput.value, 10) || 1;
                total += price * qty;
            }
        });
        
        if (total > 0) {
            totalPriceDisplay.style.display = 'block';
            calcTotalPrice.textContent = formatNaira(total);
            purchasePriceInput.value = formatNaira(total);
        } else {
            totalPriceDisplay.style.display = 'none';
            purchasePriceInput.value = '';
        }
        if (typeof updateCartCountBadge === 'function') {
            updateCartCountBadge();
        }
    }

    productCheckboxes.forEach((cb, index) => {
        cb.addEventListener('change', function() {
            const qtyInput = productQuantities[index];
            if (this.checked) {
                qtyInput.disabled = false;
                qtyInput.style.display = 'block';
            } else {
                qtyInput.disabled = true;
                qtyInput.style.display = 'none';
            }
            updateTotalPrice();
        });
    });

    productQuantities.forEach(qtyInput => {
        qtyInput.addEventListener('input', updateTotalPrice);
        qtyInput.addEventListener('change', updateTotalPrice);
    });

    function openPurchaseModal(productValue) {
        if (!purchaseModal) return;
        
        // Reset form messages
        const formEl = document.getElementById('purchase-form');
        const successMsgEl = document.querySelector('[data-fs-success-purchase]');
        if(formEl) {
            formEl.reset();
            formEl.style.display = 'block';
        }
        if(successMsgEl) successMsgEl.innerHTML = '';
        
        // Pre-select product if provided
        productCheckboxes.forEach((cb, index) => {
            const qtyInput = productQuantities[index];
            if (productValue) {
                cb.checked = (cb.value === productValue);
            } else {
                cb.checked = false;
            }
            
            // Trigger visual update for quantity inputs
            if (cb.checked) {
                qtyInput.disabled = false;
                qtyInput.style.display = 'block';
            } else {
                qtyInput.disabled = true;
                qtyInput.style.display = 'none';
            }
        });
        
        updateTotalPrice();
        
        purchaseModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Always start with the dropdown closed
        const productGroup = document.getElementById('purchase-product-group');
        const productDropdownToggle = document.getElementById('product-dropdown-toggle');
        if (productGroup && productDropdownToggle) {
            productGroup.classList.add('collapsed');
            const icon = productDropdownToggle.querySelector('.dropdown-icon');
            productGroup.style.maxHeight = '0';
            productGroup.style.opacity = '0';
            productGroup.style.padding = '0 10px';
            if (icon) {
                icon.style.transform = 'rotate(0deg)';
            }
        }
    }

    const productDropdownToggle = document.getElementById('product-dropdown-toggle');
    const productGroup = document.getElementById('purchase-product-group');
    if (productDropdownToggle && productGroup) {
        productDropdownToggle.addEventListener('click', function() {
            productGroup.classList.toggle('collapsed');
            const icon = productDropdownToggle.querySelector('.dropdown-icon');
            if (productGroup.classList.contains('collapsed')) {
                productGroup.style.maxHeight = '0';
                productGroup.style.opacity = '0';
                productGroup.style.padding = '0 10px';
                if (icon) icon.style.transform = 'rotate(0deg)';
            } else {
                productGroup.style.maxHeight = '350px';
                productGroup.style.opacity = '1';
                productGroup.style.padding = '10px';
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    }
    function closePurchaseModalFunc() {
        if (!purchaseModal) return;
        purchaseModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (orderBtns.length > 0) {
        orderBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const product = this.getAttribute('data-product');
                openPurchaseModal(product);
            });
        });
    }

    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openPurchaseModal(null);
        });
    }

    if (closePurchaseModal) {
        closePurchaseModal.addEventListener('click', closePurchaseModalFunc);
    }
    
    if (purchaseBackdrop) {
        purchaseBackdrop.addEventListener('click', closePurchaseModalFunc);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && purchaseModal && purchaseModal.classList.contains('active')) {
            closePurchaseModalFunc();
        }
    });

    // ============================================
    // HEADER CART LOGIC
    // ============================================
    const headerCartBtn = document.getElementById('header-cart-btn');
    const cartCountBadge = document.getElementById('cart-count-badge');

    function getCartCount() {
        let count = 0;
        productCheckboxes.forEach((cb, index) => {
            if (cb.checked) {
                const qtyInput = productQuantities[index];
                const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
                count += qty;
            }
        });
        return count;
    }

    function updateCartCountBadge() {
        if (!cartCountBadge) return;
        const count = getCartCount();
        cartCountBadge.textContent = count;
        if (count > 0) {
            cartCountBadge.style.transform = 'scale(1.2)';
            setTimeout(() => { cartCountBadge.style.transform = 'scale(1)'; }, 200);
        }
    }

    if (headerCartBtn) {
        headerCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const count = getCartCount();
            if (count === 0) {
                // Cart is empty -> smoothly navigate directly to products list
                const productsSection = document.getElementById('products');
                if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.location.hash = '#products';
                }
            } else {
                // Cart has items -> open purchase modal to view & complete checkout
                openPurchaseModal(null);
            }
        });
    }

    // Initialize badge count
    updateCartCountBadge();

    console.log('YES2HEALTH BEAUTY website initialized successfully!');
});


// ============================================
// PWA & INSTALL APP LOGIC
// ============================================
let deferredPrompt;
const installBtn = document.getElementById('install-app-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    if (installBtn) {
        installBtn.style.display = 'inline-flex';
    }
});

if (installBtn) {
    installBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        // Hide the app provided install promotion
        installBtn.style.display = 'none';
        if (deferredPrompt) {
            // Show the install prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            // We've used the prompt, and can't use it again, throw it away
            deferredPrompt = null;
        }
    });
}

window.addEventListener('appinstalled', () => {
    // Hide the app-provided install promotion
    if (installBtn) {
        installBtn.style.display = 'none';
    }
    // Clear the deferredPrompt so it can be garbage collected
    deferredPrompt = null;
    console.log('PWA was installed');
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

    // ============================================
    // PRODUCT INFO TOOLTIP: auto-show with persistent ripple on scroll
    // ============================================
    const productCards = document.querySelectorAll('.y2h-products .product-card');

    if (productCards.length > 0 && 'IntersectionObserver' in window) {
        const shownTooltips = new Set();

        const tooltipObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const trigger = card.querySelector('.product-info-trigger');
                    if (trigger && !shownTooltips.has(trigger)) {
                        shownTooltips.add(trigger);
                        setTimeout(function() {
                            trigger.classList.add('show-tooltip');
                        }, 400);
                    }
                }
            });
        }, { threshold: 0.6, rootMargin: '0px 0px -10% 0px' });

        productCards.forEach(function(card) {
            tooltipObserver.observe(card);
        });

        // Remove persistent tooltip ripple on click
        document.querySelectorAll('.product-info-trigger').forEach(function(trigger) {
            trigger.addEventListener('click', function() {
                trigger.classList.remove('show-tooltip');
            });
        });
    }

    // ============================================
    // PRODUCT INFO MODAL
    // ============================================
document.addEventListener('DOMContentLoaded', function() {
    const infoTriggers = document.querySelectorAll('.product-info-trigger');
    const infoModal = document.getElementById('product-info-modal');
    const infoBackdrop = document.getElementById('product-info-modal-backdrop');
    const infoClose = document.getElementById('close-product-info-modal');
    const infoImage = document.getElementById('product-info-image');
    const infoCategory = document.getElementById('product-info-category');
    const infoTitle = document.getElementById('product-info-title');
    const infoDescription = document.getElementById('product-info-description');
    const infoPrice = document.getElementById('product-info-price');
    const infoOrder = document.getElementById('product-info-order');

    if (!infoModal || infoTriggers.length === 0) return;

    function openInfoModal(productName) {
        const card = document.querySelector(`.product-card[data-name="${productName}"]`);
        if (!card) return;

        const image = card.querySelector('.product-image img');
        const category = card.querySelector('.product-category');
        const title = card.querySelector('h3');
        const price = card.querySelector('.product-price');
        const description = card.dataset.description || '';

        if (image) {
            infoImage.src = image.src;
            infoImage.alt = image.alt;
        }
        infoCategory.textContent = category ? category.textContent : '';
        infoTitle.textContent = title ? title.childNodes[title.childNodes.length - 1].textContent.trim() : productName;
        infoDescription.textContent = description;
        infoPrice.textContent = price ? price.textContent : '';
        infoOrder.dataset.product = productName;
        infoOrder.dataset.price = price ? price.textContent : '';

        infoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeInfoModal() {
        infoModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    infoTriggers.forEach(function(trigger) {
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            openInfoModal(this.dataset.product);
        });
    });

    if (infoBackdrop) infoBackdrop.addEventListener('click', closeInfoModal);
    if (infoClose) infoClose.addEventListener('click', closeInfoModal);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && infoModal.classList.contains('active')) {
            closeInfoModal();
        }
    });

    // Order button inside modal triggers purchase modal
    if (infoOrder) {
        infoOrder.addEventListener('click', function() {
            closeInfoModal();
            // Trigger the existing purchase modal logic
            setTimeout(function() {
                if (typeof openPurchaseModal === 'function') {
                    openPurchaseModal(infoOrder.dataset.product);
                }
            }, 300);
        });
    }
});

// ============================================
// PRODUCT FILTERING & SORTING
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const filterForm = document.getElementById('product-filter-form');
    const searchInput = document.getElementById('filter-search');
    const categorySelect = document.getElementById('filter-category');
    const minInput = document.getElementById('filter-min');
    const maxInput = document.getElementById('filter-max');
    const sortSelect = document.getElementById('sort-products');
    const productsGrid = document.getElementById('products-grid');
    const productsCount = document.getElementById('products-count');
    const noResults = document.getElementById('products-no-results');
    const filterToggle = document.getElementById('filter-toggle');
    const productsFilter = document.querySelector('.products-filter');

    if (!filterForm || !productsGrid) return;

    // Mobile filter toggle
    if (filterToggle && productsFilter) {
        filterToggle.addEventListener('click', function() {
            const isExpanded = productsFilter.classList.toggle('expanded');
            filterToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        });
    }

    const products = Array.from(productsGrid.querySelectorAll('.product-card'));

    function parsePrice(priceStr) {
        return parseInt(priceStr, 10) || 0;
    }

    function formatPrice(price) {
        return '₦' + price.toLocaleString('en-NG');
    }

    function updateCount(visible) {
        const total = products.length;
        if (visible === 0) {
            productsCount.innerHTML = 'Showing <strong>0</strong> of <strong>' + total + ' products</strong>';
            noResults.style.display = 'block';
        } else {
            productsCount.innerHTML = 'Showing <strong>1–' + visible + '</strong> of <strong>' + total + ' products</strong>';
            noResults.style.display = 'none';
        }
    }

    function sortProducts() {
        const sortValue = sortSelect ? sortSelect.value : 'popular';
        let sorted = [...products];

        if (sortValue === 'price-asc') {
            sorted.sort((a, b) => parsePrice(a.dataset.price) - parsePrice(b.dataset.price));
        } else if (sortValue === 'price-desc') {
            sorted.sort((a, b) => parsePrice(b.dataset.price) - parsePrice(a.dataset.price));
        } else if (sortValue === 'newest') {
            sorted.sort((a, b) => (b.dataset.badge === 'New' ? 1 : 0) - (a.dataset.badge === 'New' ? 1 : 0));
        }

        sorted.forEach(product => productsGrid.appendChild(product));
    }

    function filterProducts(e) {
        if (e) e.preventDefault();

        const search = searchInput.value.toLowerCase().trim();
        const category = categorySelect.value.toLowerCase();
        const minPrice = parseInt(minInput.value, 10) || 0;
        const maxPrice = parseInt(maxInput.value, 10) || Infinity;

        let visibleCount = 0;

        products.forEach(product => {
            const name = (product.dataset.name || '').toLowerCase();
            const productCategory = (product.dataset.category || '').toLowerCase();
            const price = parsePrice(product.dataset.price);

            const matchesSearch = !search || name.includes(search);
            const matchesCategory = !category || productCategory === category;
            const matchesMin = price >= minPrice;
            const matchesMax = price <= maxPrice;

            if (matchesSearch && matchesCategory && matchesMin && matchesMax) {
                product.classList.remove('hidden');
                visibleCount++;
            } else {
                product.classList.add('hidden');
            }
        });

        sortProducts();
        updateCount(visibleCount);
    }

    filterForm.addEventListener('submit', filterProducts);
    filterForm.addEventListener('reset', function() {
        setTimeout(() => {
            filterProducts();
        }, 10);
    });

    searchInput.addEventListener('input', filterProducts);
    categorySelect.addEventListener('change', filterProducts);
    minInput.addEventListener('input', filterProducts);
    maxInput.addEventListener('input', filterProducts);
    if (sortSelect) sortSelect.addEventListener('change', filterProducts);

    // Initial state
    updateCount(products.length);

    // ============================================
    // VIDEO PROMO POPUP: show twice per session
    // ============================================
    const videoPopup = document.getElementById('video-popup');
    const videoPopupBackdrop = document.getElementById('video-popup-backdrop');
    const videoPopupClose = document.getElementById('video-popup-close');
    const popupVideo = document.getElementById('popup-video');
    const videoUnmuteBtn = document.getElementById('video-popup-unmute');

    if (videoPopup && popupVideo) {
        const SESSION_KEY = 'yes2health_video_popup';

        function getPopupState() {
            try {
                return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || { shown: 0, closed: false };
            } catch (e) {
                return { shown: 0, closed: false };
            }
        }

        function setPopupState(state) {
            try {
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
            } catch (e) {
                // ignore
            }
        }

        function openVideoPopup() {
            videoPopup.classList.add('active');
            document.body.style.overflow = 'hidden';
            popupVideo.currentTime = 0;

            hideUnmuteButton();

            // Try unmuted autoplay first
            popupVideo.muted = false;
            const playPromise = popupVideo.play();

            if (playPromise !== undefined) {
                playPromise.then(function() {
                    // Unmuted autoplay succeeded
                }).catch(function() {
                    // Fallback: mute and play, then show unmute button
                    popupVideo.muted = true;
                    popupVideo.play().catch(function() {
                        // Even muted autoplay blocked; user can tap video
                    });
                    showUnmuteButton();
                });
            }
        }

        function showUnmuteButton() {
            if (videoUnmuteBtn) {
                videoUnmuteBtn.classList.add('visible');
            }
        }

        function hideUnmuteButton() {
            if (videoUnmuteBtn) {
                videoUnmuteBtn.classList.remove('visible');
            }
        }

        if (videoUnmuteBtn) {
            videoUnmuteBtn.addEventListener('click', function() {
                popupVideo.muted = false;
                popupVideo.play().catch(function() {});
                hideUnmuteButton();
            });
        }

        function closeVideoPopup() {
            videoPopup.classList.remove('active');
            document.body.style.overflow = '';
            popupVideo.pause();
            hideUnmuteButton();
            const state = getPopupState();
            state.closed = true;
            setPopupState(state);
        }

        function maybeShowVideoPopup() {
            const state = getPopupState();
            if (state.closed || state.shown >= 2) return;

            state.shown += 1;
            setPopupState(state);
            openVideoPopup();
        }

        videoPopupClose.addEventListener('click', closeVideoPopup);
        videoPopupBackdrop.addEventListener('click', closeVideoPopup);

        // First show after 6 seconds
        setTimeout(maybeShowVideoPopup, 6000);

        // Second show after 60 seconds
        setTimeout(maybeShowVideoPopup, 60000);
    }

    // ============================================
    // FLOATING APP BUG: reveal + sound after 4s
    // ============================================
    const appBug = document.getElementById('app-bug-float');

    function playBugChirp() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (err) {
            // Audio play failed (often due to autoplay policy); silently ignore
        }
    }

    if (appBug) {
        setTimeout(function() {
            appBug.classList.add('visible');
            playBugChirp();
        }, 4000);
    }

    // ============================================
    // PWA APP INSTALL PROMPT (from floating bug)
    // ============================================
    let deferredInstallPrompt = null;

    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        deferredInstallPrompt = e;
    });

    window.addEventListener('appinstalled', function() {
        deferredInstallPrompt = null;
        console.log('Yes2Health app was installed');
    });

    if (appBug) {
        appBug.addEventListener('click', async function(e) {
            if (!deferredInstallPrompt) {
                // No install prompt available (already installed, file://, not installable, etc.)
                e.preventDefault();
                if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
                    alert('You are already using the Yes2Health app. Enjoy!');
                } else {
                    alert('To install the app:\n\nAndroid (Chrome): tap the menu (⋮) then "Add to Home screen"\niPhone (Safari): tap the share icon then "Add to Home Screen"\nWindows (Chrome/Edge): click the install icon in the address bar.\n\nNote: Install prompts only appear when the site is served over HTTPS or localhost, not from a file folder.');
                }
                return;
            }

            e.preventDefault();
            deferredInstallPrompt.prompt();
            const { outcome } = await deferredInstallPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredInstallPrompt = null;
        });
    }
});
