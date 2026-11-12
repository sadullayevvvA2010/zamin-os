/* ===== Xaridlar ===== */
const PurchasesPage = {
  render(container) {
    const db = DB.get();
    const purchases = db.purchaseOrders || [];

    container.innerHTML = `
      <div class="page-header">
        <div><h1>Xaridlar</h1><p>Yetkazib beruvchilardan xaridlar</p></div>
        <button class="btn btn-primary" id="addPurchaseBtn">+ Yangi xarid</button>
      </div>
      <div class="card">
        <div class="card-body" style="padding:0">
          <div class="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Yetkazib beruvchi</th><th>Mahsulot</th><th>Miqdor</th><th>Summa</th><th>Sana</th><th>Amallar</th></tr></thead>
              <tbody>
                ${purchases.length ? purchases.slice().reverse().map(p => {
                  const sup = db.suppliers.find(s => s.id === p.supplierId);
                  const prod = db.products.find(x => x.id === p.productId);
                  return `<tr>
                    <td>${p.id}</td>
                    <td><strong>${sup?.name || '—'}</strong></td>
                    <td>${prod?.name || '—'}</td>
                    <td>${p.qty}</td>
                    <td>${formatUZS(p.total)}</td>
                    <td class="text-2">${formatDate(p.date)}</td>
                    <td><button class="btn btn-sm btn-outline" data-del="${p.id}">🗑</button></td>
                  </tr>`;
                }).join('') : `<tr><td colspan="7">${UI.empty('🛒', 'Xaridlar yo\'q')}</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    document.getElementById('addPurchaseBtn').addEventListener('click', () => this.openForm());
    document.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
      UI.confirm('Xarid o\'chirilsinmi?', () => {
        const d = DB.get();
        d.purchaseOrders = (d.purchaseOrders || []).filter(x => x.id !== parseInt(b.dataset.del));
        DB.save(d);
        UI.toast('O\'chirildi', 'success');
        this.render(container);
      });
    }));
  },

  openForm() {
    const db = DB.get();
    const body = `
      <div class="form-group"><label>Yetkazib beruvchi</label>
        <select id="puSup">${db.suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Mahsulot</label>
        <select id="puProd">${db.products.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Miqdor</label><input type="number" id="puQty" value="1" min="1" /></div>
      <div class="form-group"><label>Xarid narxi</label><input type="number" id="puPrice" value="0" /></div>
    `;
    UI.modal({
      title: 'Yangi xarid',
      body,
      onConfirm: () => {
        const qty = parseInt(document.getElementById('puQty').value) || 0;
        const price = +document.getElementById('puPrice').value;
        const prodId = parseInt(document.getElementById('puProd').value);
        if (qty < 1 || price < 0) { UI.toast('Ma\'lumot noto\'g\'ri', 'error'); return false; }
        const d = DB.get();
        d.purchaseOrders = d.purchaseOrders || [];
        const id = d.purchaseOrders.reduce((m, x) => Math.max(m, x.id), 0) + 1;
        d.purchaseOrders.push({
          id,
          supplierId: parseInt(document.getElementById('puSup').value),
          productId: prodId,
          qty, price,
          total: qty * price,
          date: new Date().toISOString()
        });
        DB.save(d);
        // Ombor kirim
        const prod = d.products.find(x => x.id === prodId);
        DB.update('products', prodId, { stock: prod.stock + qty });
        UI.toast('Xarid qo\'shildi, omborga kirim qilindi', 'success');
        this.render(document.getElementById('pageContent'));
      }
    });
  }
};