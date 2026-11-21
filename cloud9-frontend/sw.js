const CACHE_NAME = "cloud9-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/contact.html",
  "/about.html",
  '/manifest.json',
  '/sw.js',
  '/cloud9.mp4', // Your video file
  '/LOGO1.jpg', // Your logo
  '/gpay.jpg', // Your QR code
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600&family=Great+Vibes&display=swap'
    // Add paths to other essential pages (pastries.html, about.html, contact.html) and images here

];

// Install - cache STATIC ONLY
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch - safe network strategy
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // ❌ DO NOT CACHE chrome-extension://
  if (url.protocol === "chrome-extension:") return;

  // ❌ DO NOT CACHE POST / PUT / DELETE etc.
  if (req.method !== "GET") return;

  // ❌ DO NOT CACHE CROSS-ORIGIN FILES (fonts, CDN, Cloudflare redirect)
  if (url.origin !== location.origin) return;

  // SAFE CACHE STRATEGY
  event.respondWith(
    caches.match(req).then((cached) => {
      return (
        cached ||
        fetch(req).then((networkResponse) => {
          // ❌ Do NOT cache redirect responses
          if (networkResponse.redirected) return networkResponse;

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, networkResponse.clone());
          });

          return networkResponse;
        })
      );
    })
  );
});





/* =========================
   VARIANT POPUP OVERLAY
========================= */
.variant-popup {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

/* =========================
   MAIN POPUP BOX
========================= */
.variant-box {
    background: #fbece3;
    width: 92%;
    max-width: 420px;
    border-radius: 16px;
    padding: 18px;
    animation: popupSlide 0.3s ease;
}

/* =========================
   PRODUCT TITLE
========================= */
#variant-title {
    font-size: 24px;
    font-family:Georgia, 'Times New Roman', Times, serif;
    font-weight: 600;
    margin-bottom: 14px;
    text-align: left;
}

/* =========================
   VARIANT LIST
========================= */
#variant-options {
    display: grid;
    grid-template-columns: 1fr 1fr;   /* 2 cards per row */
    gap: 12px;
}

/* =========================
   VARIANT CARD
========================= */
.variant-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: 12px;
    border: 2px solid #eee;
    background: #fff;
    cursor: pointer;
    transition: all 0.25s ease;
}

/* IMAGE INSIDE CARD */
.variant-btn img {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 10px;
}

/* TEXT INSIDE CARD */
.variant-info {
    text-align: left;
}

.variant-info .variant-label {
    font-size: 16px;
    font-weight: 600;
    color: #e0885f;
}

.variant-info .variant-price {
    font-size: 18px;
    color: #70351a;
    font-weight: 500;
}

/* HOVER & SELECT */
.variant-btn:hover {
    border-color: #6b3f2b;
    background: rgba(124, 71, 47, 0.05);
}

.variant-btn.active {
    border-color: #6b3f2b;
    background: #6b3f2b;
    color: #fff;
}

.variant-btn.active .variant-price,
.variant-btn.active .variant-label {
    color: #fff;
}

/* =========================
   CLOSE BUTTON
========================= */
.close-variant {
    width: 100%;
    margin-top: 16px;
    padding: 10px;
    border-radius: 10px;
    border: none;
    background: #f3a161;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
}

.close-variant:hover {
    background: #e88851;
    color: #fff;
}

/* =========================
   ANIMATION
========================= */
@keyframes popupSlide {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

