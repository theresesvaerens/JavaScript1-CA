async function loadFeaturedMovies() {
  const res = await fetch("https://v2.api.noroff.dev/square-eyes");
  const data = await res.json();
  const products = data.data;

  const container = document.querySelector(".product-list");

  products.forEach(product => {
      const item = document.createElement("div");
      item.classList.add("product-item");

      item.innerHTML = `
          <a href="product.html?id=${product.id}">
              <div class="img-box">
                  <img src="${product.image.url}" alt="${product.title}">
              </div>
              <div class="info">
                  <h2 class="title">${product.title}</h2>
                  <p class="price">${product.price} NOK</p>
              </div>
          </a>
      `;

      container.appendChild(item);
  });
}

loadFeaturedMovies();
