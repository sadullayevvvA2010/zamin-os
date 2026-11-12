/* ===== Yetkazib beruvchilar ===== */
const SuppliersPage = {
  render(container) {
    const db = DB.get();
    container.innerHTML = `
      <div class="page-header">
        <div><h1>Yetkazib beruvchilar</h1><p>Ta'minotchilar ro'yxati</p></div>
        <button class="btn btn-primary" id="addSupBtn">+ Yangi</button>
      </div>
      <div class="card">
        <div class="card-body" style="padding:0">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Nomi</th><th>Telefon</th><th>Manzil</th><th>Amallar</th></tr></thead>
              <tbody>
                ${db.suppliers.length ? db.suppliers.map(s => `<tr>
                  <td><strong>${s.name}</strong></td>
                  <td>${s.phone}</td>
                  <td class="text-2">${s.address}</td>
                  <td><button class="btn btn-sm btn-outline" data-del="${s.id}">🗑</button></td>
                </tr>`).join('') : `<tr><td colspan="4">${UI.empty('🚚', 'Yetkazib beruvchilar yo\'q')}</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    document.getElementById('addSupBtn').addEventListener('click', () => this.openForm());
    document.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
      UI.confirm('O\'chirilsinmi?', () => {
        DB.remove('suppliers', parseInt(b.dataset.del));
        UI.toast('O\'chirildi', 'success');
        this.render(container);
      });
    }));
  },

  openForm() {
    const body = `
      <div class="form-group"><label>Nomi</label><input id="sName" /></div>
      <div class="form-group"><label>Telefon</label><input id="sPhone" /></div>
      <div class="form-group"><label>Manzil</label><input id="sAddr" /></div>
    `;
    UI.modal({
      title: 'Yangi yetkazib beruvchi',
      body,
      onConfirm: () => {
        const name = document.getElementById('sName').value.trim();
        if (!name) { UI.toast('Nom kerak', 'error'); return false; }
        DB.add('suppliers', {
          name,
          phone: document.getElementById('sPhone').value.trim(),
          address: document.getElementById('sAddr').value.trim()
        });
        UI.toast('Qo\'shildi', 'success');
        this.render(document.getElementById('pageContent'));
      }
    });
  }
};