/* ===== Bildirishnomalar ===== */
const NotificationsPage = {
  render(container) {
    const db = DB.get();
    container.innerHTML = `
      <div class="page-header">
        <div><h1>Bildirishnomalar</h1><p>${db.notifications.filter(n => !n.read).length} ta o'qilmagan</p></div>
        <button class="btn btn-outline" id="markAllRead">Hammasini o'qilgan qilish</button>
      </div>
      <div class="notif-list">
        ${db.notifications.length ? db.notifications.slice().reverse().map(n => `
          <div class="notif-item ${n.read ? 'read' : 'unread'}">
            <div class="dot"></div>
            <div class="notif-content">
              <div class="notif-title">${n.title}</div>
              <div>${n.message}</div>
              <div class="notif-time">${formatDateTime(n.createdAt)}</div>
            </div>
            ${!n.read ? `<button class="btn btn-sm btn-outline" data-read="${n.id}">O'qildi</button>` : ''}
          </div>
        `).join('') : UI.empty('🔔', 'Bildirishnomalar yo\'q')}
      </div>
    `;
    document.getElementById('markAllRead').addEventListener('click', () => {
      db.notifications.forEach(n => n.read = true);
      DB.save(db);
      this.render(container);
      UI.toast('Barchasi o\'qilgan', 'success');
    });
    document.querySelectorAll('[data-read]').forEach(b => b.addEventListener('click', () => {
      DB.update('notifications', parseInt(b.dataset.read), { read: true });
      this.render(container);
    }));
  }
};