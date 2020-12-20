let cart = [];
let buttonsDOM = [];

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
 * Menambahkan product kedalam cart.
 *
 * @returns void.
 */
function getBagButtons() {
  const buttons = [...document.querySelectorAll(".bag-btn")];

  buttonsDOM = buttons;

  // Iterasi list Element buttons
  buttons.forEach((button) => {
    // Ambil id dari dataset button
    let id = button.dataset.id;

    // Cek jika id dari button terdapat pada list cart
    let inCart = cart.find((item) => item.id === id);

    // Jika ketemu ubah inner text dari add to bag
    // menjadi In Cart, dan disable button tersebut
    if (inCart) {
      button.innerText = "In Cart";
      button.disabled = true;
    }
    // Menambahkan event yang akan listen pada
    // click event dari button
    button.addEventListener("click", (evt) => {
      // Jika button ter-click maka jalankan operasi dibawah ini

      // Ubah inner text dari button dari add to bag menjadi In Cart
      evt.target.innerText = "In Cart";

      // Disable button dengan set value disabled menjadi true
      evt.target.disabled = true;

      // Ambil product berdasarkan id
      let productItem = { ...getProduct(id), amount: 1 };

      // Simpan product item kedalam list cart
      cart = [...cart, productItem];

      // Simpan list cart ke local storage
      saveCart(cart);

      // Tetapkan total harga di cart
      setCartValue(cart);

      // Menambahkan product item ke cart item.
      addCartItem(productItem);

      // // Menampilkan cart
      // showCart();
    });
  });
}

/**
 * Menyimpan data product kedalam local storage
 * @param {*} product - Product object yang akan disimpan.
 * @returns void.
 */
function saveProduct(product) {
  localStorage.setItem("products", JSON.stringify(product));
}

/**
 * Mengambil product berdasarkan id yang diberikan
 *
 * @param {*} id - Product id yang akan diambil.
 *
 * @returns Product object.
 */
function getProduct(id) {
  // Parse JSON String data dari localstorage dengan key "products"
  let products = JSON.parse(localStorage.getItem("products"));
  // Kembalikan product dari list product berdasarkan id yang
  // diberikan dari argument.
  return products.find((product) => product.id === id);
}

/**
 * Simpan data cart kedalam local storage
 * @param {*} cart - Cart object yang akan disimpan.
 * @returns void.
 */
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Menetapkan total dari cart berdasarkan amount dan price dari product.
 * @param {*} cart - Cart object yang akan disimpan.
 * @returns void.
 */
function setCartValue(cart) {
  // Deklarasi variable tempTotal dan itemsTotal
  let tempTotal = 0;
  let itemsTotal = 0;

  // iterasi element yang ada pada list cart
  // tiap iterasi akan menetapkan nilai dari
  // tempTotal dan itemsTotal.
  cart.map((item) => {
    tempTotal += item.price * item.amount;
    itemsTotal += item.amount;
  });

  // Ubah inner text dari class cart-items menjadi nilai dari variable tempTotal.
  document.querySelector(".cart-total").innerText = formatPriceToRupiah(
    tempTotal
  );

  // Ubah inner text dari class cart-total menjadi nilai dari variable itemsTotal.
  document.querySelector(".cart-items").innerText = itemsTotal;
}

/**
 * Menambahkan product item ke cart.
 * @param {*} item - Product item yang ditambahkan ke cart
 * @returns void.
 */
function addCartItem(item) {
  const div = document.createElement("div");
  div.classList.add("cart-item");
  div.innerHTML = ` 
    <img src=${item.image} alt="cart-product" />
    <div>
      <h4>${item.title}</h4>
      <h5>${formatPriceToRupiah(item.price)}</h5>
      <span class="remove-item" data-id=${item.id}>remove</span>
    </div>
    <div>
      <i class="fas fa-chevron-up" data-id=${item.id}></i>
      <p class="item-amount">${item.amount}</p>
      <i class="fas fa-chevron-down" data-id=${item.id}></i>
    </div>`;

  document.querySelector(".cart-content").appendChild(div);
}

/**
 * Menampilkan cart
 * @returns void.
 */
function showCart() {
  document.querySelector(".cart-overlay").classList.add("transparentBcg");
  document.querySelector(".cart").classList.add("showCart");
}

document.addEventListener("DOMContentLoaded", () => {
  getProducts("products.json")
    .then((v) => {
      displayProducts(v);
      saveProduct(v);
    })
    // Setelah displayProducts dan saveProduct
    // function dijalankan, maka panggil function
    // getBagButtons
    .then(() => {
      getBagButtons();
    });
});
