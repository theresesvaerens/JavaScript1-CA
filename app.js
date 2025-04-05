fetch('squareeyes.json')  
  .then(response => response.json())  
  .then(data => {
    renderProducts(data.data);  
  })
  .catch(error => console.error('Error fetching data:', error));

function renderProducts(products) {
  const productContainer = document.getElementById('product-list'); 

  products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('product'); 

    
    productElement.innerHTML = `
      <img src="${product.image.url}" alt="${product.image.alt}">  <!-- Bruker image.url og image.alt -->
      <h2>${product.title}</h2>  <!-- Bruker product.title for tittelen -->
      <p>${product.description}</p>  <!-- Beskrivelse av filmen -->
      <span>$${product.price}</span>  <!-- Prisen på filmen -->
      <span class="discounted-price">$${product.discountedPrice}</span>  <!-- Rabattpris -->
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