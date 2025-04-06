const productContainer = document.querySelector(".product-list");
const isProductPage = document.querySelector(".product-details");


if (productContainer) {
    displayProducts();
} else if (isProductPage) {
    displayProduct();
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
            addToCartBtn.addEventListener("click", function () {
                alert(`${product.title} added to the cart.`);
            });
        }
    }
}
