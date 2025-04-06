const productContainer = document.querySelector(".product-list");

if (productContainer) {
    displayProducts ();
}

function displayProducts() {
    products.forEach(product =>{
        const productCard = document.createElement("div");
        productCard.classList.add("productCard");
        productCard.innerHTML = `
            <a href="product${product.id}.html"> 
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

        const imgBox = productCard.querySelector(".img-box");
        imgBox.addEventListener("click", () => {
            sessionStorage.setItem("selectedProduct", JSON.stringify(product));
            window.location.href = "product.html";
        });
    });
}

