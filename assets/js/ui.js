/* ===== UI yordamchilari ===== */
const UI = {
  toast(msg, type = 'success', ms = 3000) {
    const c = document.getElementById('toastContainer');
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    el.innerHTML = `<span>${icons[type] || ''}</span><span>${msg}</span>`;
    c.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(120%)';
      el.style.transition = '0.3s';
      setTimeout(() => el.remove(), 300);
    }, ms);
  },

  modal({ title, body, confirmText = I18n ? I18n.t('save') : 'Saqlash', cancelText = I18n ? I18n.t('cancel') : 'Bekor qilish', onConfirm, danger = false, hideFooter = false }) {
    const root = document.getElementById('modalRoot');
    root.innerHTML = `
      <div class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">${title}</div>
            <button class="icon-btn" data-close>✕</button>
          </div>
          <div class="modal-body">${body}</div>
          ${hideFooter ? '' : `
            <div class="modal-footer">
              <button class="btn btn-outline" data-close>${cancelText}</button>
              <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" id="modalConfirm">${confirmText}</button>
            </div>`}
        </div>
      </div>`;
    const close = () => { root.innerHTML = ''; };
    root.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', close));
    root.querySelector('.modal-overlay').addEventListener('click', e => {
      if (e.target.classList.contains('modal-overlay')) close();
    });
    if (!hideFooter) {
      root.querySelector('#modalConfirm').addEventListener('click', () => {
        const result = onConfirm && onConfirm();
        if (result !== false) close();
      });
    }
    return { close };
  },

  confirm(message, onConfirm, danger = true) {
    this.modal({
      title: I18n ? I18n.t('confirm_title') : 'Tasdiqlash',
      body: `<p>${message}</p>`,
      confirmText: I18n ? I18n.t('confirm_continue') : 'Ha, davom etish',
      danger,
      onConfirm
    });
  },

  empty(icon, title, text = '') {
    return `<div class="empty-state">
      <div class="icon">${icon}</div>
      <h3 style="margin-bottom:6px;color:var(--text)">${title}</h3>
      <p>${text}</p>
    </div>`;
  },

  spinner() {
    return `<div class="spinner"></div>`;
  },

  statusBadge(status) {
    const map = {
      completed: ['badge-success', I18n ? I18n.t('status_completed') : 'Yakunlangan'],
      pending: ['badge-warning', I18n ? I18n.t('status_pending') : 'Kutilmoqda'],
      cancelled: ['badge-danger', I18n ? I18n.t('status_cancelled') : 'Bekor qilingan'],
      paid: ['badge-success', I18n ? I18n.t('status_paid') : "To'langan"],
      unpaid: ['badge-danger', I18n ? I18n.t('status_unpaid') : "To'lanmagan"]
    };
    const [cls, label] = map[status] || ['badge-secondary', status];
    return `<span class="badge ${cls}">${label}</span>`;
  }
};