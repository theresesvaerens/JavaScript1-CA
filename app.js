document.addEventListener('DOMContentLoaded', () => {
    fetch('squareeyes.json')
      .then(response => response.json())
      .then(data => {
        renderProducts(data.data);
      })
  });

function renderProducts(products) {
  const productContainer = document.getElementById('product-list');

  products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('product');

    productElement.innerHTML = `
      <img src="${product.image.url}" alt="${product.image.alt}">
      <h2>${product.title}</h2>
      <p>${product.description}</p>
      <p><strong>Pris:</strong> $${product.discountedPrice}
        ${product.onSale && product.discountedPrice < product.price ? 
        `<span class="discounted-price"><s>$${product.price}</s></span>` : ''}
      </p>
      <button>Add to Cart</button>
    `;

    if (product.onSale) {
      const saleLabel = document.createElement('span');
      saleLabel.classList.add('sale-label');
      saleLabel.innerText = 'On Sale!';
      productElement.appendChild(saleLabel);
    }

    productContainer.appendChild(productElement);
  });
}