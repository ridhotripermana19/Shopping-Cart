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
      return `${priceStr.slice(0, 2)}.${priceStr.charAt(2)}00`;

    // Jika length dari price dalam bentuk string 6 (ratusan ribu)
    case 6:
      return `${priceStr.slice(0, 3)}.${priceStr.charAt(3)}00`;

    // Selain dari case diatas, kembalikan priceStr.
    default:
      return priceStr;
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
                add to cart
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
function getCartButtons() {
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
      let cartItems = { ...getProduct(id), amount: 1 };

      // Simpan cart item kedalam list cart
      cart = [...cart, cartItems];

      // Simpan list cart ke local storage
      saveCart(cart);

      // Tetapkan total harga di cart
      setCartValues(cart);

      // Menambahkan product item ke cart item.
      addCartItem(cartItems);

      // Menampilkan cart
      showCart();
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
function setCartValues(cart) {
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
 * Menambahkan product item ke cart template.
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
 * Menampilkan cart template
 * @returns void.
 */
function showCart() {
  document.querySelector(".cart-overlay").classList.add("transparentBcg");
  document.querySelector(".cart").classList.add("showCart");
}

/**
 * Mengambil data cart yang ada pada local storage.
 * @returns any
 */
function getCart() {
  // Jika key cart di local storage exists
  // maka akan mengembalikan object yang dikonversikan
  // dari JSON String value yang didapat dari local storage
  // dengan key cart.

  // Namun jika key cart di local storage tidak exists
  // maka akan mengembalikan empty array.
  return localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
}

/**
 * Menghide cart template
 * @returns void.
 */
function hideCart() {
  // Menghapus class transparentBcg dari list class yang ada pada element class cart-overlay
  document.querySelector(".cart-overlay").classList.remove("transparentBcg");

  // Menghapus class showCart dari list class yang ada pada element class cart
  document.querySelector(".cart").classList.remove("showCart");
}

/**
 * Mempopulasi item dari array cart untuk ditambahkan kedalam cart template.
 * @param {*} cart - array cart yang akan dipopulate.
 * @returns void.
 */
function populateCart(cart) {
  // Populate array cart untuk setiap produc item
  // akan ditampilkan kedalam cart template.
  cart.forEach((item) => addCartItem(item));
}

/**
 * Mengambil button element berdasarkan id yang diberikan.
 * @param {*} id - id dari button element yang akan diambil.
 * @returns Element.
 */
function getSingleButton(id) {
  // Mencari element dari button yang ada pada array buttonsDOM
  // yang memiliki dataset id yang sama dengan id yang diberikan
  // dari parameter dan mengembalikan button element tersebut.
  return buttonsDOM.find((button) => button.dataset.id === id);
}

/**
 * Menghapus item yang ada pada cart template maupun local storage
 * berdasarkan id yang diberikan.
 *
 * @param {*} id - Id dari item cart yang akan dihapus.
 * @returns void.
 */
function removeItemInCart(id) {
  // Re-assign cart dengan mencari item atau element
  // yang terdapat pada array cart yang memiliki id
  // yang sama dengan id yang diberikan dari parameter.
  cart = cart.filter((item) => item.id !== id);

  // Panggil setCartValues function dengan memberikan
  // array cart yang baru sebagai parameter dari function
  // untuk mengupdate nilai total dari cart yang ada.
  setCartValues(cart);

  // Simpan array cart terbaru kedalam local storage dengan
  // memanggil function saveCart dan memberikan array cart terbaru
  // sebagai mandatory parameter dari function tersebut.
  saveCart(cart);

  // Mengambil button element berdasarkan id yang diberikan dari parameter.
  let button = getSingleButton(id);

  // Disable atau menonaktifkan button.
  button.disabled = false;

  // Ubah innerHTML dari button dengan id yang telah ditentukan
  // dengan nilai string literal template berupa icon cart dengan
  // dan text add to cart.
  button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
}

/**
 * Menghapus seluruh item yang ada pada cart template maupun local storage.
 * @returns void.
 */
function clearCart() {
  // Ambil id dari tiap element yang ada pada array cart
  let cartItems = cart.map((item) => item.id);

  // Iterasi id yang ada pada variable cartItems yang berupa array
  // tiap tiap iterasi akan memanggil function removeItemInCart dengan
  // mempassing id dari callback untuk menghapus tiap tiap item yang ada pada cart.
  cartItems.forEach((id) => removeItemInCart(id));

  // Jika panjang dari children berupa HTMLCollection memiliki panjang lebih dari 0
  // atau terdapat children pada element class cart-content. Jika kondisi benar maka
  // while loop akan dijalankan untuk menghapus element pertama dari children sampai
  // panjang dari children tidak lebih atau sebanding dengan 0.
  while (document.querySelector(".cart-content").children.length > 0) {
    document
      .querySelector(".cart-content")
      .removeChild(document.querySelector(".cart-content").children[0]);
  }
  // Memanggil function hideCart untuk menghide cart template.
  hideCart();
}

/**
 * Implementasi logic untuk cart
 * @returns void
 */
function cartLogic() {
  // Menambahkan Event Listener yaitu berupa click event pada element class clear-cart
  // dengan callback akan menjalankan function clearCart.
  document.querySelector(".clear-cart").addEventListener("click", clearCart);

  // Menambahkan Event Listener yaitu berupa click event pada element class cart-content
  // method addEventListener memiliki 1 buah callback yaitu listener event (EventListenerOrEventListenerObject)
  document.querySelector(".cart-content").addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-item")) {
      // Jika pada class list pada event target memiliki class name "remove-item"
      // apabila kondisi terpenuhi maka akan melakukan beberapa operasi diantaranya:
      // 1. Mengambil object dari event target.
      // 2. Ambil id dari object removeItem pada key dataset.id.
      // 3. Hapus class element cart-item dari parent class cart-content
      // 4. Hapus cart item di local storage yang mempunyai id sama dengan id yang diberikan.
      let removeItem = event.target;
      let id = removeItem.dataset.id;
      document
        .querySelector(".cart-content")
        .removeChild(removeItem.parentElement.parentElement);
      removeItemInCart(id);
    } else if (event.target.classList.contains("fa-chevron-up")) {
      // Jika pada class list pada event target memiliki class name "fa-chevron-up"
      // apabila kondisi terpenuhi maka akan melakukan beberapa operasi diantaranya:
      // 1. Mengambil object dari event target.
      // 2. Ambil id dari object addAmount pada key dataset.id.
      // 3. Mengambil element atau item dari array cart yang mempunyai id yang sama
      //    dengan id yang didapat dair object addAmount pada key dataset.id.
      // 4. Manipulasi nilai dari amount dengan re-assign nilai dari amount dengan
      //    menambahkan / increment nilai amount sebanyak 1.
      // 5. Simpan array cart yang terbaru (setelah dimanipulasi nilai amountnya)
      //    kedalam local storage.
      // 6. Set nilai dari cart total dengan memberikan array cart pada argument parameter
      //    function setCartValues.
      // 7. Update innerText dari total dengan mengakses nextElementSibling dari target object
      //    yaitu element class (cart-total) dengan text dari nilai dari amount yang telah diperbaharui.
      let addAmount = event.target;
      let id = addAmount.dataset.id;
      let tempItem = cart.find((item) => item.id === id);
      tempItem.amount = tempItem.amount + 1;
      saveCart(cart);
      setCartValues(cart);
      addAmount.nextElementSibling.innerText = tempItem.amount;
    } else if (event.target.classList.contains("fa-chevron-down")) {
      // Jika pada class list pada event target memiliki class name "fa-chevron-down"
      // apabila kondisi terpenuhi maka akan melakukan beberapa operasi diantaranya:
      // 1. Mengambil object dari event target.
      // 2. Ambil id dari object addAmount pada key dataset.id.
      // 3. Mengambil element atau item dari array cart yang mempunyai id yang sama
      //    dengan id yang didapat dair object addAmount pada key dataset.id.
      // 4. Manipulasi nilai dari amount dengan re-assign nilai dari amount dengan
      //    mengurangi / decrement nilai amount sebanyak 1.
      // 5. Jika nilai amount bernilai lebih dari 0 maka akan melakukan:
      //      * Simpan array cart yang telah dimanipulasi dengan mendecrement nilai amount
      //        sebanyak 1 kedalam local storage.
      //      * Set nilai dari cart total dengan memberikan array cart pada argument parameter
      //        function setCartValues.
      //      * Update innerText dari total dengan mengakses previousElementSibling dari target object
      //        yaitu element class (cart-total) dengan text dari nilai dari amount yang telah diperbaharui.
      //    Namun jika nilai amount bernilai tidak lebi dari 0 maka akan melakukan:
      //      * Hapus class element cart-item dari parent class cart-content.
      //      * Hapus cart item di local storage yang mempunyai id sama dengan id yang diberikan.
      let lowerAmount = event.target;
      let id = lowerAmount.dataset.id;
      let tempItem = cart.find((item) => item.id === id);
      tempItem.amount = tempItem.amount - 1;
      if (tempItem.amount > 0) {
        saveCart(cart);
        setCartValues(cart);
        lowerAmount.previousElementSibling.innerText = tempItem.amount;
      } else {
        console.log(lowerAmount.parentElement.parentElement);
        document
          .querySelector(".cart-content")
          .removeChild(lowerAmount.parentElement.parentElement);
        removeItemInCart(id);
      }
    }
  });
}

/**
 * Mensetup application dengan memanggil beberapa function dan append event listener
 * ke beberapa element class.
 *
 * @returns void
 */
function setupApp() {
  // Assign cart value dengan nilai dari nilai kembalian function getCart().
  cart = getCart();

  // Set nilai dari cart total dengan memberikan array cart pada argument parameter
  // function setCartValues.
  setCartValues(cart);

  // Menambahkan element atau item dari array cart kedalam cart template.
  populateCart(cart);

  // Menambahkan event listener pada class element cart-btn yaitu event click dengan
  // callback yang akan menjalankan function showCart.
  document.querySelector(".cart-btn").addEventListener("click", showCart);

  // Menambahkan event listener pada class element close-cart yaitu event click dengan
  // callback yang akan menjalankan function hideCart.
  document.querySelector(".close-cart").addEventListener("click", hideCart);
}

// Ketika HTML Document berhasil di load maka akan menjalankan
// beberapa function yaitu:
// * 1. setupApp()
// * 2. getProducts()
// * 3. displayProducts()
// * 4. saveProduct()
// * 5. getCartButtons()
// * 6. cartLogic()
document.addEventListener("DOMContentLoaded", () => {
  // Jalankan function setupApp()
  setupApp();
  // jalankan function getProducts() dengan mempassing
  // path dari data yang akan di fetch.
  // Function ini mengembalikan sebuah promise, jika resolve
  // maka thennable callback akan berupa response object yang
  // telah diparse kedalam bentuk JSON.
  getProducts("products.json")
    .then((v) => {
      // Menampilkan product dengan memberikan argument parameter dari nilai callback v.
      displayProducts(v);
      // Menyimpan product ke local storage dengan memberikan argument parameter dari nilai callback v.
      saveProduct(v);
    })
    // Setelah kedua function diatas berhasil dijalankan yaitu displayProducts() & saveProduct()
    // maka berikutnya akan menjalankan getCartButtons() & cartLogic()
    .then(() => {
      getCartButtons();
      cartLogic();
    });
});
