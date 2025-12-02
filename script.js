(function () {
    const APP = "APP:";
    const API_BASE = "https://v2.api.noroff.dev/square-eyes";
    const CART_KEY = "cart";
  

    const productContainer = document.querySelector(".product-list");
    const filterTitle = document.getElementById("filter-title");
    const categoryToggle = document.getElementById("category-toggle");
    const categoryList = document.getElementById("category-list");
  
    let products = [];
  

    function log(...args) { console.log(APP, ...args); }
    function err(...args) { console.error(APP, ...args); }
  
    function safeGet(obj, path, fallback = "") {
      try {
        return path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj) ?? fallback;
      } catch (e) {
        return fallback;
      }
    }
  
    function escapeHtml(unsafe = "") {
      return String(unsafe)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }
  

    function getCart() {
      try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
      } catch (e) {
        err("getCart parse error, resetting cart:", e);
        localStorage.removeItem(CART_KEY);
        return [];
      }
    }
  
    function saveCart(cart) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  
    function updateCartItemCount() {
      const cart = getCart();
      const count = cart.reduce((s, it) => s + (it.quantity || 0), 0);
      const badge = document.querySelector(".cart-item-count");
      if (badge) badge.textContent = count;
      log("Cart count updated:", count);
    }
  
    function addToCart(product) {
      if (!product || !product.id) {
        err("addToCart called with invalid product:", product);
        return;
      }
  
      const cart = getCart();
      const existing = cart.find(i => String(i.id) === String(product.id));
  
      if (existing) {
        existing.quantity = (existing.quantity || 0) + (product.quantity || 1);
      } else {
        cart.push({
          id: product.id,
          title: product.title || "",
          price: Number(product.price) || 0,
          image: safeGet(product, "image.url", product.image || ""),
          quantity: product.quantity || 1
        });
      }
  
      saveCart(cart);
      updateCartItemCount();
      log("Product added to cart:", product.id, "Cart size:", cart.length);
    }
  

    async function fetchProducts() {
      if (!productContainer && !categoryList) {
        log("fetchProducts skipped — not on product listing page.");
        return;
      }
  
      try {
        log("Fetching products...");
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        products = data.data || [];
        log("Products fetched:", products.length);
        if (productContainer) renderProducts(products);
        if (categoryList && categoryToggle) setupCategoryFilter();
      } catch (e) {
        err("Failed to fetch products:", e);
        if (productContainer) productContainer.innerHTML = "<p>Kunne ikke laste produkter.</p>";
      }
    }
  
    function renderProducts(list) {
      if (!productContainer) {
        log("renderProducts aborted — .product-list not found.");
        return;
      }
      productContainer.innerHTML = "";
  
      if (!list || list.length === 0) {
        productContainer.innerHTML = "<p>No movies found.</p>";
        return;
      }
  
      list.forEach(product => {
        const imageUrl = safeGet(product, "image.url", "");
        const price = product?.price ?? "N/A";
  
        const item = document.createElement("div");
        item.className = "product-item";
  
        
        item.innerHTML = `
          <a href="product.html?id=${encodeURIComponent(product.id)}">
            <div class="img-box">
              <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(product.title || 'Movie')}">
            </div>
            <div class="info">
              <h2 class="title">${escapeHtml(product.title || '')}</h2>
              <p class="price">${escapeHtml(String(price))} NOK</p>
            </div>
          </a>
        `;
  
        productContainer.appendChild(item);
      });
  
      log("Rendered", list.length, "products.");
    }
  

    function setupCategoryFilter() {
      if (!categoryList || !categoryToggle) {
        log("setupCategoryFilter aborted — elements missing.");
        return;
      }
  
      categoryToggle.addEventListener("click", () => {
        categoryList.classList.toggle("open");
      });
  
      const links = categoryList.querySelectorAll("a[data-genre]");
      if (!links.length) {
        log("No category links found.");
        return;
      }
  
      links.forEach(link => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const selectedGenre = (link.dataset.genre || "all").toLowerCase();
          log("Filter selected:", selectedGenre);
  
          if (filterTitle) {
            filterTitle.textContent = selectedGenre === "all" ? "ALL MOVIES" : selectedGenre.toUpperCase();
          }
  
          const filtered = selectedGenre === "all"
            ? products
            : products.filter(p => (p.genre || "").toLowerCase() === selectedGenre);
  
          renderProducts(filtered);
          categoryList.classList.remove("open");
        });
      });
  
      log("Category filter set up with", links.length, "links.");
    }
  

    async function loadProductAndWireCart() {
     
      if (!document.getElementById("product-title")) {
        log("Not on product page — skipping loadProductAndWireCart.");
        return;
      }
  
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (!id) {
        err("Product page loaded without id in URL.");
        return;
      }
  
      try {
        log("Fetching single product:", id);
        const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const p = data.data;
        if (!p) throw new Error("Product data missing");
  
 
        const imgElem = document.getElementById("product-image");
        const titleElem = document.getElementById("product-title");
        const genreElem = document.getElementById("product-genre");
        const ratingElem = document.getElementById("product-rating");
        const descriptionElem = document.getElementById("product-description");
        const priceElem = document.getElementById("product-price");
        const addToCartBtn = document.getElementById("add-to-cart-btn");
  
        if (imgElem) { imgElem.src = safeGet(p, "image.url", ""); imgElem.alt = p.title || ""; }
        if (titleElem) titleElem.textContent = p.title || "";
        if (genreElem) genreElem.textContent = `Genre: ${p.genre || "-"}`;
        if (ratingElem) ratingElem.textContent = `Rating: ${p.rating ?? "-"} / 10`;
        if (descriptionElem) descriptionElem.textContent = p.description || "";
        if (priceElem) priceElem.textContent = p.price ?? "";
  
        if (addToCartBtn) {
          const productForCart = {
            id: p.id,
            title: p.title,
            price: p.price,
            image: safeGet(p, "image.url", "")
          };
  
     
          const cloned = addToCartBtn.cloneNode(true);
          addToCartBtn.parentNode.replaceChild(cloned, addToCartBtn);
  
          cloned.addEventListener("click", () => {
            addToCart(productForCart);
            cloned.textContent = "Added!";
            cloned.style.background = "#4CAF50";
            setTimeout(() => {
              cloned.textContent = "Add to cart";
              cloned.style.background = "";
            }, 1000);
          });
        }
  
        log("Single product loaded:", p.id);
      } catch (e) {
        err("Error loading product:", e);
      }
    }
  

    function renderCart() {
      const cart = getCart();
      const cartItemsContainer = document.querySelector(".cart-items");
      const subtotalElem = document.querySelector(".cart-total .subtotal");
  
      if (!cartItemsContainer) {
        log("renderCart skipped — .cart-items not found on page.");
        return;
      }
  
      cartItemsContainer.innerHTML = "";
  
      if (!cart || cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty</p>";
        if (subtotalElem) subtotalElem.textContent = "NOK 0";
        return;
      }
  
      let subtotal = 0;
  
      cart.forEach((item, idx) => {
        const priceNumber = Number(item.price) || 0;
        const itemTotal = priceNumber * (item.quantity || 1);
        subtotal += itemTotal;
  
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
  
        cartItem.innerHTML = `
          <div class="product">
            <img src="${escapeHtml(item.image || '')}" alt="${escapeHtml(item.title)}">
            <div class="item-detail"><p>${escapeHtml(item.title)}</p></div>
          </div>
          <span class="price">${escapeHtml(String(item.price))} NOK</span>
          <div class="quantity">
            <input type="number" value="${item.quantity}" min="1" data-index="${idx}">
          </div>
          <span class="total-price">${itemTotal.toFixed(2)} NOK</span>
          <button class="remove" data-index="${idx}">
            <i class="fa-solid fa-trash cart-remove"></i>
          </button>
        `;
  
        cartItemsContainer.appendChild(cartItem);
      });
  
      if (subtotalElem) subtotalElem.textContent = `NOK ${subtotal.toFixed(2)}`;
  

      document.querySelectorAll(".quantity input").forEach(input => {
        input.addEventListener("change", (e) => {
          const index = Number(e.target.dataset.index);
          const newQ = parseInt(e.target.value, 10);
          if (newQ > 0) {
            const cart = getCart();
            cart[index].quantity = newQ;
            saveCart(cart);
            renderCart();
            updateCartItemCount();
          }
        });
      });
  

      document.querySelectorAll(".remove").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const index = Number(e.target.closest("button").dataset.index);
          const cart = getCart();
          cart.splice(index, 1);
          saveCart(cart);
          renderCart();
          updateCartItemCount();
        });
      });
  
      log("Cart rendered. Items:", cart.length, "Subtotal:", subtotal);
    }

    function setupMobileNav() {
      const bar = document.getElementById("bar");
      const nav = document.getElementById("navbar");
      const close = document.getElementById("close");
  
      if (bar && nav) {
        bar.addEventListener("click", () => nav.classList.add("active"));
      }
      if (close && nav) {
        close.addEventListener("click", () => nav.classList.remove("active"));
      }
    }
  

    document.addEventListener("DOMContentLoaded", () => {
      log("Init start");
  
      
      fetchProducts();
  
      setupMobileNav();
  
      updateCartItemCount();
  
     
      if (document.getElementById("product-title")) {
        loadProductAndWireCart();
      }
  
  
      if (document.querySelector(".cart-items")) {
        renderCart();
      }
  
      log("Init complete");
    });
  
  })();
  