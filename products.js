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


const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const imgElem = document.getElementById("product-image");
const titleElem = document.getElementById("product-title");
const genreElem = document.getElementById("product-genre");
const ratingElem = document.getElementById("product-rating");
const descriptionElem = document.getElementById("product-description");
const priceElem = document.getElementById("product-price");
const addToCartBtn = document.getElementById("add-to-cart-btn");


async function loadProduct() {
    try {
        const res = await fetch(`https://v2.api.noroff.dev/square-eyes/${id}`);
        const data = await res.json();
        const p = data.data;


        imgElem.src = p.image.url;
        imgElem.alt = p.title;

        titleElem.textContent = p.title;
        genreElem.textContent = `Genre: ${p.genre}`;
        ratingElem.textContent = `Rating: ${p.rating}/10`;

        descriptionElem.textContent = p.description;
        priceElem.textContent = p.price;

    
        addToCartBtn.addEventListener("click", () => {
            addToCart({
                id: p.id,
                title: p.title,
                price: p.price,
                image: p.image.url
            });

            addToCartBtn.textContent = "Added!";
            addToCartBtn.style.background = "#4CAF50";
        });

    } catch (error) {
        console.error("Error loading product:", error);
    }
}

loadProduct();
