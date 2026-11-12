/* ===== Filiallar sahifasi ===== */
const BranchesPage = {
  render(container) {
    const db = DB.get();
    container.innerHTML = `
      <div class="page-header">
        <div><h1>Filiallar</h1><p>Filiallar boshqaruvi</p></div>
        <button class="btn btn-primary" id="addBranchBtn">+ Yangi filial</button>
      </div>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr))">
        ${db.branches.map(b => {
          const bOrders = db.orders.filter(o => o.branchId === b.id && o.status === 'completed');
          const total = bOrders.reduce((s, o) => s + o.total, 0);
          return `<div class="card"><div class="card-body">
            <div class="row-between mb-2">
              <strong style="font-size:16px">${b.name}</strong>
              <button class="btn btn-sm btn-outline" data-del="${b.id}">🗑</button>
            </div>
            <div class="text-2" style="font-size:13px;margin-bottom:4px">📍 ${b.address}</div>
            <div class="text-2" style="font-size:13px;margin-bottom:12px">📞 ${b.phone}</div>
            <div class="row-between" style="padding-top:12px;border-top:1px solid var(--border)">
              <div><div class="text-2" style="font-size:11px">Savdo</div><strong>${formatUZS(total)}</strong></div>
              <div><div class="text-2" style="font-size:11px">Buyurtmalar</div><strong>${bOrders.length}</strong></div>
            </div>
          </div></div>`;
        }).join('')}
      </div>
    `;
    document.getElementById('addBranchBtn').addEventListener('click', () => this.openForm());
    document.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
      UI.confirm('Filial o\'chirilsinmi?', () => {
        DB.remove('branches', parseInt(b.dataset.del));
        UI.toast('O\'chirildi', 'success');
        this.render(container);
      });
    }));
  },

  openForm() {
    const body = `
      <div class="form-group"><label>Nomi</label><input id="bName" /></div>
      <div class="form-group"><label>Manzil</label><input id="bAddr" /></div>
      <div class="form-group"><label>Telefon</label><input id="bPhone" /></div>
    `;
    UI.modal({
      title: 'Yangi filial',
      body,
      onConfirm: () => {
        const name = document.getElementById('bName').value.trim();
        if (!name) { UI.toast('Nom kerak', 'error'); return false; }
        DB.add('branches', {
          name,
          address: document.getElementById('bAddr').value.trim(),
          phone: document.getElementById('bPhone').value.trim(),
          createdAt: new Date().toISOString()
        });
        UI.toast('Qo\'shildi', 'success');
        this.render(document.getElementById('pageContent'));
      }
    });
  }
};