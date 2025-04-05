document.addEventListener("DOMContentLoaded", () => {
    const bar = document.getElementById("bar");
    const close = document.getElementById("close");
    const nav = document.getElementById("navbar");

    if (bar) {
        bar.addEventListener("click", () => {
            nav.classList.add("active");
        });
    }

    if (close) {
        close.addEventListener("click", () => {
            nav.classList.remove("active");
        });
    }

    const cartIcon = document.getElementById("cart");
    const cart = document.querySelector(".cart");
    const cartClose = document.querySelector("#cart-close");

    cartIcon.addEventListener("click", () => cart.classList.add("active"));
    cartClose.addEventListener("click", () => cart.classList.remove("active"));

    const addCartButtons = document.querySelectorAll(".add-cart");
    const cartContent = document.querySelector(".cart-content");
    let cartItemCount = 0;

    addCartButtons.forEach(button => {
        button.addEventListener("click", event => {
            const productBox = event.target.closest(".product-box");
            addToCart(productBox);
        });
    });

    const addToCart = productBox => {
        const productImgScr = productBox.querySelector("img").src;
        const productTitle = productBox.querySelector(".product-title").textContent;
        const productPrice = productBox.querySelector(".price").textContent;

        
        const cartItems = cartContent.querySelectorAll(".cart-product-title");
        for (let item of cartItems) {
            if (item.textContent === productTitle) {
                alert("This item is already in the cart.");
                return;
            }
        }

        const cartBox = document.createElement("div");
        cartBox.classList.add("cart-box");
        cartBox.innerHTML = `
            <img src="${productImgScr}" class="cart-img">
            <div class="cart-detail">
                <h4 class="cart-product-title">${productTitle}</h4>
                <span class="cart-price">${productPrice}</span>
                <div class="cart-quantity">
                    <button class="decrement">-</button>
                    <span class="number">1</span>
                    <button class="increment">+</button>
                </div>
            </div>
            <i class="fa-solid fa-trash cart-remove"></i>
        `;

        cartContent.appendChild(cartBox);

       
        cartBox.querySelector(".cart-remove").addEventListener("click", () => {
            cartBox.remove();
            updateCartCount(-1);
            updateTotalPrice();
        });

        
        const quantityElement = cartBox.querySelector(".number");
        const decrementBtn = cartBox.querySelector(".decrement");
        const incrementBtn = cartBox.querySelector(".increment");

        decrementBtn.addEventListener("click", () => {
            let quantity = parseInt(quantityElement.textContent);
            if (quantity > 1) {
                quantity--;
                quantityElement.textContent = quantity;
                updateTotalPrice();
            }
        });

        incrementBtn.addEventListener("click", () => {
            let quantity = parseInt(quantityElement.textContent);
            quantity++;
            quantityElement.textContent = quantity;
            updateTotalPrice();
        });

        updateCartCount(1);
        updateTotalPrice();
    };

    const updateTotalPrice = () => {
        const totalPriceElement = document.querySelector(".total-price");
        const cartBoxes = cartContent.querySelectorAll(".cart-box");
        let total = 0;

        cartBoxes.forEach(cartBox => {
            const priceElement = cartBox.querySelector(".cart-price");
            const quantityElement = cartBox.querySelector(".number");

            
            const price = parseFloat(priceElement.textContent.replace("NOK", "").trim());
            const quantity = parseInt(quantityElement.textContent);
            total += price * quantity;
        });

        totalPriceElement.textContent = `${total.toFixed(2)} NOK`;
    };

    const updateCartCount = change => {
        const cartItemCountBadge = document.querySelector(".cart-item-count");
        cartItemCount += change;

        if (cartItemCount > 0) {
            cartItemCountBadge.style.visibility = "visible";
            cartItemCountBadge.textContent = cartItemCount;
        } else {
            cartItemCountBadge.style.visibility = "hidden";
            cartItemCountBadge.textContent = "";
        }
    };

    const buyNowButton = document.querySelector(".btn-buy");
    if (buyNowButton) {
        buyNowButton.addEventListener("click", () => {
            const cartBoxes = cartContent.querySelectorAll(".cart-box");
            if (cartBoxes.length === 0) {
                alert("You cart is empty. Please add items to your cart before buying.");
                return;
            }

            cartBoxes.forEach(cartBox => cartBox.remove());
            cartItemCount = 0;
            updateCartCount(0);
            updateTotalPrice();

            alert("Tank you for your purchase! You can watch the movie on your profile right away");
        });
    }
});
