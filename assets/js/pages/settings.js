/* ===== Sozlamalar ===== */
const SettingsPage = {
  render(container) {
    const db = DB.get();
    const user = Auth.currentUser();
    container.innerHTML = `
      <div class="page-header"><div><h1>Sozlamalar</h1><p>Tizim sozlamalari</p></div></div>

      <div class="tabs">
        <button class="tab active" data-tab="org">Korxona</button>
        <button class="tab" data-tab="profile">Profil</button>
        <button class="tab" data-tab="appearance">Ko'rinish</button>
        <button class="tab" data-tab="data">Ma'lumotlar</button>
      </div>

      <div id="tabContent"></div>
    `;

    document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      this.drawTab(t.dataset.tab);
    }));
    this.drawTab('org');
  },

  drawTab(tab) {
    const db = DB.get();
    const user = Auth.currentUser();
    const content = document.getElementById('tabContent');

    if (tab === 'org') {
      content.innerHTML = `<div class="card"><div class="card-body">
        <div class="form-group"><label>Korxona nomi</label><input id="orgName" value="${db.settings.orgName}" /></div>
        <div class="form-group"><label>Valyuta</label><input value="UZS (so'm)" disabled /></div>
        <div class="form-group"><label>Vaqt zonasi</label><input value="${db.settings.timezone}" disabled /></div>
        <button class="btn btn-primary" id="saveOrg">Saqlash</button>
      </div></div>`;
      document.getElementById('saveOrg').addEventListener('click', () => {
        db.settings.orgName = document.getElementById('orgName').value.trim();
        DB.save(db);
        UI.toast('Saqlandi', 'success');
      });
    }
    else if (tab === 'profile') {
      content.innerHTML = `<div class="card"><div class="card-body">
        <div class="form-group"><label>Ism</label><input id="pName" value="${user.name}" /></div>
        <div class="form-group"><label>Email</label><input id="pEmail" value="${user.email}" /></div>
        <div class="form-group"><label>Rol</label><input value="${user.role}" disabled /></div>
        <button class="btn btn-primary" id="saveProfile">Saqlash</button>
      </div></div>`;
      document.getElementById('saveProfile').addEventListener('click', () => {
        DB.update('users', user.id, {
          name: document.getElementById('pName').value.trim(),
          email: document.getElementById('pEmail').value.trim()
        });
        UI.toast('Saqlandi', 'success');
        location.reload();
      });
    }
    else if (tab === 'appearance') {
      content.innerHTML = `<div class="card"><div class="card-body">
        <div class="form-group"><label>Tema</label>
          <select id="themeSel">
            <option value="light" ${db.settings.theme === 'light' ? 'selected' : ''}>Light (yorug')</option>
            <option value="dark" ${db.settings.theme === 'dark' ? 'selected' : ''}>Dark (tungi)</option>
          </select>
        </div>
        <button class="btn btn-primary" id="saveTheme">Qo'llash</button>
      </div></div>`;
      document.getElementById('saveTheme').addEventListener('click', () => {
        db.settings.theme = document.getElementById('themeSel').value;
        DB.save(db);
        document.documentElement.setAttribute('data-theme', db.settings.theme);
        UI.toast('Tema o\'zgartirildi', 'success');
      });
    }
    else if (tab === 'data') {
      content.innerHTML = `<div class="card"><div class="card-body">
        <p class="mb-2">Demo ma'lumotlarini boshqarish</p>
        <button class="btn btn-outline mb-2" id="exportBtn">📥 JSON eksport</button>
        <button class="btn btn-danger" id="resetBtn">🔄 Demo ma'lumotlarni tiklash</button>
      </div></div>`;
      document.getElementById('exportBtn').addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(DB.get(), null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'zamin-os-backup.json';
        a.click();
        UI.toast('Eksport qilindi', 'success');
      });
      document.getElementById('resetBtn').addEventListener('click', () => {
        UI.confirm('Barcha ma\'lumotlar o\'chiriladi. Davom etilsinmi?', () => {
          DB.reset();
          UI.toast('Tiklandi', 'success');
          setTimeout(() => location.reload(), 800);
        });
      });
    }
  }
};