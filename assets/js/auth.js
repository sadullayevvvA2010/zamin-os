/* ===== ZAMIN OS — Autentifikatsiya ===== */
const Auth = {
  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  login(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail');
    const pass = document.getElementById('loginPassword');
    let ok = true;

    ['loginEmail', 'loginPassword'].forEach(id => {
      document.getElementById(id).parentElement.classList.remove('has-error');
    });

    if (!this.validateEmail(email.value.trim())) {
      this.showErr('loginEmail', I18n ? I18n.t('auth_error_email_invalid') : 'Email noto\'g\'ri formatda');
      ok = false;
    }
    if (pass.value.length < 4) {
      this.showErr('loginPassword', I18n ? I18n.t('auth_error_password_short') : 'Parol kamida 4 belgi');
      ok = false;
    }
    if (!ok) return;

    const db = DB.get();
    const user = db.users.find(u => u.email.toLowerCase() === email.value.trim().toLowerCase());

    if (!user || user.password !== pass.value) {
      this.showErr('loginPassword', I18n ? I18n.t('auth_error_invalid_credentials') : 'Email yoki parol noto\'g\'ri');
      return;
    }

    db.session = { userId: user.id, loginAt: new Date().toISOString() };
    DB.save(db);
    window.location.href = 'index.html';
  },

  register(e) {
    e.preventDefault();
    const name = document.getElementById('regName');
    const email = document.getElementById('regEmail');
    const org = document.getElementById('regOrg');
    const pass = document.getElementById('regPassword');
    let ok = true;

    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));

    if (name.value.trim().length < 2) { this.showErr('regName', I18n ? I18n.t('auth_error_name_short') : 'Ism kamida 2 belgi'); ok = false; }
    if (!this.validateEmail(email.value.trim())) { this.showErr('regEmail', I18n ? I18n.t('auth_error_email_invalid_simple') : 'Email noto\'g\'ri'); ok = false; }
    if (org.value.trim().length < 2) { this.showErr('regOrg', I18n ? I18n.t('auth_error_company_short') : 'Korxona nomi kamida 2 belgi'); ok = false; }
    if (pass.value.length < 6) { this.showErr('regPassword', I18n ? I18n.t('auth_error_password_short_register') : 'Parol kamida 6 belgi'); ok = false; }
    if (!ok) return;

    const db = DB.get();
    if (db.users.some(u => u.email.toLowerCase() === email.value.trim().toLowerCase())) {
      this.showErr('regEmail', I18n ? I18n.t('auth_error_email_taken') : 'Bu email band');
      return;
    }

    const newUser = {
      id: db.users.reduce((m, u) => Math.max(m, u.id), 0) + 1,
      name: name.value.trim(),
      email: email.value.trim(),
      password: pass.value,
      role: 'Korxona egasi',
      avatar: name.value.trim()[0].toUpperCase(),
      branchId: null,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    db.settings.orgName = org.value.trim();
    db.session = { userId: newUser.id, loginAt: new Date().toISOString() };
    DB.save(db);
    window.location.href = 'index.html';
  },

  showErr(id, msg) {
    const el = document.getElementById(id);
    const group = el.closest('.form-group');
    group.classList.add('has-error');
    const err = group.querySelector('.error-msg');
    if (err) err.textContent = msg;
  },

  currentUser() {
    const db = DB.get();
    if (!db.session) return null;
    return db.users.find(u => u.id === db.session.userId) || null;
  },

  requireAuth() {
    if (!this.currentUser()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  logout() {
    const db = DB.get();
    db.session = null;
    DB.save(db);
    window.location.href = 'login.html';
  }
};