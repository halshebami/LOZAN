/* ==========================================================================
   Lozan Flowers | ورود لوزان
   JS Application Logic - Cart, Custom Builder, Scroll Triggers, WhatsApp API (بدون أسعار)
   ========================================================================== */

// ---------------------------------------------------------
// 1. Initial State & Setup
// ---------------------------------------------------------
let cart = [];

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

    if (flowerType === "جوري") {
        flowerSVG = `
            <svg viewBox="0 0 100 100" width="100%" height="100%" style="overflow: visible;">
                <g transform="translate(-15, -10) scale(0.85)">
                    <circle cx="50" cy="50" r="28" fill="${hexColor}" opacity="0.9" />
                    <path d="M50 25 C45 35, 35 45, 50 65 C65 45, 55 35, 50 25 Z" fill="#6B000C" opacity="0.6" />
                    <circle cx="50" cy="50" r="16" fill="${hexColor}" />
                    <circle cx="50" cy="50" r="8" fill="#4A0006" />
                </g>
                <g transform="translate(25, -5) scale(0.85)">
                    <circle cx="50" cy="50" r="28" fill="${hexColor}" opacity="0.9" />
                    <path d="M50 25 C45 35, 35 45, 50 65 C65 45, 55 35, 50 25 Z" fill="#6B000C" opacity="0.6" />
                    <circle cx="50" cy="50" r="16" fill="${hexColor}" />
                    <circle cx="50" cy="50" r="8" fill="#4A0006" />
                </g>
                <g transform="translate(5, -25) scale(1)">
                    <circle cx="50" cy="50" r="30" fill="${hexColor}" />
                    <path d="M50 22 C43 32, 32 42, 50 68 C68 42, 57 32, 50 22 Z" fill="#6B000C" opacity="0.4" />
                    <circle cx="50" cy="50" r="18" fill="${hexColor}" />
                    <circle cx="50" cy="50" r="10" fill="#4A0006" />
                </g>
                <path d="M35 60 Q40 85 45 100" stroke="#3A5F0B" stroke-width="4" fill="none" />
                <path d="M65 60 Q60 85 55 100" stroke="#3A5F0B" stroke-width="4" fill="none" />
                <path d="M50 65 Q50 85 50 100" stroke="#3A5F0B" stroke-width="4.5" fill="none" />
                <path d="M30 65 Q15 60 25 50 Q30 55 30 65" fill="#3A5F0B" />
                <path d="M70 65 Q85 60 75 50 Q70 55 70 65" fill="#3A5F0B" />
            </svg>
        `;
    } else if (flowerType === "توليب") {
        flowerSVG = `
            <svg viewBox="0 0 100 100" width="100%" height="100%" style="overflow: visible;">
                <g transform="translate(-15, -15) scale(0.85)">
                    <path d="M50 20 C30 35, 30 75, 50 80 C70 75, 70 35, 50 20 Z" fill="${hexColor}" />
                    <path d="M50 20 C40 35, 40 70, 50 80 C60 70, 60 35, 50 20 Z" fill="#4A0006" opacity="0.3" />
                    <path d="M50 20 C45 35, 45 70, 50 80" stroke="#fff" stroke-width="1" fill="none" opacity="0.2" />
                </g>
                <g transform="translate(25, -10) scale(0.85)">
                    <path d="M50 20 C30 35, 30 75, 50 80 C70 75, 70 35, 50 20 Z" fill="${hexColor}" />
                    <path d="M50 20 C40 35, 40 70, 50 80 C60 70, 60 35, 50 20 Z" fill="#4A0006" opacity="0.3" />
                    <path d="M50 20 C45 35, 45 70, 50 80" stroke="#fff" stroke-width="1" fill="none" opacity="0.2" />
                </g>
                <g transform="translate(5, -30) scale(1)">
                    <path d="M50 15 C28 30, 28 75, 50 80 C72 75, 72 30, 50 15 Z" fill="${hexColor}" />
                    <path d="M50 15 C38 30, 38 70, 50 80 C62 70, 62 30, 50 15 Z" fill="#4A0006" opacity="0.3" />
                    <path d="M50 15 C45 30, 45 70, 50 80" stroke="#fff" stroke-width="1.2" fill="none" opacity="0.25" />
                </g>
                <path d="M35 65 Q40 85 45 100" stroke="#2E5007" stroke-width="4.5" fill="none" />
                <path d="M65 65 Q60 85 55 100" stroke="#2E5007" stroke-width="4.5" fill="none" />
                <path d="M50 70 Q50 85 50 100" stroke="#2E5007" stroke-width="5" fill="none" />
                <path d="M25 75 Q15 50 25 35 Q30 50 32 75 Z" fill="#2E5007" />
                <path d="M75 75 Q85 50 75 35 Q70 50 68 75 Z" fill="#2E5007" />
            </svg>
        `;
    } else if (flowerType === "الزنبق" || flowerType === "ليلي") {
        flowerSVG = `
            <svg viewBox="0 0 100 100" width="100%" height="100%" style="overflow: visible;">
                <path d="M35 60 Q40 85 45 100" stroke="#3A5F0B" stroke-width="4.5" fill="none" />
                <path d="M65 60 Q60 85 55 100" stroke="#3A5F0B" stroke-width="4.5" fill="none" />
                <path d="M50 65 Q50 85 50 100" stroke="#3A5F0B" stroke-width="5" fill="none" />
                <g transform="translate(-15, -10) scale(0.85)">
                    <path d="M50 20 C42 35, 20 40, 35 50 C20 60, 42 65, 50 80 C58 65, 80 60, 65 50 C80 40, 58 35, 50 20 Z" fill="${hexColor}" />
                    <path d="M50 20 C46 35, 35 45, 50 50 C65 45, 54 35, 50 20 Z" fill="#fff" opacity="0.3" />
                    <line x1="50" y1="50" x2="50" y2="35" stroke="#E6C229" stroke-width="2.5" stroke-linecap="round" />
                    <circle cx="50" cy="35" r="2" fill="#8B7355" />
                </g>
                <g transform="translate(25, -5) scale(0.85)">
                    <path d="M50 20 C42 35, 20 40, 35 50 C20 60, 42 65, 50 80 C58 65, 80 60, 65 50 C80 40, 58 35, 50 20 Z" fill="${hexColor}" />
                    <path d="M50 20 C46 35, 35 45, 50 50 C65 45, 54 35, 50 20 Z" fill="#fff" opacity="0.3" />
                    <line x1="50" y1="50" x2="50" y2="35" stroke="#E6C229" stroke-width="2.5" stroke-linecap="round" />
                    <circle cx="50" cy="35" r="2" fill="#8B7355" />
                </g>
                <g transform="translate(5, -25) scale(1)">
                    <path d="M50 15 C40 32, 15 38, 32 50 C15 62, 40 68, 50 85 C60 68, 85 62, 68 50 C85 38, 60 32, 50 15 Z" fill="${hexColor}" />
                    <path d="M50 15 C45 32, 32 45, 50 50 C68 45, 55 32, 50 15 Z" fill="#fff" opacity="0.3" />
                    <line x1="50" y1="50" x2="50" y2="30" stroke="#E6C229" stroke-width="3" stroke-linecap="round" />
                    <circle cx="50" cy="30" r="2.5" fill="#8B7355" />
                </g>
            </svg>
        `;
    } else if (flowerType === "دوار الشمس") {
        flowerSVG = `
            <svg viewBox="0 0 100 100" width="100%" height="100%" style="overflow: visible;">
                <path d="M35 60 Q40 85 45 100" stroke="#3A5F0B" stroke-width="4.5" fill="none" />
                <path d="M65 60 Q60 85 55 100" stroke="#3A5F0B" stroke-width="4.5" fill="none" />
                <path d="M50 65 Q50 85 50 100" stroke="#3A5F0B" stroke-width="5" fill="none" />
                <g transform="translate(-15, -10) scale(0.85)">
                    <circle cx="50" cy="50" r="28" fill="${hexColor}" stroke="${hexColor}" stroke-dasharray="6 3" stroke-width="8" />
                    <circle cx="50" cy="50" r="16" fill="#3D2314" />
                    <circle cx="50" cy="50" r="14" fill="#24120A" stroke="#5C3A21" stroke-width="1.5" stroke-dasharray="2 2" />
                </g>
                <g transform="translate(25, -5) scale(0.85)">
                    <circle cx="50" cy="50" r="28" fill="${hexColor}" stroke="${hexColor}" stroke-dasharray="6 3" stroke-width="8" />
                    <circle cx="50" cy="50" r="16" fill="#3D2314" />
                    <circle cx="50" cy="50" r="14" fill="#24120A" stroke="#5C3A21" stroke-width="1.5" stroke-dasharray="2 2" />
                </g>
                <g transform="translate(5, -25) scale(1)">
                    <circle cx="50" cy="50" r="30" fill="${hexColor}" stroke="${hexColor}" stroke-dasharray="7 3.5" stroke-width="9" />
                    <circle cx="50" cy="50" r="18" fill="#3D2314" />
                    <circle cx="50" cy="50" r="15" fill="#24120A" stroke="#5C3A21" stroke-width="2" stroke-dasharray="2.5 2.5" />
                </g>
            </svg>
        `;
    } else if (flowerType === "ماغنوليا") {
        flowerSVG = `
            <svg viewBox="0 0 100 100" width="100%" height="100%" style="overflow: visible;">
                <path d="M35 60 Q40 85 45 100" stroke="#3A5F0B" stroke-width="4.5" fill="none" />
                <path d="M65 60 Q60 85 55 100" stroke="#3A5F0B" stroke-width="4.5" fill="none" />
                <path d="M50 65 Q50 85 50 100" stroke="#3A5F0B" stroke-width="5" fill="none" />
                <g transform="translate(-15, -10) scale(0.85)">
                    <circle cx="50" cy="50" r="25" fill="${hexColor}" />
                    <path d="M50 20 C25 35, 25 65, 50 80 C75 65, 75 35, 50 20 Z" fill="${hexColor}" stroke="#fff" stroke-width="1" opacity="0.9" />
                    <path d="M20 50 C35 25, 65 25, 80 50 C65 75, 35 75, 20 50 Z" fill="${hexColor}" stroke="#fff" stroke-width="1" opacity="0.8" />
                    <circle cx="50" cy="50" r="8" fill="#E6C229" />
                </g>
                <g transform="translate(25, -5) scale(0.85)">
                    <circle cx="50" cy="50" r="25" fill="${hexColor}" />
                    <path d="M50 20 C25 35, 25 65, 50 80 C75 65, 75 35, 50 20 Z" fill="${hexColor}" stroke="#fff" stroke-width="1" opacity="0.9" />
                    <path d="M20 50 C35 25, 65 25, 80 50 C65 75, 35 75, 20 50 Z" fill="${hexColor}" stroke="#fff" stroke-width="1" opacity="0.8" />
                    <circle cx="50" cy="50" r="8" fill="#E6C229" />
                </g>
                <g transform="translate(5, -25) scale(1)">
                    <circle cx="50" cy="50" r="27" fill="${hexColor}" />
                    <path d="M50 18 C22 33, 22 67, 50 82 C78 67, 78 33, 50 18 Z" fill="${hexColor}" stroke="#fff" stroke-width="1.2" opacity="0.9" />
                    <path d="M18 50 C33 22, 67 22, 82 50 C67 78, 33 78, 18 50 Z" fill="${hexColor}" stroke="#fff" stroke-width="1.2" opacity="0.8" />
                    <circle cx="50" cy="50" r="9" fill="#E6C229" />
                </g>
            </svg>
        `;
    } else if (flowerType === "اقحوان") {
        flowerSVG = `
            <svg viewBox="0 0 100 100" width="100%" height="100%" style="overflow: visible;">
                <path d="M35 60 Q40 85 45 100" stroke="#3A5F0B" stroke-width="4.5" fill="none" />
                <path d="M65 60 Q60 85 55 100" stroke="#3A5F0B" stroke-width="4.5" fill="none" />
                <path d="M50 65 Q50 85 50 100" stroke="#3A5F0B" stroke-width="5" fill="none" />
                <g transform="translate(-15, -10) scale(0.85)">
                    <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="${hexColor}" stroke-width="8" stroke-linecap="round" />
                    <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="${hexColor}" stroke-width="4" stroke-linecap="round" transform="rotate(22.5 50 50)" />
                    <circle cx="50" cy="50" r="11" fill="#E6C229" />
                    <circle cx="50" cy="50" r="6" fill="#C29B0E" />
                </g>
                <g transform="translate(25, -5) scale(0.85)">
                    <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="${hexColor}" stroke-width="8" stroke-linecap="round" />
                    <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="${hexColor}" stroke-width="4" stroke-linecap="round" transform="rotate(22.5 50 50)" />
                    <circle cx="50" cy="50" r="11" fill="#E6C229" />
                    <circle cx="50" cy="50" r="6" fill="#C29B0E" />
                </g>
                <g transform="translate(5, -25) scale(1)">
                    <path d="M50 8 L50 92 M8 50 L92 50 M20 20 L80 80 M20 80 L80 20" stroke="${hexColor}" stroke-width="9" stroke-linecap="round" />
                    <path d="M50 8 L50 92 M8 50 L92 50 M20 20 L80 80 M20 80 L80 20" stroke="${hexColor}" stroke-width="5" stroke-linecap="round" transform="rotate(22.5 50 50)" />
                    <circle cx="50" cy="50" r="13" fill="#E6C229" />
                    <circle cx="50" cy="50" r="7" fill="#C29B0E" />
                </g>
            </svg>
        `;
    } else if (flowerType === "لافندر") {
        flowerSVG = `
            <svg viewBox="0 0 100 100" width="100%" height="100%" style="overflow: visible;">
                <path d="M35 50 Q30 75 45 100" stroke="#3A5F0B" stroke-width="3.5" fill="none" />
                <path d="M65 50 Q70 75 55 100" stroke="#3A5F0B" stroke-width="3.5" fill="none" />
                <path d="M50 40 Q50 75 50 100" stroke="#3A5F0B" stroke-width="4" fill="none" />
                <g transform="translate(-15, -15)">
                    <path d="M50 15 L50 65" stroke="#3A5F0B" stroke-width="2.5" />
                    <circle cx="50" cy="20" r="4.5" fill="${hexColor}" />
                    <circle cx="46" cy="26" r="4" fill="${hexColor}" />
                    <circle cx="54" cy="26" r="4" fill="${hexColor}" />
                    <circle cx="45" cy="34" r="4" fill="${hexColor}" />
                    <circle cx="55" cy="34" r="4" fill="${hexColor}" />
                    <circle cx="50" cy="30" r="4" fill="${hexColor}" opacity="0.8" />
                    <circle cx="46" cy="42" r="4" fill="${hexColor}" />
                    <circle cx="54" cy="42" r="4" fill="${hexColor}" />
                    <circle cx="50" cy="38" r="4.5" fill="${hexColor}" opacity="0.8" />
                    <circle cx="47" cy="50" r="3.5" fill="${hexColor}" />
                    <circle cx="53" cy="50" r="3.5" fill="${hexColor}" />
                    <circle cx="50" cy="46" r="4" fill="${hexColor}" opacity="0.8" />
                </g>
                <g transform="translate(15, -10)">
                    <path d="M50 15 L50 65" stroke="#3A5F0B" stroke-width="2.5" />
                    <circle cx="50" cy="20" r="4.5" fill="${hexColor}" />
                    <circle cx="46" cy="26" r="4" fill="${hexColor}" />
                    <circle cx="54" cy="26" r="4" fill="${hexColor}" />
                    <circle cx="45" cy="34" r="4" fill="${hexColor}" />
                    <circle cx="55" cy="34" r="4" fill="${hexColor}" />
                    <circle cx="50" cy="30" r="4" fill="${hexColor}" opacity="0.8" />
                    <circle cx="46" cy="42" r="4" fill="${hexColor}" />
                    <circle cx="54" cy="42" r="4" fill="${hexColor}" />
                    <circle cx="50" cy="38" r="4.5" fill="${hexColor}" opacity="0.8" />
                    <circle cx="47" cy="50" r="3.5" fill="${hexColor}" />
                    <circle cx="53" cy="50" r="3.5" fill="${hexColor}" />
                    <circle cx="50" cy="46" r="4" fill="${hexColor}" opacity="0.8" />
                </g>
                <g transform="translate(0, -25)">
                    <path d="M50 15 L50 65" stroke="#3A5F0B" stroke-width="3" />
                    <circle cx="50" cy="18" r="5" fill="${hexColor}" />
                    <circle cx="45" cy="25" r="4.5" fill="${hexColor}" />
                    <circle cx="55" cy="25" r="4.5" fill="${hexColor}" />
                    <circle cx="44" cy="34" r="4.5" fill="${hexColor}" />
                    <circle cx="56" cy="34" r="4.5" fill="${hexColor}" />
                    <circle cx="50" cy="30" r="4.5" fill="${hexColor}" opacity="0.8" />
                    <circle cx="45" cy="43" r="4.5" fill="${hexColor}" />
                    <circle cx="55" cy="43" r="4.5" fill="${hexColor}" />
                    <circle cx="50" cy="38" r="5" fill="${hexColor}" opacity="0.8" />
                    <circle cx="46" cy="52" r="4" fill="${hexColor}" />
                    <circle cx="54" cy="52" r="4" fill="${hexColor}" />
                    <circle cx="50" cy="47" r="4.5" fill="${hexColor}" opacity="0.8" />
                </g>
            </svg>
        `;
    } else {
        flowerSVG = `
            <svg viewBox="0 0 100 100" width="100%" height="100%" style="overflow: visible;">
                <g transform="translate(-15, -10) scale(0.85)">
                    <circle cx="50" cy="50" r="10" fill="#D4AF37" />
                    <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="${hexColor}" stroke-width="8" stroke-linecap="round" />
                    <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="${hexColor}" stroke-width="4" stroke-linecap="round" transform="rotate(22.5 50 50)" />
                    <circle cx="50" cy="50" r="10" fill="#8B7355" />
                    <circle cx="50" cy="50" r="7" fill="#E6C229" />
                </g>
                <g transform="translate(25, -5) scale(0.85)">
                    <circle cx="50" cy="50" r="10" fill="#D4AF37" />
                    <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="${hexColor}" stroke-width="8" stroke-linecap="round" />
                    <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="${hexColor}" stroke-width="4" stroke-linecap="round" transform="rotate(22.5 50 50)" />
                    <circle cx="50" cy="50" r="10" fill="#8B7355" />
                    <circle cx="50" cy="50" r="7" fill="#E6C229" />
                </g>
                <g transform="translate(5, -25) scale(1)">
                    <circle cx="50" cy="50" r="11" fill="#D4AF37" />
                    <path d="M50 8 L50 92 M8 50 L92 50 M20 20 L80 80 M20 80 L80 20" stroke="${hexColor}" stroke-width="9" stroke-linecap="round" />
                    <path d="M50 8 L50 92 M8 50 L92 50 M20 20 L80 80 M20 80 L80 20" stroke="${hexColor}" stroke-width="5" stroke-linecap="round" transform="rotate(22.5 50 50)" />
                    <circle cx="50" cy="50" r="11" fill="#8B7355" />
                    <circle cx="50" cy="50" r="7" fill="#E6C229" />
                </g>
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

    const id = `cb_${Date.now()}`;
    const name = `باقة لوزان المخصصة (${flowerType})`;
    const optionsText = `قماش: ${fabricType}، لون: ${flowerColor}، تغليف: ${wrappingType}`;

    let img = "1.3.jpg";
    if (flowerType === "توليب") {
        img = "velvet-tulips.png";
    } else if (flowerType === "لافندر") {
        img = "2.5.jpg";
    } else if (flowerType === "الزنبق" || flowerType === "ليلي") {
        img = "2.10.jpg";
    } else if (flowerColor === "وردي ناعم") {
        img = "2.1.jpg";
    } else if (flowerColor === "أبيض ناصع" || flowerColor === "كريمي دافئ") {
        img = "white-jasmine.png";
    }

    const cartItem = {
        id: id,
        name: name,
        img: img,
        qty: 1,
        meta: optionsText
    };

    cart.push(cartItem);
    saveCartAndRefresh();
    showToast(`تمت إضافة باقتك المخصصة لسلة الطلبات!`);

    nextStep(1);
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
        document.body.style.overflow = "hidden";
    } else {
        drawer.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
    }
}

function addToCart(id, name, price, img, fabric) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            img: img,
            qty: 1,
            meta: `نوع القماش: ${fabric}`
        });
    }

    saveCartAndRefresh();
    showToast(`تمت إضافة "${name}" لسلة الطلبات.`);
}

function changeQty(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        saveCartAndRefresh();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCartAndRefresh();
    showToast("تم حذف الباقة من السلة.");
}

function saveCartAndRefresh() {
    localStorage.setItem("lozan_cart", JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById("cartItemsContainer");
    const badge = document.getElementById("cartBadge");
    const emptyMsg = document.getElementById("emptyCartMessage");
    const drawerFooter = document.getElementById("cartDrawerFooter");

    let totalItems = 0;

    const itemElements = container.querySelectorAll(".cart-item");
    itemElements.forEach(el => el.remove());

    if (cart.length === 0) {
        emptyMsg.style.display = "flex";
        drawerFooter.style.display = "none";
        badge.textContent = "0";
        // Reset gift card
        const addGiftCard = document.getElementById("addGiftCard");
        if (addGiftCard) {
            addGiftCard.checked = false;
        }
        const wrapper = document.getElementById("giftCardInputWrapper");
        if (wrapper) {
            wrapper.classList.remove("active");
        }
        const giftCardMessage = document.getElementById("giftCardMessage");
        if (giftCardMessage) {
            giftCardMessage.value = "";
        }
    } else {
        emptyMsg.style.display = "none";
        drawerFooter.style.display = "block";

        cart.forEach(item => {
            totalItems += item.qty;

            const itemHTML = `
                <div class="cart-item" id="item_${item.id}">
                    <img src="${item.img}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <div class="cart-item-meta">${item.meta}</div>
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
}

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
const targetWhatsAppNum = "967783868488";

function checkoutWhatsApp() {
    if (cart.length === 0) return;

    let messageText = "السلام عليكم ورحمة الله وبركاته، أود حجز وتنسيق الباقات التالية من متجر ورود لوزان:\n\n";

    cart.forEach((item, index) => {
        messageText += `*${index + 1}. ${item.name}*\n`;
        messageText += `   التفاصيل: ${item.meta}\n`;
        messageText += `   الكمية المطلوبة: ${item.qty}\n\n`;
    });

    // Check if gift card message is added
    const addGiftCard = document.getElementById("addGiftCard");
    const giftCardMessage = document.getElementById("giftCardMessage");
    if (addGiftCard && addGiftCard.checked && giftCardMessage && giftCardMessage.value.trim() !== "") {
        messageText += `*عبارة كرت الإهداء المرفق:*\n"${giftCardMessage.value.trim()}"\n\n`;
    }

    messageText += `*طريقة التوصيل المفضلّة:* شحن/توصيل سريع\n\n`;
    messageText += `يرجى تأكيد استقبال الطلب لمناقشة الأسعار وتفاصيل الإرسال والتنسيق.\n`;
    messageText += `رابط المتجر على انستغرام: instagram.com/lozan.flowers`;

    const encodedText = encodeURIComponent(messageText);
    const waURL = `https://wa.me/${targetWhatsAppNum}?text=${encodedText}`;

    window.open(waURL, "_blank");
}

// Toggle gift card input open/close
function toggleGiftCardInput() {
    const addGiftCard = document.getElementById("addGiftCard");
    const wrapper = document.getElementById("giftCardInputWrapper");
    if (addGiftCard && wrapper) {
        if (addGiftCard.checked) {
            wrapper.classList.add("active");
            setTimeout(() => {
                const txt = document.getElementById("giftCardMessage");
                if (txt) txt.focus();
            }, 350);
        } else {
            wrapper.classList.remove("active");
            const txt = document.getElementById("giftCardMessage");
            if (txt) txt.value = "";
        }
    }
}