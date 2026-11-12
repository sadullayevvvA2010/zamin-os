/* ===== Savdo sahifasi ===== */
const SalesPage = {
  render(container) {
    const db = DB.get();
    const completed = db.orders.filter(o => o.status === 'completed');
    const today = new Date().toISOString().slice(0, 10);
    const todayOrders = completed.filter(o => o.createdAt.slice(0, 10) === today);
    const todayTotal = todayOrders.reduce((s, o) => s + o.total, 0);

    container.innerHTML = `
      <div class="page-header">
        <div><h1>Savdo</h1><p>Kunlik va umumiy savdo ko'rsatkichlari</p></div>
        <button class="btn btn-primary" id="newSaleBtn">+ Yangi savdo</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="label">Bugungi savdo</div>
          <div class="value text-success">${formatUZS(todayTotal)}</div>
          <div class="delta up">${todayOrders.length} ta buyurtma</div>
        </div>
        <div class="stat-card">
          <div class="label">Umumiy savdo</div>
          <div class="value">${formatUZS(completed.reduce((s, o) => s + o.total, 0))}</div>
        </div>
        <div class="stat-card">
          <div class="label">Yakunlangan</div>
          <div class="value">${completed.length}</div>
        </div>
        <div class="stat-card">
          <div class="label">Kutilmoqda</div>
          <div class="value text-warning">${db.orders.filter(o => o.status === 'pending').length}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">So'nggi savdolar</div></div>
        <div class="card-body" style="padding:0">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Raqam</th><th>Mijoz</th><th>Mahsulotlar</th><th>Summa</th><th>Holat</th><th>Sana</th></tr></thead>
              <tbody>
                ${completed.slice(-10).reverse().map(o => `<tr>
                  <td><strong>${o.number}</strong></td>
                  <td>${o.customerName}</td>
                  <td>${o.items.length} ta</td>
                  <td>${formatUZS(o.total)}</td>
                  <td>${UI.statusBadge(o.status)}</td>
                  <td class="text-2">${formatDateTime(o.createdAt)}</td>
                </tr>`).join('') || `<tr><td colspan="6">${UI.empty('💰','Savdo yo\'q')}</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    document.getElementById('newSaleBtn').addEventListener('click', () => {
      location.hash = '#orders';
      setTimeout(() => {
        const btn = document.getElementById('addOrderBtn');
        if (btn) btn.click();
      }, 400);
    });
  }
};