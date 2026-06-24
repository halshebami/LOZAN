/* ==========================================================================
   Lozan Flowers | ورود لوزان
   JS Application Logic - Cart, Custom Builder, Scroll Triggers, WhatsApp API
   ========================================================================== */

// ---------------------------------------------------------
// 1. Initial State & Setup
// ---------------------------------------------------------
let cart = [];

// Base prices and option surcharges for the Custom Builder
const builderBasePrice = 150;
const optionsSurcharges = {
    flowerType: {
        "جوري": 0,
        "توليب": 15,
        "جربيرا": 10
    },
    fabricType: {
        "ساتان لامع": 0,
        "مخمل فاخر": 30,
        "جوخ ناعم": 10
    },
    flowerColor: {
        "أحمر كلاسيكي": 0,
        "وردي ناعم": 0,
        "كريمي دافئ": 0,
        "أبيض ناصع": 0
    },
    wrappingType: {
        "خيش ريفي طبيعي": 0,
        "ورق أسود فاخر": 15,
        "ورق أبيض كلاسيكي": 10
    }
};

// Colors mapping to hex for visual builder preview
const colorHexMap = {
    "أحمر كلاسيكي": "#8A0012",
    "وردي ناعم": "#FFB7C5",
    "كريمي دافئ": "#FAF0E6",
    "أبيض ناصع": "#F9F9F9"
};

// ---------------------------------------------------------
// 2. DOMContentLoaded Initialization
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // Load Cart from localStorage
    const savedCart = localStorage.getItem("lozan_cart");
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            cart = [];
        }
    }
    updateCartUI();

    // Setup Event Listeners
    setupHeaderScroll();
    setupMobileMenu();
    setupProductFilters();
    setupCartToggle();
    updateBuilderPreview(); // Initial draw of custom builder preview
});

// ---------------------------------------------------------
// 3. Header & Navigation Behavior
// ---------------------------------------------------------
function setupHeaderScroll() {
    const header = document.getElementById("header");
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-menu a");

    window.addEventListener("scroll", () => {
        // Sticky scrolled class
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Active link highlighting based on scroll position
        let currentSectionId = "";
        const scrollPosition = window.scrollY + 120; // Offset for sticky header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${currentSectionId}`) {
                    link.classList.add("active");
                }
            });
        }
    });
}

function setupMobileMenu() {
    const mobileToggle = document.getElementById("mobileMenuToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-menu a");

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            // Change icon between bars and xmark
            const icon = mobileToggle.querySelector("i");
            if (navMenu.classList.contains("active")) {
                icon.className = "fa-solid fa-xmark";
            } else {
                icon.className = "fa-solid fa-bars";
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                const icon = mobileToggle.querySelector("i");
                icon.className = "fa-solid fa-bars";
            });
        });
    }
}

// ---------------------------------------------------------
// 4. Product Catalog Filtering
// ---------------------------------------------------------
function setupProductFilters() {
    const tabs = document.querySelectorAll(".filter-tab");
    const cards = document.querySelectorAll(".product-card");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Toggle active state
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const filterValue = tab.getAttribute("data-filter");

            cards.forEach(card => {
                const category = card.getAttribute("data-category");

                // Add fade-out transition, then display change, then fade-in
                card.style.opacity = "0";
                card.style.transform = "scale(0.95)";

                setTimeout(() => {
                    if (filterValue === "all" || category === filterValue) {
                        card.style.display = "flex";
                        setTimeout(() => {
                            card.style.opacity = "1";
                            card.style.transform = "scale(1)";
                        }, 50);
                    } else {
                        card.style.display = "none";
                    }
                }, 300);
            });
        });
    });
}

// ---------------------------------------------------------
// 5. Interactive Custom Bouquet Builder Logic
// ---------------------------------------------------------
let currentBuilderStep = 1;

function nextStep(stepNum) {
    // Hide all steps, show target step
    document.querySelectorAll(".builder-step-content").forEach(el => el.classList.remove("active"));
    document.getElementById(`step${stepNum}`).classList.add("active");

    // Update steps indicator
    document.querySelectorAll(".step-indicator").forEach(el => {
        const step = parseInt(el.getAttribute("data-step"));
        if (step <= stepNum) {
            el.classList.add("active");
        } else {
            el.classList.remove("active");
        }
    });

    currentBuilderStep = stepNum;
}

function prevStep(stepNum) {
    nextStep(stepNum);
}

// Dynamically draws the visual preview in CSS/SVG
function updateBuilderPreview() {
    // Get currently selected options
    const flowerType = document.querySelector('input[name="flowerType"]:checked').value;
    const fabricType = document.querySelector('input[name="fabricType"]:checked').value;
    const flowerColor = document.querySelector('input[name="flowerColor"]:checked').value;
    const wrappingType = document.querySelector('input[name="wrappingType"]:checked').value;

    // Display selected text in details list
    document.getElementById("valFlower").textContent = flowerType;
    document.getElementById("valFabric").textContent = fabricType;
    document.getElementById("valColor").textContent = flowerColor;
    document.getElementById("valWrapping").textContent = wrappingType;

    // Calculate Price
    const p1 = optionsSurcharges.flowerType[flowerType];
    const p2 = optionsSurcharges.fabricType[fabricType];
    const p3 = optionsSurcharges.flowerColor[flowerColor];
    const p4 = optionsSurcharges.wrappingType[wrappingType];
    const totalPrice = builderBasePrice + p1 + p2 + p3 + p4;

    document.getElementById("builderPrice").textContent = `${totalPrice} ر.س`;

    // Render visual graphics representing choices
    const flowerWrap = document.getElementById("previewFlowerWrap");
    const wrappingWrap = document.getElementById("previewWrappingWrap");
    const hexColor = colorHexMap[flowerColor] || "#8A0012";

    // Set wrapping styling classes
    wrappingWrap.className = "preview-wrapping";
    if (wrappingType === "خيش ريفي طبيعي") {
        wrappingWrap.classList.add("wrapping-burlap");
    } else if (wrappingType === "ورق أسود فاخر") {
        wrappingWrap.classList.add("wrapping-black");
    } else if (wrappingType === "ورق أبيض كلاسيكي") {
        wrappingWrap.classList.add("wrapping-white");
    }

    // Set Flower Graphic inside the wrapper based on chosen Flower Type
    let flowerSVG = "";

    // Draw 3 flowers with overlapping layout to look like a small bouquet
    if (flowerType === "جوري") {
        // Redraw Rose shapes using SVGs
        flowerSVG = `
            <svg viewBox="0 0 100 100" width="100%" height="100%" style="overflow: visible;">
                <!-- Left Rose -->
                <g transform="translate(-15, -10) scale(0.85)">
                    <circle cx="50" cy="50" r="28" fill="${hexColor}" opacity="0.9" />
                    <path d="M50 25 C45 35, 35 45, 50 65 C65 45, 55 35, 50 25 Z" fill="#6B000C" opacity="0.6" />
                    <circle cx="50" cy="50" r="16" fill="${hexColor}" />
                    <circle cx="50" cy="50" r="8" fill="#4A0006" />
                </g>
                <!-- Right Rose -->
                <g transform="translate(25, -5) scale(0.85)">
                    <circle cx="50" cy="50" r="28" fill="${hexColor}" opacity="0.9" />
                    <path d="M50 25 C45 35, 35 45, 50 65 C65 45, 55 35, 50 25 Z" fill="#6B000C" opacity="0.6" />
                    <circle cx="50" cy="50" r="16" fill="${hexColor}" />
                    <circle cx="50" cy="50" r="8" fill="#4A0006" />
                </g>
                <!-- Center Rose -->
                <g transform="translate(5, -25) scale(1)">
                    <circle cx="50" cy="50" r="30" fill="${hexColor}" />
                    <path d="M50 22 C43 32, 32 42, 50 68 C68 42, 57 32, 50 22 Z" fill="#6B000C" opacity="0.4" />
                    <circle cx="50" cy="50" r="18" fill="${hexColor}" />
                    <circle cx="50" cy="50" r="10" fill="#4A0006" />
                </g>
                <!-- Green Stems & Leaves -->
                <path d="M35 60 Q40 85 45 100" stroke="#3A5F0B" stroke-width="4" fill="none" />
                <path d="M65 60 Q60 85 55 100" stroke="#3A5F0B" stroke-width="4" fill="none" />
                <path d="M50 65 Q50 85 50 100" stroke="#3A5F0B" stroke-width="4.5" fill="none" />
                <path d="M30 65 Q15 60 25 50 Q30 55 30 65" fill="#3A5F0B" />
                <path d="M70 65 Q85 60 75 50 Q70 55 70 65" fill="#3A5F0B" />
            </svg>
        `;
    } else if (flowerType === "توليب") {
        // Tulip petal shape
        flowerSVG = `
            <svg viewBox="0 0 100 100" width="100%" height="100%" style="overflow: visible;">
                <!-- Left Tulip -->
                <g transform="translate(-15, -15) scale(0.85)">
                    <path d="M50 20 C30 35, 30 75, 50 80 C70 75, 70 35, 50 20 Z" fill="${hexColor}" />
                    <path d="M50 20 C40 35, 40 70, 50 80 C60 70, 60 35, 50 20 Z" fill="#4A0006" opacity="0.3" />
                    <path d="M50 20 C45 35, 45 70, 50 80" stroke="#fff" stroke-width="1" fill="none" opacity="0.2" />
                </g>
                <!-- Right Tulip -->
                <g transform="translate(25, -10) scale(0.85)">
                    <path d="M50 20 C30 35, 30 75, 50 80 C70 75, 70 35, 50 20 Z" fill="${hexColor}" />
                    <path d="M50 20 C40 35, 40 70, 50 80 C60 70, 60 35, 50 20 Z" fill="#4A0006" opacity="0.3" />
                    <path d="M50 20 C45 35, 45 70, 50 80" stroke="#fff" stroke-width="1" fill="none" opacity="0.2" />
                </g>
                <!-- Center Tulip -->
                <g transform="translate(5, -30) scale(1)">
                    <path d="M50 15 C28 30, 28 75, 50 80 C72 75, 72 30, 50 15 Z" fill="${hexColor}" />
                    <path d="M50 15 C38 30, 38 70, 50 80 C62 70, 62 30, 50 15 Z" fill="#4A0006" opacity="0.3" />
                    <path d="M50 15 C45 30, 45 70, 50 80" stroke="#fff" stroke-width="1.2" fill="none" opacity="0.25" />
                </g>
                <!-- Green Stems & Leaves -->
                <path d="M35 65 Q40 85 45 100" stroke="#2E5007" stroke-width="4.5" fill="none" />
                <path d="M65 65 Q60 85 55 100" stroke="#2E5007" stroke-width="4.5" fill="none" />
                <path d="M50 70 Q50 85 50 100" stroke="#2E5007" stroke-width="5" fill="none" />
                <!-- Tulip Leaf -->
                <path d="M25 75 Q15 50 25 35 Q30 50 32 75 Z" fill="#2E5007" />
                <path d="M75 75 Q85 50 75 35 Q70 50 68 75 Z" fill="#2E5007" />
            </svg>
        `;
    } else {
        // Gerbera / Daisies style
        flowerSVG = `
            <svg viewBox="0 0 100 100" width="100%" height="100%" style="overflow: visible;">
                <!-- Left Gerbera -->
                <g transform="translate(-15, -10) scale(0.85)">
                    <circle cx="50" cy="50" r="10" fill="#D4AF37" z-index="6" />
                    <!-- Petals -->
                    <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="${hexColor}" stroke-width="8" stroke-linecap="round" />
                    <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="${hexColor}" stroke-width="4" stroke-linecap="round" transform="rotate(22.5 50 50)" />
                    <circle cx="50" cy="50" r="10" fill="#8B7355" />
                    <circle cx="50" cy="50" r="7" fill="#E6C229" />
                </g>
                <!-- Right Gerbera -->
                <g transform="translate(25, -5) scale(0.85)">
                    <circle cx="50" cy="50" r="10" fill="#D4AF37" />
                    <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="${hexColor}" stroke-width="8" stroke-linecap="round" />
                    <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="${hexColor}" stroke-width="4" stroke-linecap="round" transform="rotate(22.5 50 50)" />
                    <circle cx="50" cy="50" r="10" fill="#8B7355" />
                    <circle cx="50" cy="50" r="7" fill="#E6C229" />
                </g>
                <!-- Center Gerbera -->
                <g transform="translate(5, -25) scale(1)">
                    <circle cx="50" cy="50" r="11" fill="#D4AF37" />
                    <path d="M50 8 L50 92 M8 50 L92 50 M20 20 L80 80 M20 80 L80 20" stroke="${hexColor}" stroke-width="9" stroke-linecap="round" />
                    <path d="M50 8 L50 92 M8 50 L92 50 M20 20 L80 80 M20 80 L80 20" stroke="${hexColor}" stroke-width="5" stroke-linecap="round" transform="rotate(22.5 50 50)" />
                    <circle cx="50" cy="50" r="11" fill="#8B7355" />
                    <circle cx="50" cy="50" r="7" fill="#E6C229" />
                </g>
                <!-- Green Stems -->
                <path d="M35 60 Q40 85 45 100" stroke="#3A5F0B" stroke-width="4.5" fill="none" />
                <path d="M65 60 Q60 85 55 100" stroke="#3A5F0B" stroke-width="4.5" fill="none" />
                <path d="M50 65 Q50 85 50 100" stroke="#3A5F0B" stroke-width="5" fill="none" />
            </svg>
        `;
    }

    flowerWrap.innerHTML = flowerSVG;
}

// Add customized design to shopping cart
function addCustomBouquetToCart() {
    const flowerType = document.querySelector('input[name="flowerType"]:checked').value;
    const fabricType = document.querySelector('input[name="fabricType"]:checked').value;
    const flowerColor = document.querySelector('input[name="flowerColor"]:checked').value;
    const wrappingType = document.querySelector('input[name="wrappingType"]:checked').value;

    const p1 = optionsSurcharges.flowerType[flowerType];
    const p2 = optionsSurcharges.fabricType[fabricType];
    const p3 = optionsSurcharges.flowerColor[flowerColor];
    const p4 = optionsSurcharges.wrappingType[wrappingType];
    const price = builderBasePrice + p1 + p2 + p3 + p4;

    const id = `cb_${Date.now()}`;
    const name = `باقة لوزان المخصصة (${flowerType})`;
    const optionsText = `قماش: ${fabricType}، لون: ${flowerColor}، تغليف: ${wrappingType}`;

    // Choose appropriate local image based on selected type
    let img = "assets/satin-roses.png";
    if (flowerType === "توليب") {
        img = "assets/velvet-tulips.png";
    } else if (flowerColor === "وردي ناعم") {
        img = "assets/pink-spring.png";
    } else if (flowerColor === "أبيض ناصع" || flowerColor === "كريمي دافئ") {
        img = "assets/white-jasmine.png";
    }

    // Add to cart list
    const cartItem = {
        id: id,
        name: name,
        price: price,
        img: img,
        qty: 1,
        meta: optionsText
    };

    cart.push(cartItem);
    saveCartAndRefresh();
    showToast(`تمت إضافة باقتك المخصصة للسلة!`);

    // Reset builder to step 1
    nextStep(1);

    // Open Cart Drawer
    toggleCart(true);
}

// ---------------------------------------------------------
// 6. Shopping Cart Core Operations
// ---------------------------------------------------------
function setupCartToggle() {
    const cartToggle = document.getElementById("cartToggle");
    const cartClose = document.getElementById("cartClose");
    const cartOverlay = document.getElementById("cartOverlay");

    if (cartToggle) cartToggle.addEventListener("click", () => toggleCart(true));
    if (cartClose) cartClose.addEventListener("click", () => toggleCart(false));
    if (cartOverlay) cartOverlay.addEventListener("click", () => toggleCart(false));
}

function toggleCart(show) {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("cartOverlay");

    if (show) {
        drawer.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = "hidden"; // Disable background scrolling
    } else {
        drawer.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = ""; // Re-enable scroll
    }
}

function addToCart(id, name, price, img, fabric) {
    // Check if catalog item is already in cart
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            img: img,
            qty: 1,
            meta: `نوع القماش: ${fabric}`
        });
    }

    saveCartAndRefresh();
    showToast(`تمت إضافة "${name}" إلى السلة.`);
}

function changeQty(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            // Remove item
            cart = cart.filter(i => i.id !== id);
        }
        saveCartAndRefresh();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCartAndRefresh();
    showToast("تم حذف المنتج من السلة.");
}

function saveCartAndRefresh() {
    localStorage.setItem("lozan_cart", JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById("cartItemsContainer");
    const badge = document.getElementById("cartBadge");
    const subtotalText = document.getElementById("cartSubtotal");
    const totalText = document.getElementById("cartTotal");
    const emptyMsg = document.getElementById("emptyCartMessage");
    const drawerFooter = document.getElementById("cartDrawerFooter");

    // Calculate totals
    let totalItems = 0;
    let subtotal = 0;

    // Clear items list except empty message
    const itemElements = container.querySelectorAll(".cart-item");
    itemElements.forEach(el => el.remove());

    if (cart.length === 0) {
        emptyMsg.style.display = "flex";
        drawerFooter.style.display = "none";
        badge.textContent = "0";
    } else {
        emptyMsg.style.display = "none";
        drawerFooter.style.display = "block";

        cart.forEach(item => {
            totalItems += item.qty;
            subtotal += (item.price * item.qty);

            // Create Cart Item elements
            const itemHTML = `
                <div class="cart-item" id="item_${item.id}">
                    <img src="${item.img}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <div class="cart-item-meta">${item.meta}</div>
                        <div class="cart-item-price">${item.price} ر.س</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" aria-label="حذف">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                        <div class="qty-selector">
                            <button class="qty-btn" onclick="changeQty('${item.id}', -1)" aria-label="تقليل">-</button>
                            <span class="qty-number">${item.qty}</span>
                            <button class="qty-btn" onclick="changeQty('${item.id}', 1)" aria-label="زيادة">+</button>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML("beforeend", itemHTML);
        });

        badge.textContent = totalItems;
    }

    subtotalText.textContent = `${subtotal} ر.س`;
    totalText.textContent = `${subtotal} ر.س`;
}

// Show feedback toasts
function showToast(message) {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add("active");

        setTimeout(() => {
            toast.classList.remove("active");
        }, 3000);
    }
}

// ---------------------------------------------------------
// 7. Checkout & Form Submission WhatsApp Integration
// ---------------------------------------------------------
const targetWhatsAppNum = "+967783868488"; // Lozan official contact number (Saudi code)

function checkoutWhatsApp() {
    if (cart.length === 0) return;

    let messageText = "السلام عليكم ورحمة الله وبركاته، أود طلب الباقات التالية من متجر ورود لوزان:\n\n";

    cart.forEach((item, index) => {
        messageText += `*${index + 1}. ${item.name}*\n`;
        messageText += `   التفاصيل: ${item.meta}\n`;
        messageText += `   الكمية: ${item.qty}\n`;
        messageText += `   السعر: ${item.price} ر.س (المجموع: ${item.price * item.qty} ر.س)\n\n`;
    });

    const grandTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    messageText += `*المجموع الكلي للطلب:* ${grandTotal} ر.س\n`;
    messageText += `*طريقة التوصيل المتوقعة:* شحن سريع \n\n`;
    messageText += `يرجى تأكيد استلام الطلب وتزويدي ببيانات التحويل البنكي والتنسيق للشحن.\n`;
    messageText += `رابط المتجر في الانستغرام: instagram.com/lozan.flowers`;

    // Open WhatsApp Web/App
    const encodedText = encodeURIComponent(messageText);
    const waURL = `https://api.whatsapp.com/send?phone=${targetWhatsAppNum}&text=${encodedText}`;

    // Open link in new window
    window.open(waURL, "_blank");

    // Optional: Clear cart after redirection
    // cart = [];
    // saveCartAndRefresh();
}

function handleContactSubmit(event) {
    event.preventDefault();

    const clientName = document.getElementById("clientName").value.trim();
    const clientPhone = document.getElementById("clientPhone").value.trim();
    const clientMsg = document.getElementById("clientMsg").value.trim();

    if (!clientName || !clientPhone || !clientMsg) {
        alert("يرجى ملء كافة الخانات المطلوبة.");
        return;
    }

    let queryText = "السلام عليكم ورحمة الله وبركاته،\n";
    queryText += `معكم العميل: *${clientName}*\n`;
    queryText += `رقم الجوال للتواصل: ${clientPhone}\n\n`;
    queryText += `*الاستفسار / الطلب الخاص:*\n${clientMsg}\n\n`;
    queryText += `بخصوص متجر ورود لوزان: lozan.flowers`;

    const encodedQuery = encodeURIComponent(queryText);
    const waFormURL = `https://api.whatsapp.com/send?phone=${targetWhatsAppNum}&text=${encodedQuery}`;

    window.open(waFormURL, "_blank");

    // Reset Form
    document.getElementById("contactForm").reset();
    showToast("جاري توجيه رسالتك إلى واتساب لوزان...");
}
