/* ===== Mahsulotlar sahifasi ===== */
const ProductsPage = {
  state: { search: '', category: '', page: 1, perPage: 10 },

  render(container) {
    const db = DB.get();
    container.innerHTML = `
      <div class="page-header">
        <div><h1>Mahsulotlar</h1><p>Mahsulot katalogi</p></div>
        <button class="btn btn-primary" id="addProdBtn">+ Yangi mahsulot</button>
      </div>
      <div class="card">
        <div class="card-body">
          <div class="filters">
            <input type="text" id="prodSearch" placeholder="Qidiruv: nom yoki SKU" style="min-width:220px" />
            <select id="prodCat">
              <option value="">Barcha kategoriyalar</option>
              ${db.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
          <div id="prodTable"></div>
        </div>
      </div>
    `;
    document.getElementById('prodSearch').addEventListener('input', e => { this.state.search = e.target.value; this.state.page = 1; this.drawTable(); });
    document.getElementById('prodCat').addEventListener('change', e => { this.state.category = e.target.value; this.state.page = 1; this.drawTable(); });
    document.getElementById('addProdBtn').addEventListener('click', () => this.openForm());
    this.drawTable();
  },

  drawTable() {
    const db = DB.get();
    let list = db.products.slice();
    const s = this.state.search.toLowerCase();
    if (s) list = list.filter(p => p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s));
    if (this.state.category) list = list.filter(p => p.categoryId === parseInt(this.state.category));

    const pages = Math.max(1, Math.ceil(list.length / this.state.perPage));
    if (this.state.page > pages) this.state.page = pages;
    const start = (this.state.page - 1) * this.state.perPage;
    const items = list.slice(start, start + this.state.perPage);

    document.getElementById('prodTable').innerHTML = `
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>SKU</th><th>Nomi</th><th>Kategoriya</th><th>Xarid</th><th>Sotuv</th>
            <th>Ombor</th><th>Holat</th><th>Amallar</th>
          </tr></thead>
          <tbody>
            ${items.length ? items.map(p => {
              const cat = db.categories.find(c => c.id === p.categoryId);
              return `<tr>
                <td>${p.sku}</td>
                <td><strong>${p.name}</strong></td>
                <td>${cat?.name || '—'}</td>
                <td>${formatUZS(p.purchasePrice)}</td>
                <td>${formatUZS(p.salePrice)}</td>
                <td>${p.stock} ta</td>
                <td>${p.stock <= p.minStock ? '<span class="badge badge-danger">Kam</span>' : '<span class="badge badge-success">Yetarli</span>'}</td>
                <td>
                  <button class="btn btn-sm btn-outline" data-edit="${p.id}">✎</button>
                  <button class="btn btn-sm btn-outline" data-del="${p.id}">🗑</button>
                </td>
              </tr>`;
            }).join('') : `<tr><td colspan="8">${UI.empty('📦', 'Mahsulotlar topilmadi')}</td></tr>`}
          </tbody>
        </table>
      </div>
      ${pages > 1 ? `<div class="pagination">${Array.from({ length: pages }, (_, i) => i + 1).map(p => `
        <button data-page="${p}" class="${p === this.state.page ? 'active' : ''}">${p}</button>
      `).join('')}</div>` : ''}
    `;

    document.querySelectorAll('[data-page]').forEach(b => b.addEventListener('click', () => {
      this.state.page = parseInt(b.dataset.page); this.drawTable();
    }));
    document.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => this.openForm(parseInt(b.dataset.edit))));
    document.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
      UI.confirm('Mahsulot o\'chirilsinmi?', () => {
        DB.remove('products', parseInt(b.dataset.del));
        UI.toast('O\'chirildi', 'success'); this.drawTable();
      });
    }));
  },

  openForm(id) {
    const db = DB.get();
    const p = id ? db.products.find(x => x.id === id) : null;
    const body = `
      <div class="form-group"><label>Nomi</label><input id="pName" value="${p?.name || ''}" /></div>
      <div class="form-group"><label>SKU</label><input id="pSku" value="${p?.sku || ''}" /></div>
      <div class="form-group"><label>Kategoriya</label>
        <select id="pCat">${db.categories.map(c => `<option value="${c.id}" ${p?.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Xarid narxi (so'm)</label><input type="number" id="pBuy" value="${p?.purchasePrice || 0}" /></div>
      <div class="form-group"><label>Sotuv narxi (so'm)</label><input type="number" id="pSell" value="${p?.salePrice || 0}" /></div>
      <div class="form-group"><label>Ombor miqdori</label><input type="number" id="pStock" value="${p?.stock || 0}" /></div>
      <div class="form-group"><label>Minimal zaxira</label><input type="number" id="pMin" value="${p?.minStock || 10}" /></div>
    `;
    UI.modal({
      title: p ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot',
      body,
      onConfirm: () => {
        const name = document.getElementById('pName').value.trim();
        if (!name) { UI.toast('Nom kerak', 'error'); return false; }
        const data = {
          name,
          sku: document.getElementById('pSku').value.trim() || 'SKU-' + Date.now(),
          categoryId: parseInt(document.getElementById('pCat').value),
          purchasePrice: +document.getElementById('pBuy').value,
          salePrice: +document.getElementById('pSell').value,
          stock: +document.getElementById('pStock').value,
          minStock: +document.getElementById('pMin').value,
          barcode: p?.barcode || 'BC' + Date.now().toString().slice(-6),
          branchId: p?.branchId || 1,
          createdAt: p?.createdAt || new Date().toISOString()
        };
        if (p) DB.update('products', p.id, data);
        else DB.add('products', data);
        UI.toast(p ? 'Yangilandi' : 'Qo\'shildi', 'success');
        this.drawTable();
      }
    });
  }
};