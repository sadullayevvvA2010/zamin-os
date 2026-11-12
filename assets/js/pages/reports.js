/* ===== Hisobotlar ===== */
const ReportsPage = {
  render(container) {
    const db = DB.get();
    const completed = db.orders.filter(o => o.status === 'completed');
    const totalSales = completed.reduce((s, o) => s + o.total, 0);
    const totalExp = db.expenses.reduce((s, e) => s + e.amount, 0);

    container.innerHTML = `
      <div class="page-header">
        <div><h1>Hisobotlar</h1><p>Moliyaviy va savdo hisobotlari</p></div>
        <div class="row">
          <button class="btn btn-outline" id="expCsv">📥 CSV eksport</button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="label">Umumiy savdo</div>
          <div class="value">${formatUZS(totalSales)}</div>
        </div>
        <div class="stat-card">
          <div class="label">Xarajatlar</div>
          <div class="value text-danger">${formatUZS(totalExp)}</div>
        </div>
        <div class="stat-card">
          <div class="label">Sof foyda</div>
          <div class="value ${totalSales - totalExp >= 0 ? 'text-success' : 'text-danger'}">${formatUZS(totalSales - totalExp)}</div>
        </div>
      </div>

      <div class="card mb-2">
        <div class="card-header"><div class="card-title">Filiallar bo'yicha savdo</div></div>
        <div class="card-body" style="padding:0">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Filial</th><th>Buyurtmalar</th><th>Savdo</th><th>Ulush</th></tr></thead>
              <tbody>
                ${db.branches.map(b => {
                  const bOrders = completed.filter(o => o.branchId === b.id);
                  const total = bOrders.reduce((s, o) => s + o.total, 0);
                  const pct = totalSales ? (total / totalSales * 100).toFixed(1) : 0;
                  return `<tr>
                    <td><strong>${b.name}</strong></td>
                    <td>${bOrders.length}</td>
                    <td>${formatUZS(total)}</td>
                    <td>${pct}%</td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">Eng ko'p sotilgan mahsulotlar</div></div>
        <div class="card-body" style="padding:0">
          <div class="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Mahsulot</th><th>Sotilgan</th><th>Daromad</th></tr></thead>
              <tbody>
                ${this.topProducts(db, completed).map((p, i) => `<tr>
                  <td>${i + 1}</td>
                  <td><strong>${p.name}</strong></td>
                  <td>${p.qty} ta</td>
                  <td>${formatUZS(p.revenue)}</td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    document.getElementById('expCsv').addEventListener('click', () => this.exportCSV(db, completed));
  },

  topProducts(db, orders) {
    const map = {};
    orders.forEach(o => o.items.forEach(it => {
      if (!map[it.productId]) map[it.productId] = { name: it.name, qty: 0, revenue: 0 };
      map[it.productId].qty += it.qty;
      map[it.productId].revenue += it.qty * it.price;
    }));
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  },

  exportCSV(db, orders) {
    const rows = [['Raqam', 'Mijoz', 'Summa', 'Holat', 'Sana']];
    orders.forEach(o => rows.push([o.number, o.customerName, o.total, o.status, o.createdAt.slice(0, 10)]));
    const csv = rows.map(r => r.map(x => `"${x}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'savdo-hisoboti.csv';
    a.click();
    UI.toast('CSV yuklandi', 'success');
  }
};