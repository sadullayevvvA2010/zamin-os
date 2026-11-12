/* ===== Moliya sahifasi ===== */
const FinancePage = {
  render(container) {
    const db = DB.get();
    const income = db.orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0);
    const expense = db.expenses.reduce((s, e) => s + e.amount, 0);
    const profit = income - expense;

    container.innerHTML = `
      <div class="page-header">
        <div><h1>Moliya</h1><p>Daromad va xarajatlar</p></div>
        <button class="btn btn-primary" id="addExpBtn">+ Xarajat qo'shish</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="label">Daromad</div>
          <div class="value text-success">${formatUZS(income)}</div>
        </div>
        <div class="stat-card">
          <div class="label">Xarajat</div>
          <div class="value text-danger">${formatUZS(expense)}</div>
        </div>
        <div class="stat-card">
          <div class="label">Sof foyda</div>
          <div class="value ${profit >= 0 ? 'text-success' : 'text-danger'}">${formatUZS(profit)}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">Xarajatlar</div></div>
        <div class="card-body" style="padding:0">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Sarlavha</th><th>Filial</th><th>Summa</th><th>Sana</th><th>Amallar</th></tr></thead>
              <tbody>
                ${db.expenses.length ? db.expenses.map(e => {
                  const b = db.branches.find(x => x.id === e.branchId);
                  return `<tr>
                    <td><strong>${e.title}</strong></td>
                    <td>${b?.name.split(' —')[0] || '—'}</td>
                    <td class="text-danger">${formatUZS(e.amount)}</td>
                    <td class="text-2">${formatDate(e.date)}</td>
                    <td><button class="btn btn-sm btn-outline" data-del="${e.id}">🗑</button></td>
                  </tr>`;
                }).join('') : `<tr><td colspan="5">${UI.empty('💵', 'Xarajatlar yo\'q')}</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    document.getElementById('addExpBtn').addEventListener('click', () => this.openForm());
    document.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
      UI.confirm('O\'chirilsinmi?', () => {
        DB.remove('expenses', parseInt(b.dataset.del));
        UI.toast('O\'chirildi', 'success');
        this.render(container);
      });
    }));
  },

  openForm() {
    const db = DB.get();
    const body = `
      <div class="form-group"><label>Sarlavha</label><input id="eTitle" /></div>
      <div class="form-group"><label>Summa (so'm)</label><input type="number" id="eAmount" value="0" /></div>
      <div class="form-group"><label>Filial</label>
        <select id="eBranch">${db.branches.map(b => `<option value="${b.id}">${b.name}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Sana</label><input type="date" id="eDate" value="${new Date().toISOString().slice(0, 10)}" /></div>
    `;
    UI.modal({
      title: 'Yangi xarajat',
      body,
      onConfirm: () => {
        const title = document.getElementById('eTitle').value.trim();
        const amount = +document.getElementById('eAmount').value;
        if (!title || amount <= 0) { UI.toast('Ma\'lumot to\'liq emas', 'error'); return false; }
        DB.add('expenses', {
          title, amount,
          branchId: parseInt(document.getElementById('eBranch').value),
          date: new Date(document.getElementById('eDate').value).toISOString()
        });
        UI.toast('Qo\'shildi', 'success');
        this.render(document.getElementById('pageContent'));
      }
    });
  }
};