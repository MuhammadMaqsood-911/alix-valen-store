/* ALIX VALEN — frontend demo. Edit CATEGORIES, PRODUCTS and CONTACT-related text here. */
"use strict";

const CATEGORIES = [
  { name: "Trousers", count: "120+ items", img: "assets/images/cat-trousers.jpg", alt: "Trousers hanging on a rail" },
  { name: "Shirts", count: "150+ items", img: "assets/images/cat-shirts.jpg", alt: "Shirts hanging in soft colours" },
  { name: "Jackets", count: "70+ items", img: "assets/images/cat-jackets.jpg", alt: "Folded leather and padded jackets" },
  { name: "Coats", count: "40+ items", img: "assets/images/cat-coats.jpg", alt: "Tailored coat on a mannequin" },
  { name: "Hoodies", count: "60+ items", img: "assets/images/cat-hoodies.jpg", alt: "Black hoodie on a hanger" },
  { name: "T-shirts", count: "110+ items", img: "assets/images/cat-tshirts.jpg", alt: "T-shirts on a clothing rail" }
];

const PRODUCTS = [
  { id: 1, group: "new", cat: "Trousers", name: "Straight Fit Trouser", price: 2299, img: "assets/images/new-1.jpg", alt: "Black straight-fit trousers with white sneakers", colors: [["Black", "#111111"], ["Burgundy", "#7a2e35"], ["Off white", "#f2efe7"]], desc: "Pleated straight-leg trousers in a soft, structured fabric with a clean drape." },
  { id: 2, group: "new", cat: "Jackets", name: "Lightweight Jacket", price: 3499, img: "assets/images/new-2.jpg", alt: "Dark blue denim jacket with a tan collar on a hanger", colors: [["Indigo", "#1f2f55"], ["Black", "#111111"], ["Navy", "#2a3a6b"]], desc: "A dark denim jacket with a contrast collar, made to layer through every season." },
  { id: 3, group: "new", cat: "T-shirts", name: "Oversized T-Shirt", price: 1499, img: "assets/images/new-3.jpg", alt: "Man wearing an oversized black T-shirt and sunglasses", colors: [["Black", "#111111"], ["Slate blue", "#4a6fa5"], ["White", "#f5f5f5"]], desc: "Heavyweight cotton tee with a relaxed, boxy fit and dropped shoulders." },
  { id: 4, group: "new", cat: "Trousers", name: "Cargo Pant", price: 2999, img: "assets/images/new-4.jpg", alt: "Olive-green cargo trousers with sneakers", colors: [["Black", "#111111"], ["Olive", "#2f4a2a"], ["Stone", "#e8e4d8"]], desc: "Relaxed cargo trousers in olive twill with roomy utility pockets." },
  { id: 5, group: "best", cat: "Hoodies", name: "Essential Hoodie", price: 2699, img: "assets/images/best-1.jpg", alt: "Man wearing a white hoodie", colors: [["Navy", "#1e2a5a"], ["Blue", "#3a55b0"], ["White", "#f5f5f5"]], desc: "A brushed-back cotton hoodie with a clean hood and a comfortable everyday fit." },
  { id: 6, group: "best", cat: "Coats", name: "Long Coat", price: 4099, img: "assets/images/best-2.jpg", alt: "Man wearing a tailored brown long coat", colors: [["Black", "#111111"], ["Plum", "#4a1f3d"], ["Navy", "#243a7a"]], desc: "A tailored long coat with a notch lapel, cut to sit over knitwear and shirts." },
  { id: 7, group: "best", cat: "Shirts", name: "Line Shirt", price: 1199, img: "assets/images/best-3.jpg", alt: "Man wearing a neutral striped shirt", colors: [["Sage", "#5b7a52"], ["Sky", "#7fa0c9"], ["Cream", "#f2efe7"]], desc: "A lightweight striped shirt in a soft neutral palette with a relaxed collar." },
  { id: 8, group: "best", cat: "Trousers", name: "Relaxed Fit Jeans", price: 2000, img: "assets/images/best-4.jpg", alt: "Model wearing relaxed-fit light blue jeans", colors: [["Black", "#111111"], ["Forest", "#1f4a2a"], ["Ice", "#dfe9f2"]], desc: "Light-wash jeans with a relaxed leg and a slightly cropped hem." }
];

const ICON_HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.5-4.6-9-9.5C2 7 4.2 4.5 7 4.5c2 0 3.6 1.2 5 3 1.4-1.8 3-3 5-3 2.8 0 5 2.5 4 6C19.5 15.4 12 20 12 20Z"/></svg>';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => "₹" + n.toLocaleString("en-IN");
const byId = id => PRODUCTS.find(p => p.id === Number(id));

const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } }
};

const state = {
  query: "", category: "",
  cart: store.get("av_cart", []),      // [{id, color, qty}]
  wish: store.get("av_wish", [])       // [id]
};

/* ---------- toast ---------- */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}

/* ---------- products ---------- */
function cardHTML(p) {
  const wished = state.wish.includes(p.id);
  return `<article class="card">
    <div class="card-media">
      <button class="card-img" data-open="${p.id}" aria-label="View details for ${p.name}"><img src="${p.img}" alt="${p.alt}" loading="lazy" width="350" height="350"></button>
      <button class="wish" data-wish="${p.id}" aria-pressed="${wished}" aria-label="${wished ? "Remove" : "Add"} ${p.name} ${wished ? "from" : "to"} wishlist">${ICON_HEART}</button>
      <button class="quick" data-add="${p.id}">ADD TO CART</button>
    </div>
    <h3><button data-open="${p.id}">${p.name}</button></h3>
    <p class="price">${fmt(p.price)}</p>
    <ul class="swatches" aria-label="Available colours">${p.colors.map(c => `<li style="background:${c[1]}" title="${c[0]}"></li>`).join("")}</ul>
  </article>`;
}

function matches(p) {
  const q = state.query.trim().toLowerCase();
  return (!state.category || p.cat === state.category) && (!q || p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q));
}

let lastEmptyAnnounce = "";
function renderProducts() {
  let total = 0;
  [["new", "#gridNew", "#new-arrivals"], ["best", "#gridBest", "#best-sellers"]].forEach(([g, grid, sec]) => {
    const list = PRODUCTS.filter(p => p.group === g && matches(p));
    total += list.length;
    $(grid).innerHTML = list.map(cardHTML).join("");
    $(sec).hidden = list.length === 0;
  });
  const none = $("#noResults"), note = $("#filterNote");
  none.hidden = total > 0;
  if (!total) {
    none.innerHTML = `No products match “${state.query || state.category}”. <button class="link-btn" data-reset>Clear search and filters</button>`;
    if (lastEmptyAnnounce !== state.query + state.category) toast("No products found");
    lastEmptyAnnounce = state.query + state.category;
  } else lastEmptyAnnounce = "";
  const active = state.query || state.category;
  note.hidden = !active;
  note.innerHTML = active ? `Showing ${total} product${total === 1 ? "" : "s"}${state.category ? ` in ${state.category}` : ""}${state.query ? ` for “${state.query}”` : ""}. <button class="link-btn" data-reset>Show all products</button>` : "";
  $$("#catList .cat").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.cat === state.category)));
}

function renderCategories() {
  $("#catList").innerHTML = CATEGORIES.map(c => `<li><button class="cat" data-cat="${c.name}" aria-pressed="false" aria-label="Show ${c.name}">
    <span class="ring"><img src="${c.img}" alt="${c.alt}" loading="lazy"></span><strong>${c.name}</strong><small>${c.count}</small></button></li>`).join("");
}

function resetFilters() {
  state.query = ""; state.category = "";
  $("#searchInput").value = "";
  renderProducts();
}

/* ---------- cart ---------- */
const cartCount = () => state.cart.reduce((n, i) => n + i.qty, 0);
const cartTotal = () => state.cart.reduce((n, i) => n + byId(i.id).price * i.qty, 0);

function saveCart() { store.set("av_cart", state.cart); renderCart(); }

function addToCart(id, qty = 1, color) {
  const p = byId(id); if (!p) return;
  color = color || p.colors[0][0];
  const line = state.cart.find(i => i.id === p.id && i.color === color);
  if (line) line.qty += qty; else state.cart.push({ id: p.id, color, qty });
  saveCart();
  toast(`${p.name} added to cart`);
}

function renderCart() {
  const n = cartCount(), badge = $("#cartBadge");
  badge.hidden = n === 0; badge.textContent = n;
  const body = $("#cartBody"), foot = $("#cartFoot");
  if (!state.cart.length) { body.innerHTML = '<p class="empty">Your bag is empty. Add something you like.</p>'; foot.innerHTML = ""; return; }
  body.innerHTML = state.cart.map((i, idx) => {
    const p = byId(i.id);
    return `<div class="line"><img src="${p.img}" alt="${p.alt}">
      <div><h3>${p.name}</h3><p>${i.color} · ${fmt(p.price)}</p>
      <div class="qty"><button data-dec="${idx}" aria-label="Decrease quantity of ${p.name}">−</button><span aria-live="polite">${i.qty}</span><button data-inc="${idx}" aria-label="Increase quantity of ${p.name}">+</button></div>
      <div><button class="rm" data-rm="${idx}" aria-label="Remove ${p.name} from bag">Remove</button></div></div>
      <strong>${fmt(p.price * i.qty)}</strong></div>`;
  }).join("");
  foot.innerHTML = `<div class="row-total"><span>Total</span><span>${fmt(cartTotal())}</span></div>
    <button class="btn" data-checkout style="width:100%;justify-content:center">CHECKOUT (DEMO)</button>`;
}

/* ---------- wishlist ---------- */
function toggleWish(id) {
  const p = byId(id), i = state.wish.indexOf(p.id);
  if (i > -1) { state.wish.splice(i, 1); toast(`${p.name} removed from wishlist`); }
  else { state.wish.push(p.id); toast(`${p.name} saved to wishlist`); }
  store.set("av_wish", state.wish);
  renderWish(); renderProducts();
  if ($("#productModal").open) renderModal(p.id, currentModal.color, currentModal.qty);
}

function renderWish() {
  const b = $("#wishBadge"); b.hidden = !state.wish.length; b.textContent = state.wish.length;
  $("#wishBody").innerHTML = state.wish.length ? state.wish.map(id => {
    const p = byId(id);
    return `<div class="line"><img src="${p.img}" alt="${p.alt}"><div><h3>${p.name}</h3><p>${fmt(p.price)}</p>
      <button class="rm" data-open="${p.id}">View</button> <button class="rm" data-add="${p.id}">Add to cart</button> <button class="rm" data-wish="${p.id}" aria-label="Remove ${p.name} from wishlist">Remove</button></div><span></span></div>`;
  }).join("") : '<p class="empty">No saved items yet. Tap the heart on any product.</p>';
}

/* ---------- product modal ---------- */
let currentModal = { id: null, color: null, qty: 1 };
function renderModal(id, color, qty) {
  const p = byId(id); currentModal = { id: p.id, color: color || p.colors[0][0], qty: qty || 1 };
  const wished = state.wish.includes(p.id);
  $("#pmBody").innerHTML = `<img src="${p.img}" alt="${p.alt}">
    <div class="pm-info"><h2 class="h2" id="pmName">${p.name}</h2><p class="price" style="color:#111">${fmt(p.price)}</p><p>${p.desc}</p>
    <div><p>Colour: <strong style="color:#111">${currentModal.color}</strong></p>
    <div class="swatch-pick">${p.colors.map(c => `<button data-color="${c[0]}" style="background:${c[1]}" aria-label="${c[0]}" aria-pressed="${c[0] === currentModal.color}"></button>`).join("")}</div></div>
    <div class="qty" style="align-self:flex-start"><button data-mdec aria-label="Decrease quantity">−</button><span aria-live="polite">${currentModal.qty}</span><button data-minc aria-label="Increase quantity">+</button></div>
    <button class="btn" data-madd style="justify-content:center">ADD TO CART</button>
    <button class="rm" data-wish="${p.id}" style="align-self:flex-start">${wished ? "Remove from wishlist" : "Save to wishlist"}</button></div>`;
}
function openProduct(id) { renderModal(id); const m = $("#productModal"); if (!m.open) m.showModal(); }

/* ---------- panels ---------- */
function openPanel(id) {
  $$("dialog[open]").forEach(d => d.close());
  $("#" + id).showModal();
}

/* ---------- hero carousel ---------- */
function initHero() {
  const slides = $$("[data-slide]"), dots = $(".dots");
  let i = 0, timer;
  dots.innerHTML = slides.map((_, n) => `<button role="tab" aria-label="Show slide ${n + 1}" aria-selected="${n === 0}" data-dot="${n}"></button>`).join("");
  const go = n => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => { s.classList.toggle("is-active", k === i); s.setAttribute("aria-hidden", String(k !== i)); });
    $$("[data-dot]").forEach((d, k) => d.setAttribute("aria-selected", String(k === i)));
  };
  const start = () => { stop(); if (!matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(() => go(i + 1), 6000); };
  const stop = () => clearInterval(timer);
  dots.addEventListener("click", e => { const d = e.target.closest("[data-dot]"); if (d) { go(+d.dataset.dot); start(); } });
  const hero = $(".hero");
  hero.addEventListener("mouseenter", stop); hero.addEventListener("mouseleave", start);
  hero.addEventListener("focusin", stop); hero.addEventListener("focusout", start);
  go(0); start();
}

/* ---------- newsletter / account ---------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function initForms() {
  $("#nlForm").addEventListener("submit", e => {
    e.preventDefault();
    const v = $("#nlEmail").value.trim(), msg = $("#nlMsg");
    if (!EMAIL_RE.test(v)) { msg.textContent = "Enter a valid email address, like name@example.com."; $("#nlEmail").setAttribute("aria-invalid", "true"); return; }
    $("#nlEmail").removeAttribute("aria-invalid");
    msg.textContent = "Thanks! Demo only: your email was not sent anywhere.";
    toast("Subscription form submitted (demo)");
    e.target.reset();
  });
  $("#accForm").addEventListener("submit", e => {
    e.preventDefault();
    const em = $("#accEmail").value.trim();
    if (em && !EMAIL_RE.test(em)) { toast("Enter a valid email address"); return; }
    $("#accountModal").close();
    toast(`Welcome, ${$("#accName").value.trim() || "guest"} (demo, no sign-in)`);
  });
}

/* ---------- global events (delegated) ---------- */
function scrollToId(id) { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }

document.addEventListener("click", e => {
  const t = e.target;
  const q = sel => t.closest(sel);
  let el;
  if ((el = q("[data-cat]"))) {
    state.category = state.category === el.dataset.cat ? "" : el.dataset.cat;
    renderProducts();
    if (state.category) scrollToId("filterNote");
  } else if ((el = q("[data-reset]"))) { resetFilters(); $("#mainNav").classList.remove("open"); }
  else if ((el = q("[data-open]"))) { $("#wishDrawer").close(); openProduct(el.dataset.open); }
  else if ((el = q("[data-wish]"))) toggleWish(el.dataset.wish);
  else if ((el = q("[data-add]"))) { addToCart(el.dataset.add); }
  else if ((el = q("[data-open-panel]"))) openPanel(el.dataset.openPanel);
  else if (q("[data-close]")) q("dialog").close();
  else if ((el = q("[data-inc]"))) { state.cart[el.dataset.inc].qty++; saveCart(); }
  else if ((el = q("[data-dec]"))) { const l = state.cart[el.dataset.dec]; l.qty = Math.max(1, l.qty - 1); saveCart(); }
  else if ((el = q("[data-rm]"))) { state.cart.splice(el.dataset.rm, 1); saveCart(); toast("Item removed from bag"); }
  else if (q("[data-checkout]")) toast("Checkout is a frontend demo only");
  else if ((el = q("[data-color]"))) renderModal(currentModal.id, el.dataset.color, currentModal.qty);
  else if (q("[data-minc]")) renderModal(currentModal.id, currentModal.color, currentModal.qty + 1);
  else if (q("[data-mdec]")) renderModal(currentModal.id, currentModal.color, Math.max(1, currentModal.qty - 1));
  else if (q("[data-madd]")) addToCart(currentModal.id, currentModal.qty, currentModal.color);
  else if ((el = q("[data-viewall]"))) { resetFilters(); scrollToId(el.dataset.viewall); }
  else if (q("[data-social]")) { e.preventDefault(); toast("Add your real social link in index.html"); }
  else if (t.tagName === "DIALOG" && t.open) t.close();   // click on backdrop
  if (q(".main-nav a")) { $("#mainNav").classList.remove("open"); $("#menuBtn").setAttribute("aria-expanded", "false"); }
});

document.addEventListener("error", e => { if (e.target.tagName === "IMG") e.target.classList.add("is-broken"); }, true);

function init() {
  renderCategories(); renderProducts(); renderCart(); renderWish(); initHero(); initForms();
  $("#menuBtn").addEventListener("click", () => {
    const open = $("#mainNav").classList.toggle("open");
    $("#menuBtn").setAttribute("aria-expanded", String(open));
    $("#menuBtn").setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  let st;
  $("#searchForm").addEventListener("submit", e => { e.preventDefault(); scrollToId("new-arrivals"); });
  $("#searchInput").addEventListener("input", e => {
    clearTimeout(st);
    st = setTimeout(() => { state.query = e.target.value; renderProducts(); }, 200);
  });
  $("#searchInput").addEventListener("keydown", e => { if (e.key === "Escape") resetFilters(); });
}
init();
