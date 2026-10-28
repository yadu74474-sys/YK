/**
 * ============================================================================
 * MAISON DORÉE ARTISAN BAKERY & PATISSERIE
 * Client-Side JavaScript Application Logic
 * ============================================================================
 * 
 * QUICK SETUP FOR BAKERY OWNER:
 * To customize for your bakery, edit the values in BAKERY_CONFIG below.
 * Change your WhatsApp number, phone, email, and address.
 */

// ----------------------------------------------------------------------------
// 1. Centralized Bakery Configuration (Owner Editable)
// ----------------------------------------------------------------------------
const BAKERY_CONFIG = {
  // Replace with your real bakery brand name
  bakeryName: "Maison Dorée Artisan Bakery",
  
  // Replace with your 10-digit phone number with country code (e.g., "919876543210")
  // Do NOT include '+', spaces, or dashes here.
  whatsappNumber: "91XXXXXXXXXX",
  
  // Display phone number for calls and customer inquiries
  phoneDisplay: "+91 98765 43210",
  phoneRaw: "+919876543210",
  
  // Contact email
  email: "hello@maisondoree.com",
  
  // Physical store address
  address: "Shop 4, Heritage Lane, Near Old Town Square, Bangalore - 560001",
  
  // Google Maps pin or location link
  googleMapsUrl: "https://maps.google.com/?q=Artisan+Bakery+Bangalore",
  
  // Currency symbol
  currency: "₹",
  
  // Minimum advance notice required for custom designer cakes
  customCakeAdvanceNotice: "48 hours advance notice required"
};

// ----------------------------------------------------------------------------
// 2. WhatsApp Helper Function
// ----------------------------------------------------------------------------
/**
 * Opens WhatsApp with a pre-filled, URL-encoded message.
 * @param {string} message - The message text to send to the bakery.
 */
function openWhatsAppMessage(message) {
  // Validate if the owner has replaced the placeholder number
  if (BAKERY_CONFIG.whatsappNumber === "91XXXXXXXXXX") {
    console.warn("[Bakery Website] WhatsApp number is currently set to placeholder '91XXXXXXXXXX'. Please update BAKERY_CONFIG in script.js with your real number.");
  }
  
  const encodedText = encodeURIComponent(message);
  const waUrl = `https://wa.me/${BAKERY_CONFIG.whatsappNumber}?text=${encodedText}`;
  window.open(waUrl, "_blank", "noopener,noreferrer");
}

// ----------------------------------------------------------------------------
// 3. Toast Notification Utility
// ----------------------------------------------------------------------------
/**
 * Displays an elegant non-intrusive toast notification.
 * @param {string} message - Text to show
 * @param {number} duration - Time in milliseconds
 */
function showToast(message, duration = 4000) {
  let toast = document.getElementById("siteToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "siteToast";
    toast.className = "toast-notification";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.innerHTML = `
      <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      <span class="toast-message"></span>
    `;
    document.body.appendChild(toast);
  }

  const textElement = toast.querySelector(".toast-message");
  if (textElement) {
    textElement.textContent = message;
  }

  toast.classList.add("show");

  if (window.toastTimeout) {
    clearTimeout(window.toastTimeout);
  }

  window.toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

// ----------------------------------------------------------------------------
// 4. Initialize Core App Behaviors on DOM Loaded
// ----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initStickyHeader();
  initMobileNavigation();
  initOrderButtons();
  initCategoryCards();
  initGalleryFilterAndLightbox();
  initContactForm();
  initImageFallbacks();
});

// ----------------------------------------------------------------------------
// 5. Sticky Header & Scroll Spy
// ----------------------------------------------------------------------------
function initStickyHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

// ----------------------------------------------------------------------------
// 6. Mobile Hamburger Navigation
// ----------------------------------------------------------------------------
function initMobileNavigation() {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileNav = document.getElementById("mobileNav");
  if (!hamburgerBtn || !mobileNav) return;

  const toggleMenu = (shouldOpen) => {
    const isOpen = typeof shouldOpen === "boolean" ? shouldOpen : !mobileNav.classList.contains("open");
    hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      mobileNav.classList.add("open");
      document.body.style.overflow = "hidden";
    } else {
      mobileNav.classList.remove("open");
      document.body.style.overflow = "";
    }
  };

  hamburgerBtn.addEventListener("click", () => {
    toggleMenu();
  });

  // Close when clicking mobile navigation links
  const mobileLinks = mobileNav.querySelectorAll("a");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      toggleMenu(false);
    });
  });

  // Close when pressing Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav.classList.contains("open")) {
      toggleMenu(false);
    }
  });

  // Close when resizing to desktop viewport
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && mobileNav.classList.contains("open")) {
      toggleMenu(false);
    }
  });
}

// ----------------------------------------------------------------------------
// 7. Product Order Buttons & WhatsApp Integration
// ----------------------------------------------------------------------------
function initOrderButtons() {
  // Product card "Order Now" buttons
  const orderButtons = document.querySelectorAll("[data-product-order]");
  orderButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest(".product-card") || btn.closest("[data-product-name]");
      const productName = card?.getAttribute("data-product-name") || btn.getAttribute("data-product-name") || "Bakery Special";
      const price = card?.getAttribute("data-product-price") || "";
      
      const priceText = price ? ` (${price})` : "";
      const message = `Hi ${BAKERY_CONFIG.bakeryName}! I'd like to order the ${productName}${priceText}. Please share availability and delivery details.`;
      
      openWhatsAppMessage(message);
    });
  });

  // Custom cake inquiry button
  const customCakeBtn = document.getElementById("customCakeWhatsAppBtn");
  if (customCakeBtn) {
    customCakeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const message = `Hi ${BAKERY_CONFIG.bakeryName}! I'd like to inquire about a custom cake for an upcoming celebration. Could you please share your design catalog, pricing, and available booking dates?`;
      openWhatsAppMessage(message);
    });
  }

  // General "Explore Our Menu" or header order CTA
  const generalOrderCtas = document.querySelectorAll(".js-general-order-cta");
  generalOrderCtas.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const message = `Hi ${BAKERY_CONFIG.bakeryName}! I'm looking at your menu and would like to place an order for today.`;
      openWhatsAppMessage(message);
    });
  });
}

// ----------------------------------------------------------------------------
// 8. Shop by Category Interaction
// ----------------------------------------------------------------------------
function initCategoryCards() {
  const categoryCards = document.querySelectorAll(".category-card");
  categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      const category = card.getAttribute("data-category") || "all";
      
      // Scroll to menu section
      const menuSection = document.getElementById("menu");
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: "smooth" });
      }

      // If category matches gallery, switch gallery tab
      const galleryTab = document.querySelector(`.gallery-filter-btn[data-filter="${category}"]`);
      if (galleryTab) {
        galleryTab.click();
      }
    });
  });
}

// ----------------------------------------------------------------------------
// 9. Photo Gallery Filters & Lightbox Modal
// ----------------------------------------------------------------------------
function initGalleryFilterAndLightbox() {
  const filterButtons = document.querySelectorAll(".gallery-filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImg = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxCloseBtn = document.getElementById("lightboxCloseBtn");

  // Filtering
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      galleryItems.forEach((item) => {
        const itemCategory = item.getAttribute("data-gallery-category");
        if (filter === "all" || itemCategory === filter) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // Lightbox click on gallery items
  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (!lightbox || !lightboxImg) return;
      const img = item.querySelector(".gallery-img");
      const title = item.querySelector(".gallery-item-title")?.textContent || "Maison Dorée Bakery";
      const sub = item.querySelector(".gallery-item-sub")?.textContent || "";

      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || title;
        if (lightboxCaption) {
          lightboxCaption.textContent = sub ? `${title} — ${sub}` : title;
        }
        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      }
    });
  });

  // Close Lightbox
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
}

// ----------------------------------------------------------------------------
// 10. Contact Form with Validation & WhatsApp Routing
// ----------------------------------------------------------------------------
function initContactForm() {
  const form = document.getElementById("bakeryContactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("contactName");
    const phoneInput = document.getElementById("contactPhone");
    const occasionSelect = document.getElementById("contactOccasion");
    const messageInput = document.getElementById("contactMessage");

    const name = nameInput?.value.trim() || "";
    const phone = phoneInput?.value.trim() || "";
    const occasion = occasionSelect?.value || "General Inquiry";
    const userMessage = messageInput?.value.trim() || "";

    if (!name) {
      showToast("Please enter your name.");
      nameInput?.focus();
      return;
    }

    if (!phone) {
      showToast("Please enter your contact phone number.");
      phoneInput?.focus();
      return;
    }

    // Build the formatted inquiry for WhatsApp
    const formattedMessage = 
      `*New Inquiry from Bakery Website*\n` +
      `👤 *Name:* ${name}\n` +
      `📞 *Phone:* ${phone}\n` +
      `🎂 *Occasion / Type:* ${occasion}\n` +
      `💬 *Note:* ${userMessage || "Please share availability and current menu."}`;

    // Prompt user and open WhatsApp directly with their details
    showToast("Opening WhatsApp with your inquiry details...", 3000);
    setTimeout(() => {
      openWhatsAppMessage(formattedMessage);
      form.reset();
    }, 600);
  });
}

// ----------------------------------------------------------------------------
// 11. Image Fallback Handling (Resilience against network failures)
// ----------------------------------------------------------------------------
function initImageFallbacks() {
  const allImages = document.querySelectorAll("img");
  allImages.forEach((img) => {
    img.addEventListener("error", () => {
      // Create a clean aesthetic placeholder background if external image fails
      img.style.display = "none";
      const parent = img.parentElement;
      if (parent && !parent.querySelector(".img-fallback-box")) {
        const fallbackBox = document.createElement("div");
        fallbackBox.className = "img-fallback-box";
        fallbackBox.style.width = "100%";
        fallbackBox.style.height = "100%";
        fallbackBox.style.display = "flex";
        fallbackBox.style.flexDirection = "column";
        fallbackBox.style.alignItems = "center";
        fallbackBox.style.justifyContent = "center";
        fallbackBox.style.backgroundColor = "var(--color-peach-light)";
        fallbackBox.style.color = "var(--color-chocolate)";
        fallbackBox.style.padding = "1rem";
        fallbackBox.style.textAlign = "center";
        fallbackBox.style.fontFamily = "var(--font-serif)";
        fallbackBox.innerHTML = `
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-caramel); margin-bottom:0.5rem;">
            <path d="M12 2a9 9 0 0 1 9 9c0 3.1-1.6 5.8-4 7.4V21a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-2.6C4.6 16.8 3 14.1 3 11a9 9 0 0 1 9-9z"></path>
            <path d="M9 10h.01"></path>
            <path d="M15 10h.01"></path>
            <path d="M9.5 15a3.5 3.5 0 0 0 5 0"></path>
          </svg>
          <span style="font-weight:600; font-size:0.95rem;">${img.alt || 'Maison Dorée'}</span>
          <span style="font-size:0.75rem; color:var(--color-text-muted); font-family:var(--font-sans); margin-top:0.25rem;">Artisanal Bakery</span>
        `;
        parent.appendChild(fallbackBox);
      }
    });
  });
}
