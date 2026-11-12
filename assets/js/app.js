/* ===== ZAMIN OS — Asosiy app (v3 - Loginsiz versiya) ===== */
const App = {
  currentPage: null,

  // Sahifalarni yuklash funksiyasi
  getPage(name) {
    const map = {
      dashboard:   () => typeof DashboardPage   !== 'undefined' ? DashboardPage   : null,
      sales:       () => typeof SalesPage       !== 'undefined' ? SalesPage       : null,
      orders:      () => typeof OrdersPage      !== 'undefined' ? OrdersPage      : null,
      products:    () => typeof ProductsPage    !== 'undefined' ? ProductsPage    : null,
      categories:  () => typeof CategoriesPage  !== 'undefined' ? CategoriesPage  : null,
      inventory:   () => typeof InventoryPage   !== 'undefined' ? InventoryPage   : null,
      finance:     () => typeof FinancePage     !== 'undefined' ? FinancePage     : null,
      reports:     () => typeof ReportsPage     !== 'undefined' ? ReportsPage     : null,
      branches:    () => typeof BranchesPage    !== 'undefined' ? BranchesPage    : null,
      employees:   () => typeof EmployeesPage   !== 'undefined' ? EmployeesPage   : null,
      suppliers:   () => typeof SuppliersPage   !== 'undefined' ? SuppliersPage   : null,
      purchases:   () => typeof PurchasesPage   !== 'undefined' ? PurchasesPage   : null,
      notifications: () => typeof NotificationsPage !== 'undefined' ? NotificationsPage : null,
      ai:          () => typeof AIPage          !== 'undefined' ? AIPage          : null,
      profile:     () => typeof ProfilePage     !== 'undefined' ? ProfilePage     : null,
      settings:    () => typeof SettingsPage    !== 'undefined' ? SettingsPage    : null,
    };
    return map[name] ? map[name]() : null;
  },

  init() {
    // LOGIN TEKSHIRUVI OLIB TASHLANDI
    const db = DB.get();
    const user = db.users.find(u => u.id === 1) || db.users[0]; // Har doim birinchi foydalanuvchini (Admin) oladi

    // Tema sozlamasi
    document.documentElement.setAttribute('data-theme', db.settings.theme || 'light');

    // Topbar (yuqori qism) ma'lumotlari
    const userNameEl = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRole');
    const userAvatarEl = document.getElementById('userAvatar');
    
    if (userNameEl) userNameEl.textContent = user.name;
    if (userRoleEl) userRoleEl.textContent = user.role;
    if (userAvatarEl) userAvatarEl.textContent = user.avatar || user.name[0] || 'A';

    // Bildirishnomalar soni
    const unread = db.notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notifBadge');
    if (badge) {
      badge.textContent = unread;
      badge.style.display = unread ? 'inline-block' : 'none';
    }

    // Chiqish tugmasi (agar HTML da bo'lsa, ishlaydi. O'chirilgan bo'lsa xato bermaydi)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        alert("Tizim demo rejimda ishlayapti, chiqish o'chirilgan.");
      });
    }

    // Mobil menyu tugmasi
    document.getElementById('sidebarToggle').addEventListener('click', () => {
      const sb = document.getElementById('sidebar');
      if (window.innerWidth <= 900) sb.classList.toggle('open');
      else sb.classList.toggle('collapsed');
    });

    // Dark mode / Light mode
    document.getElementById('themeToggle').addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      const d = DB.get();
      d.settings.theme = next;
      DB.save(d);
    });

    // MENYULARGA BOSILGANDA SAHIFALARNI O'ZGARTIRISH
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        if (page) {
          this.navigate(page);
        }
      });
    });

    // Brauzer orqaga/oldinga tugmalari uchun
    window.addEventListener('hashchange', () => {
      const page = (location.hash || '#dashboard').slice(1);
      this.navigate(page, true);
    });

    // Boshlang'ich sahifani yuklash
    const initial = (location.hash || '#dashboard').slice(1);
    this.navigate(initial, true);
  },

  navigate(pageName, skipHashUpdate = false) {
    // URL dagi hash ni yangilash (#dashboard, #orders va h.k.)
    if (!skipHashUpdate) {
      if (location.hash !== '#' + pageName) {
        history.pushState(null, '', '#' + pageName);
      }
    }

    const container = document.getElementById('pageContent');
    if (!container) { 
      console.error('Xatolik: pageContent konteyneri topilmadi!'); 
      return; 
    }

    // Faol menyuni belgilash (ko'k rangga bo'yash)
    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.dataset.page === pageName);
    });

    // Mobil telefonda menyuni avtomatik yopish
    const sidebar = document.getElementById('sidebar');
    if (sidebar && window.innerWidth <= 900) {
      sidebar.classList.remove('open');
    }

    // Sahifani topish
    const page = this.getPage(pageName);

    if (!page) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="icon">🔍</div>
          <h2>Sahifa topilmadi: ${pageName}</h2>
          <p>Bu bo'lim hali yaratilmagan yoki xatolik bor.</p>
          <button class="btn btn-primary mt-2" onclick="App.navigate('dashboard')">Dashboard'ga qaytish</button>
        </div>`;
      return;
    }

    // Yuklanish animatsiyasi
    container.innerHTML = UI.spinner();

    // Sahifani chizish
    setTimeout(() => {
      try {
        page.render(container);
        this.currentPage = pageName;
      } catch (e) {
        console.error('Render xatosi [' + pageName + ']:', e);
        container.innerHTML = `
          <div class="empty-state">
            <div class="icon">⚠</div>
            <h3>Sahifani yuklashda xatolik yuz berdi</h3>
            <p style="color:var(--danger); margin-bottom:10px">${e.message}</p>
            <button class="btn btn-outline mt-2" onclick="App.navigate('dashboard')">Dashboard'ga qaytish</button>
          </div>`;
      }
    }, 50);
  }
};

// Dasturni ishga tushirish
document.addEventListener('DOMContentLoaded', () => App.init());