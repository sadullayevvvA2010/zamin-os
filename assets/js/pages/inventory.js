/* ===== Ombor sahifasi ===== */
const InventoryPage = {
  render(container) {
    const db = DB.get();
    const lowStock = db.products.filter(p => p.stock <= p.minStock);
    const totalValue = db.products.reduce((s, p) => s + p.stock * p.purchasePrice, 0);

    container.innerHTML = `
      <div class="page-header">
        <div><h1>Ombor</h1><p>Zaxira va harakatlar</p></div>
        <button class="btn btn-primary" id="moveStockBtn">↔ Kirim / Chiqim</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="label">Umumiy qiymat</div>
          <div class="value">${formatUZS(totalValue)}</div>
        </div>
        <div class="stat-card">
          <div class="label">Mahsulot turlari</div>
          <div class="value">${db.products.length}</div>
        </div>
        <div class="stat-card">
          <div class="label">Kam qolgan</div>
          <div class="value text-danger">${lowStock.length}</div>
        </div>
        <div class="stat-card">
          <div class="label">Umumiy miqdor</div>
          <div class="value">${db.products.reduce((s, p) => s + p.stock, 0)} ta</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">Ombor qoldiqlari</div></div>
        <div class="card-body" style="padding:0">
          <div class="table-wrap">
            <table>
              <thead><tr><th>SKU</th><th>Mahsulot</th><th>Miqdor</th><th>Minimal</th><th>Holat</th><th>Qiymat</th></tr></thead>
              <tbody>
                ${db.products.map(p => `<tr>
                  <td>${p.sku}</td>
                  <td><strong>${p.name}</strong></td>
                  <td>${p.stock} ta</td>
                  <td>${p.minStock} ta</td>
                  <td>${p.stock <= p.minStock ? '<span class="badge badge-danger">Kam</span>' : '<span class="badge badge-success">OK</span>'}</td>
                  <td>${formatUZS(p.stock * p.purchasePrice)}</td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    document.getElementById('moveStockBtn').addEventListener('click', () => this.openMove());
  },

  openMove() {
    const db = DB.get();
    const body = `
      <div class="form-group"><label>Mahsulot</label>
        <select id="mProd">${db.products.map(p => `<option value="${p.id}">${p.name} (${p.stock} ta)</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Turi</label>
        <select id="mType"><option value="in">Kirim (+)</option><option value="out">Chiqim (−)</option></select>
      </div>
      <div class="form-group"><label>Miqdor</label><input type="number" id="mQty" value="1" min="1" /></div>
    `;
    UI.modal({
      title: 'Ombor harakati',
      body,
      onConfirm: () => {
        const id = parseInt(document.getElementById('mProd').value);
        const type = document.getElementById('mType').value;
        const qty = parseInt(document.getElementById('mQty').value) || 0;
        if (qty < 1) { UI.toast('Miqdor noto\'g\'ri', 'error'); return false; }
        const p = db.products.find(x => x.id === id);
        if (type === 'out' && p.stock < qty) { UI.toast('Yetarli emas', 'error'); return false; }
        DB.update('products', id, { stock: type === 'in' ? p.stock + qty : p.stock - qty });
        UI.toast(type === 'in' ? 'Kirim qilindi' : 'Chiqim qilindi', 'success');
        this.render(document.getElementById('pageContent'));
      }
    });
  }
};