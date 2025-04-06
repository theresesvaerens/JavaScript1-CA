const productContainer = document.querySelector(".product-list");
const isProductPage = document.querySelector(".product-details");
const isCheckoutPage = document.querySelector(".cart");

if (productContainer) {
    displayProducts();
} else if (isProductPage) {
    displayProduct();
} else if (isCheckoutPage) {
    displayCart();
}

function displayProducts() {
    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("productCard");
        productCard.innerHTML = `
            <a href="product.html?id=${product.id}">
                <div class="img-box">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <h2 class="product-title">${product.title}</h2>
            </a>
            <div class="price-and-cart">
                <span class="price">${product.price} NOK</span>
                <i class="fa-solid fa-cart-shopping add-cart"></i>
            </div>
        `;
        productContainer.appendChild(productCard);
    });
}

function displayProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        const product = products.find(p => p.id == productId);

        if (product) {
            const titleE1 = document.querySelector(".title");
            const priceE1 = document.querySelector(".price");
            const descriptionE1 = document.querySelector(".description"); 
            const image = document.querySelector(".product-img img"); 
            const ratingE1 = document.querySelector(".rating span");

            titleE1.textContent = product.title;
            priceE1.textContent = `${product.price} NOK`;
            descriptionE1.textContent = product.description;
            image.src = product.image; 
            image.alt = product.title;
            ratingE1.textContent = product.rating; 

            const addToCartBtn = document.querySelector("#add-cart-btn");
            addToCartBtn.addEventListener("click", () => {
                addToCart(product); 
            });
        }
    }
}

function addToCart(product) {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || []; 
    
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1; 
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image, 
            quantity: 1
        });
    }

    sessionStorage.setItem("cart", JSON.stringify(cart));
    updateCartItemCount();
}

function updateCartItemCount() {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0); 
    const cartItemCountElem = document.querySelector(".cart-item-count");
    if (cartItemCountElem) {
        cartItemCountElem.textContent = cartItemCount; 
    }
}

window.addEventListener("DOMContentLoaded", updateCartItemCount);

function displayCart() {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const cartItemsContainer = document.querySelector(".cart-items");
    const subtotalElem = document.querySelector(".cart-total .subtotal");
    const grandtotalElem = document.querySelector(".cart-total .grandtotal");

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty</p>";
        if (subtotalElem) subtotalElem.textContent = "NOK 0";
        if (grandtotalElem) grandtotalElem.textContent = "NOK 0";
        return;
    }

    let subtotal = 0;
    cart.forEach((item, index) => {
        const priceNumber = parseFloat(item.price.toString().replace(/[^\d.]/g, ""));
        const itemTotal = priceNumber * item.quantity;
        subtotal += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <div class="product">
                <img src="${item.image}" alt="${item.title}">
                <div class="item-detail">
                    <p>${item.title}</p>
                </div>
            </div>
            <span class="price">${item.price}</span>
            <div class="quantity">
                <input type="number" value="${item.quantity}" min="1" data-index="${index}">
            </div>
            <span class="total-price">${itemTotal.toFixed(2)} NOK</span>
            <button class="remove" data-index="${index}">
                <i class="fa-solid fa-trash cart-remove"></i>
            </button>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    if (subtotalElem) subtotalElem.textContent = "NOK " + subtotal.toFixed(2);

    
    document.querySelectorAll(".quantity input").forEach(input => {
        input.addEventListener("change", (e) => {
            const index = e.target.dataset.index;
            const newQuantity = parseInt(e.target.value);

            if (newQuantity > 0) {
                cart[index].quantity = newQuantity;
                sessionStorage.setItem("cart", JSON.stringify(cart));
                displayCart(); 
            }
        });
    });

    
    document.querySelectorAll(".remove").forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.target.closest('button').dataset.index;
            cart.splice(index, 1); 
            sessionStorage.setItem("cart", JSON.stringify(cart));
            displayCart(); 
        });
    });
}
