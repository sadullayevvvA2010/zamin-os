/* ===== Profil ===== */
const ProfilePage = {
  render(container) {
    const user = Auth.currentUser();
    const db = DB.get();
    const branch = user.branchId ? db.branches.find(b => b.id === user.branchId) : null;

    container.innerHTML = `
      <div class="page-header"><div><h1>Profil</h1><p>Shaxsiy ma'lumotlar</p></div></div>
      <div class="card" style="max-width:600px">
        <div class="card-body">
          <div class="row mb-3" style="gap:16px">
            <div class="user-avatar" style="width:64px;height:64px;font-size:24px">${user.avatar || user.name[0]}</div>
            <div>
              <h2 style="font-size:18px">${user.name}</h2>
              <div class="text-2">${user.role}</div>
            </div>
          </div>

          <div class="form-group"><label>Ism</label><input id="prName" value="${user.name}" /></div>
          <div class="form-group"><label>Email</label><input id="prEmail" value="${user.email}" /></div>
          <div class="form-group"><label>Rol</label><input value="${user.role}" disabled /></div>
          <div class="form-group"><label>Filial</label><input value="${branch?.name || 'Barchasi'}" disabled /></div>
          <div class="form-group"><label>Ro'yxatdan o'tgan</label><input value="${formatDate(user.createdAt)}" disabled /></div>
          <div class="form-group"><label>Yangi parol (bo'sh qoldirsangiz o'zgarmaydi)</label><input type="password" id="prPass" /></div>
          <button class="btn btn-primary" id="saveProfileBtn">Saqlash</button>
        </div>
      </div>
    `;

    document.getElementById('saveProfileBtn').addEventListener('click', () => {
      const name = document.getElementById('prName').value.trim();
      const email = document.getElementById('prEmail').value.trim();
      const pass = document.getElementById('prPass').value;
      if (!name || !email) { UI.toast('Ma\'lumot to\'liq emas', 'error'); return; }
      const changes = { name, email };
      if (pass) {
        if (pass.length < 6) { UI.toast('Parol kamida 6 belgi', 'error'); return; }
        changes.password = pass;
      }
      DB.update('users', user.id, changes);
      UI.toast('Saqlandi', 'success');
      setTimeout(() => location.reload(), 600);
    });
  }
};