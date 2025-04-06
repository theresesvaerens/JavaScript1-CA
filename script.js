const productContainer = document.querySelector(".product-list");

if (productContainer) {
    displayProducts();
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

window.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        const product = products.find(p => p.id == productId);
        
        if (product) {
            document.querySelector(".product-img img").src = product.image;
            document.querySelector(".product-img img").alt = product.title;
            document.querySelector(".product-info .title").textContent = product.title;
            document.querySelector(".product-info .price").textContent = `${product.price} NOK`;
            document.querySelector(".product-info .description").textContent = product.description;
        }
    }
});
