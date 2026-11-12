/* ===== Dashboard sahifasi ===== */
const DashboardPage = {
  render(container) {
    const db = DB.get();
    const completedOrders = db.orders.filter(o => o.status === 'completed');
    const totalSales = completedOrders.reduce((s, o) => s + o.total, 0);
    const totalExpenses = db.expenses.reduce((s, e) => s + e.amount, 0);
    const netProfit = totalSales - totalExpenses;

    const lowStock = db.products.filter(p => p.stock <= p.minStock);
    const last7 = this.last7Days(completedOrders);

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1>Boshqaruv paneli</h1>
          <p>Umumiy biznes ko'rsatkichlari</p>
        </div>
        <div class="row">
          <select id="rangeFilter" class="form-group" style="padding:8px 12px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);">
            <option value="7">Oxirgi 7 kun</option>
            <option value="30">Oxirgi 30 kun</option>
            <option value="all">Barchasi</option>
          </select>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="label">Umumiy savdo</div>
          <div class="value">${formatUZS(totalSales)}</div>
          <div class="delta up">↑ ${completedOrders.length} ta buyurtma</div>
        </div>
        <div class="stat-card">
          <div class="label">Sof foyda</div>
          <div class="value ${netProfit >= 0 ? 'text-success' : 'text-danger'}">${formatUZS(netProfit)}</div>
          <div class="delta">Xarajat: ${formatUZS(totalExpenses)}</div>
        </div>
        <div class="stat-card">
          <div class="label">Buyurtmalar</div>
          <div class="value">${db.orders.length}</div>
          <div class="delta">${db.orders.filter(o => o.status === 'pending').length} ta kutilmoqda</div>
        </div>
        <div class="stat-card">
          <div class="label">Mahsulotlar</div>
          <div class="value">${db.products.length}</div>
          <div class="delta ${lowStock.length ? 'down' : 'up'}">${lowStock.length} ta kam qoldi</div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header"><div class="card-title">Oxirgi 7 kunlik savdo</div></div>
          <div class="card-body">
            <div class="chart-bar-wrap">
              ${last7.map(d => `
                <div class="chart-bar" style="height:${Math.max(8, (d.total / Math.max(...last7.map(x => x.total), 1)) * 100)}%">
                  <span>${d.label}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">Kam qolgan mahsulotlar</div></div>
          <div class="card-body">
            ${lowStock.length ? `
              <div class="notif-list">
                ${lowStock.slice(0, 5).map(p => `
                  <div class="row-between" style="padding:10px 0;border-bottom:1px solid var(--border)">
                    <div><strong>${p.name}</strong><div class="text-2" style="font-size:12px">${p.sku}</div></div>
                    <span class="badge badge-danger">${p.stock} ta</span>
                  </div>
                `).join('')}
              </div>
            ` : UI.empty('✓', 'Barcha mahsulot yetarli')}
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header"><div class="card-title">So'nggi buyurtmalar</div></div>
          <div class="card-body" style="padding:0">
            <div class="table-wrap">
              <table>
                <thead><tr><th>Raqam</th><th>Mijoz</th><th>Summa</th><th>Holat</th><th>Sana</th></tr></thead>
                <tbody>
                  ${db.orders.slice(-5).reverse().map(o => `
                    <tr>
                      <td><strong>${o.number}</strong></td>
                      <td>${o.customerName}</td>
                      <td>${formatUZS(o.total)}</td>
                      <td>${UI.statusBadge(o.status)}</td>
                      <td class="text-2">${formatDate(o.createdAt)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">Filiallar kesimida</div></div>
          <div class="card-body">
            ${db.branches.map(b => {
              const bOrders = completedOrders.filter(o => o.branchId === b.id);
              const total = bOrders.reduce((s, o) => s + o.total, 0);
              return `
                <div class="row-between" style="padding:10px 0;border-bottom:1px solid var(--border)">
                  <div><strong>${b.name}</strong><div class="text-2" style="font-size:12px">${bOrders.length} ta buyurtma</div></div>
                  <strong>${formatUZS(total)}</strong>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  },

  last7Days(orders) {
    const days = ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya'];
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d); next.setDate(d.getDate() + 1);
      const total = orders
        .filter(o => { const t = new Date(o.createdAt); return t >= d && t < next; })
        .reduce((s, o) => s + o.total, 0);
      result.push({ label: days[d.getDay() === 0 ? 6 : d.getDay() - 1], total });
    }
    return result;
  }
};