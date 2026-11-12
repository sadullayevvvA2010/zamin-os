
"use strict";

window.ZaminProducts = {
  render(container) {
    const products = window.ZaminData.products;

    container.innerHTML = `
      <section class="module-page">
        <div class="module-header">
          <div>
            <h2>Mahsulotlar</h2>
            <p>Barcha mahsulotlarni boshqaring</p>
          </div>
          <button class="primary-btn" id="addProductBtn">+ Mahsulot qo‘shish</button>
        </div>

        <div class="module-card">
          <input id="productSearch" class="module-input"
            placeholder="Mahsulot nomi yoki ID bo‘yicha qidirish...">

          <div id="productFormArea"></div>

          <div class="table-wrap">
            <table class="module-table">
              <thead>
                <tr>
                  <th>Mahsulot ID</th>
                  <th>Nomi</th>
                  <th>Kategoriya</th>
                  <th>Narxi</th>
                  <th>Qoldiq</th>
                </tr>
              </thead>
              <tbody id="productsTableBody"></tbody>
            </table>
          </div>
        </div>
      </section>
    `;

    const tbody = container.querySelector("#productsTableBody");
    const search = container.querySelector("#productSearch");
    const formArea = container.querySelector("#productFormArea");

    function drawProducts() {
      const query = search.value.trim().toLowerCase();

      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );

      tbody.innerHTML = filtered.length
        ? filtered.map(product => `
          <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${window.ZaminFormat.money(product.price)}</td>
            <td>${product.stock} dona</td>
          </tr>
        `).join("")
        : `<tr><td colspan="5">Mahsulot topilmadi.</td></tr>`;
    }

    search.addEventListener("input", drawProducts);

    container.querySelector("#addProductBtn").addEventListener("click", () => {
      formArea.innerHTML = `
        <form id="newProductForm" class="module-form">
          <input class="module-input" name="name"
            placeholder="Mahsulot nomi" required>
          <input class="module-input" name="category"
            placeholder="Kategoriya" required>
          <input class="module-input" name="price"
            type="number" min="1" placeholder="Narxi (so‘m)" required>
          <input class="module-input" name="stock"
            type="number" min="0" placeholder="Miqdori" required>
          <button class="primary-btn" type="submit">Saqlash</button>
          <button class="secondary-btn" id="cancelProductBtn" type="button">
            Bekor qilish
          </button>
        </form>
      `;

      formArea.querySelector("#cancelProductBtn").addEventListener("click", () => {
        formArea.replaceChildren();
      });

      formArea.querySelector("#newProductForm").addEventListener("submit", event => {
        event.preventDefault();

        const form = event.currentTarget;
        const values = new FormData(form);
        const price = Number(values.get("price"));
        const stock = Number(values.get("stock"));

        if (!Number.isFinite(price) || price <= 0 ||
            !Number.isInteger(stock) || stock < 0) {
          alert("Narx va mahsulot miqdorini to‘g‘ri kiriting.");
          return;
        }

        products.push({
          id: "PR-" + String(Date.now()).slice(-6),
          name: String(values.get("name")).trim(),
          category: String(values.get("category")).trim(),
          price,
          stock
        });
        
window.ZaminStorage.saveData("products");


        formArea.replaceChildren();
        drawProducts();

        if (window.ZaminUI) {
          window.ZaminUI.showToast("Yangi mahsulot qo‘shildi!");
        }
      });
    });

    drawProducts();
  }
};
