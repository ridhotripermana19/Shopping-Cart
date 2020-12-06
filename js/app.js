/**
 * Mengambil data product berdasarkan url yang diberikan.
 *
 * @param {*} url - Url dari data yang akan diambil.
 * @returns JSON Object.
 */
async function getProducts(url) {
  try {
    // Fetch data dari argument url
    let response = await fetch(url);

    // Parse response data yang didapat
    // kedalam json format.
    let result = await response.json();

    // Ambil items property dari result
    let products = result.items;

    // Dekonstruk products
    return products.map((item) => {
      const { title, price } = item.fields;
      const { id } = item.sys;
      const image = item.fields.image.fields.file.url;
      return { title, price, id, image };
    });
    // Catch global error
  } catch (e) {
    throw e;
  }
}

/**
 * Memformat data price dari Product Object kedalam Rupiah Currency.
 *
 * @param {*} price - Data number price dari product.
 * @returns String.
 */
function formatPriceToRupiah(price) {
  // Parse data price berupa number ke String.
  let priceStr = price.toString();

  // Switch case berdasarkan panjang string dari price
  switch (priceStr.length) {
    // Jika length dari price dalam bentuk string 5 (belasan ribu)
    case 5:
      return `Rp ${priceStr.slice(0, 2)}.${priceStr.charAt(2)}00`;

    // Jika length dari price dalam bentuk string 6 (ratusan ribu)
    case 6:
      return `Rp ${priceStr.slice(0, 3)}.${priceStr.charAt(3)}00`;
  }
}

/**
 * Menampilkan tiap tiap product dari Array Object Products.
 *
 * @param {*} products - Array Object Products.
 */
function displayProducts(products) {
  let result = "";
  products.forEach((product) => {
    result += `
    <article class="product">
        <div class="img-container">
            <img
                src=${product.image}
                alt="product"
                class="product-img"
            />
            <button class="bag-btn" data-id=${product.id}>
                <i class="fas fa-shopping-cart"></i>
                add to bag
            </button>
        </div>
        <h3>${product.title}</h3>
        <h4>${formatPriceToRupiah(product.price)}</h4>
    </article>
    `;
  });
  document.querySelector(".products-center").innerHTML = result;
}

/**
 * Menyimpan data product kedalam local storage
 * @param {*} product - Product Object yang akan disimpan.
 * @returns void.
 */
function saveProduct(product) {
  localStorage.setItem("products", JSON.stringify(product));
}

document.addEventListener("DOMContentLoaded", () => {
  getProducts("products.json").then((v) => {
    displayProducts(v);
    saveProduct(v);
  });
});
