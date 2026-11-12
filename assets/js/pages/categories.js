/* ===== Kategoriyalar ===== */
const CategoriesPage = {
  render(container) {
    const db = DB.get();
    container.innerHTML = `
      <div class="page-header">
        <div><h1>Kategoriyalar</h1><p>Mahsulot kategoriyalari</p></div>
        <button class="btn btn-primary" id="addCatBtn">+ Yangi kategoriya</button>
      </div>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">
        ${db.categories.map(c => {
          const count = db.products.filter(p => p.categoryId === c.id).length;
          return `<div class="card"><div class="card-body">
            <div class="row-between mb-2">
              <strong style="font-size:15px">${c.name}</strong>
              <button class="btn btn-sm btn-outline" data-del="${c.id}">🗑</button>
            </div>
            <div class="text-2" style="font-size:13px">${count} ta mahsulot</div>
          </div></div>`;
        }).join('')}
      </div>
    `;
    document.getElementById('addCatBtn').addEventListener('click', () => this.openForm());
    document.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
      UI.confirm('Kategoriya o\'chirilsinmi?', () => {
        DB.remove('categories', parseInt(b.dataset.del));
        UI.toast('O\'chirildi', 'success');
        this.render(container);
      });
    }));
  },
  openForm() {
    UI.modal({
      title: 'Yangi kategoriya',
      body: `<div class="form-group"><label>Nomi</label><input id="catName" /></div>`,
      onConfirm: () => {
        const name = document.getElementById('catName').value.trim();
        if (!name) { UI.toast('Nom kerak', 'error'); return false; }
        DB.add('categories', { name });
        UI.toast('Qo\'shildi', 'success');
        this.render(document.getElementById('pageContent'));
      }
    });
  }
};