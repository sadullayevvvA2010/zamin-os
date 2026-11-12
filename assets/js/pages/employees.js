/* ===== Xodimlar sahifasi ===== */
const EmployeesPage = {
  render(container) {
    const db = DB.get();
    container.innerHTML = `
      <div class="page-header">
        <div><h1>Xodimlar</h1><p>Foydalanuvchilar va rollar</p></div>
        <button class="btn btn-primary" id="addEmpBtn">+ Yangi xodim</button>
      </div>
      <div class="card">
        <div class="card-body" style="padding:0">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Ism</th><th>Email</th><th>Rol</th><th>Filial</th><th>Qo'shilgan</th><th>Amallar</th></tr></thead>
              <tbody>
                ${db.users.map(u => {
                  const b = u.branchId ? db.branches.find(x => x.id === u.branchId) : null;
                  return `<tr>
                    <td><div class="row"><div class="user-avatar" style="width:32px;height:32px;font-size:14px">${u.avatar || u.name[0]}</div><strong>${u.name}</strong></div></td>
                    <td>${u.email}</td>
                    <td><span class="badge badge-info">${u.role}</span></td>
                    <td>${b?.name.split(' —')[0] || 'Barchasi'}</td>
                    <td class="text-2">${formatDate(u.createdAt)}</td>
                    <td>${u.role !== 'Super Admin' ? `<button class="btn btn-sm btn-outline" data-del="${u.id}">🗑</button>` : ''}</td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    document.getElementById('addEmpBtn').addEventListener('click', () => this.openForm());
    document.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
      UI.confirm('Xodim o\'chirilsinmi?', () => {
        DB.remove('users', parseInt(b.dataset.del));
        UI.toast('O\'chirildi', 'success');
        this.render(container);
      });
    }));
  },

  openForm() {
    const db = DB.get();
    const roles = ['Korxona egasi', 'Administrator', 'Kassir', 'Ombor mudiri', 'Menejer', 'Kuzatuvchi'];
    const body = `
      <div class="form-group"><label>Ism</label><input id="uName" /></div>
      <div class="form-group"><label>Email</label><input type="email" id="uEmail" /></div>
      <div class="form-group"><label>Parol</label><input type="password" id="uPass" /></div>
      <div class="form-group"><label>Rol</label>
        <select id="uRole">${roles.map(r => `<option>${r}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Filial</label>
        <select id="uBranch"><option value="">Barchasi</option>${db.branches.map(b => `<option value="${b.id}">${b.name}</option>`).join('')}</select>
      </div>
    `;
    UI.modal({
      title: 'Yangi xodim',
      body,
      onConfirm: () => {
        const name = document.getElementById('uName').value.trim();
        const email = document.getElementById('uEmail').value.trim();
        const pass = document.getElementById('uPass').value;
        if (!name || !email || pass.length < 6) { UI.toast('Ma\'lumot to\'liq emas', 'error'); return false; }
        if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          UI.toast('Email band', 'error'); return false;
        }
        DB.add('users', {
          name, email, password: pass,
          role: document.getElementById('uRole').value,
          branchId: document.getElementById('uBranch').value ? parseInt(document.getElementById('uBranch').value) : null,
          avatar: name[0].toUpperCase(),
          createdAt: new Date().toISOString()
        });
        UI.toast('Qo\'shildi', 'success');
        this.render(document.getElementById('pageContent'));
      }
    });
  }
};