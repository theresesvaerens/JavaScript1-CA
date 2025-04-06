const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    console.error("Product ID not found in URL.");
    return;
  }

  const product = products.find(p => p.id == productId);

  if (!product) {
    console.error("Product not found in product list.");
    return;
  }

  
  const productImg = document.querySelector(".product-img img");
  const productTitle = document.querySelector(".product-info .title");
  const productRating = document.querySelector(".product-info .rating span");
  const productPrice = document.querySelector(".product-info .price");
  const productDescription = document.querySelector(".product-info .description");

  if (productImg) {
    productImg.src = product.image;
    productImg.alt = product.title;
  }

  if (productTitle) productTitle.textContent = product.title;
  if (productRating) productRating.textContent = `${product.rating}/10`;
  if (productPrice) productPrice.textContent = `${product.price} NOK`;
  if (productDescription) productDescription.textContent = product.description;
});