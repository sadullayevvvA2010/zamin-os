/* ===== ZAMIN OS — Tarjimalar tizimi ===== */
const I18n = {
  currentLang: localStorage.getItem('zamin_lang') || 'uz',

  dict: {
    uz: {
      nav_dashboard: 'Boshqaruv paneli',
      nav_sales: 'Savdo',
      nav_orders: 'Buyurtmalar',
      nav_products: 'Mahsulotlar',
      nav_categories: 'Kategoriyalar',
      nav_inventory: 'Ombor',
      nav_finance: 'Moliya',
      nav_reports: 'Hisobotlar',
      nav_branches: 'Filiallar',
      nav_employees: 'Xodimlar',
      nav_suppliers: 'Yetkazib beruvchilar',
      nav_purchases: 'Xaridlar',
      nav_notifications: 'Bildirishnomalar',
      nav_ai: 'ZAMIN AI',
      nav_profile: 'Profil',
      nav_settings: 'Sozlamalar',
      search_placeholder: 'Qidiruv: buyurtma, mahsulot, mijoz...',
      demo_badge: 'DEMO',
      admin_name: 'Admin ZAMIN',
      admin_role: 'Bosh administrator',
      save: 'Saqlash',
      cancel: 'Bekor qilish',
      delete: 'O\'chirish',
      edit: 'Tahrirlash',
      add: 'Qo\'shish',
      confirm_title: 'Tasdiqlash',
      confirm_continue: 'Ha, davom etish',
      dash_title: 'Boshqaruv paneli',
      dash_subtitle: 'Umumiy biznes ko\'rsatkichlari',
      dash_total_sales: 'Umumiy savdo',
      dash_net_profit: 'Sof foyda',
      dash_orders: 'Buyurtmalar',
      dash_products: 'Mahsulotlar',
      dash_last7: 'Oxirgi 7 kunlik savdo',
      dash_low_stock: 'Kam qolgan mahsulotlar',
      dash_recent_orders: 'So\'nggi buyurtmalar',
      dash_by_branch: 'Filiallar kesimida',
      status_completed: 'Yakunlangan',
      status_pending: 'Kutilmoqda',
      status_cancelled: 'Bekor qilingan',
      status_paid: "To'langan",
      status_unpaid: "To'lanmagan",
      currency: "so'm",
      auth_company: 'Biznes boshqaruv platformasi',
      auth_login_title: 'Tizimga kirish',
      auth_login_subtitle: 'Hisobingizga kirish uchun ma\'lumotlarni kiriting',
      auth_register_title: 'Ro\'yxatdan o\'tish',
      auth_register_subtitle: 'Yangi korxona yaratish uchun ma\'lumotlarni kiriting',
      auth_email: 'Email',
      auth_password: 'Parol',
      auth_full_name: "To'liq ism",
      auth_company_name: 'Korxona nomi',
      auth_login_button: 'Kirish',
      auth_register_button: "Ro'yxatdan o'tish",
      auth_demo_account: 'Demo akkaunt:',
      auth_has_account: 'Hisobingiz bormi?',
      auth_no_account: 'Hisobingiz yo\'qmi?',
      auth_sign_in: 'Kirish',
      auth_sign_up: 'Ro\'yxatdan o\'tish',
      auth_error_email_invalid: 'Email noto\'g\'ri formatda',
      auth_error_password_short: 'Parol kamida 4 belgi',
      auth_error_invalid_credentials: 'Email yoki parol noto\'g\'ri',
      auth_error_name_short: 'Ism kamida 2 belgi',
      auth_error_email_invalid_simple: 'Email noto\'g\'ri',
      auth_error_company_short: 'Korxona nomi kamida 2 belgi',
      auth_error_password_short_register: 'Parol kamida 6 belgi',
      auth_error_email_taken: 'Bu email band'
    },

    ru: {
      nav_dashboard: 'Панель управления',
      nav_sales: 'Продажи',
      nav_orders: 'Заказы',
      nav_products: 'Товары',
      nav_categories: 'Категории',
      nav_inventory: 'Склад',
      nav_finance: 'Финансы',
      nav_reports: 'Отчеты',
      nav_branches: 'Филиалы',
      nav_employees: 'Сотрудники',
      nav_suppliers: 'Поставщики',
      nav_purchases: 'Закупки',
      nav_notifications: 'Уведомления',
      nav_ai: 'ZAMIN AI',
      nav_profile: 'Профиль',
      nav_settings: 'Настройки',
      search_placeholder: 'Поиск: заказ, товар, клиент...',
      demo_badge: 'ДЕМО',
      admin_name: 'Админ ЗАМИН',
      admin_role: 'Главный администратор',
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      edit: 'Редактировать',
      add: 'Добавить',
      confirm_title: 'Подтверждение',
      confirm_continue: 'Да, продолжить',
      dash_title: 'Панель управления',
      dash_subtitle: 'Общие показатели бизнеса',
      dash_total_sales: 'Общие продажи',
      dash_net_profit: 'Чистая прибыль',
      dash_orders: 'Заказы',
      dash_products: 'Товары',
      dash_last7: 'Продажи за 7 дней',
      dash_low_stock: 'Заканчивающиеся товары',
      dash_recent_orders: 'Последние заказы',
      dash_by_branch: 'По филиалам',
      status_completed: 'Завершено',
      status_pending: 'В ожидании',
      status_cancelled: 'Отменено',
      status_paid: 'Оплачено',
      status_unpaid: 'Не оплачено',
      currency: 'сум',
      auth_company: 'Платформа управления бизнесом',
      auth_login_title: 'Войти в систему',
      auth_login_subtitle: 'Введите свои данные для входа в аккаунт',
      auth_register_title: 'Регистрация',
      auth_register_subtitle: 'Введите данные для создания нового бизнеса',
      auth_email: 'Email',
      auth_password: 'Пароль',
      auth_full_name: 'Полное имя',
      auth_company_name: 'Название компании',
      auth_login_button: 'Войти',
      auth_register_button: 'Зарегистрироваться',
      auth_demo_account: 'Демо-аккаунт:',
      auth_has_account: 'Уже есть аккаунт?',
      auth_no_account: 'Нет аккаунта?',
      auth_sign_in: 'Войти',
      auth_sign_up: 'Регистрация',
      auth_error_email_invalid: 'Неверный формат Email',
      auth_error_password_short: 'Пароль должен содержать минимум 4 символа',
      auth_error_invalid_credentials: 'Email или пароль неверный',
      auth_error_name_short: 'Имя должно содержать минимум 2 символа',
      auth_error_email_invalid_simple: 'Некорректный Email',
      auth_error_company_short: 'Название компании должно содержать минимум 2 символа',
      auth_error_password_short_register: 'Пароль должен содержать минимум 6 символов',
      auth_error_email_taken: 'Этот email уже занят'
    },

    en: {
      nav_dashboard: 'Dashboard',
      nav_sales: 'Sales',
      nav_orders: 'Orders',
      nav_products: 'Products',
      nav_categories: 'Categories',
      nav_inventory: 'Inventory',
      nav_finance: 'Finance',
      nav_reports: 'Reports',
      nav_branches: 'Branches',
      nav_employees: 'Employees',
      nav_suppliers: 'Suppliers',
      nav_purchases: 'Purchases',
      nav_notifications: 'Notifications',
      nav_ai: 'ZAMIN AI',
      nav_profile: 'Profile',
      nav_settings: 'Settings',
      search_placeholder: 'Search: order, product, customer...',
      demo_badge: 'DEMO',
      admin_name: 'Admin ZAMIN',
      admin_role: 'Super Admin',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      confirm_title: 'Confirmation',
      confirm_continue: 'Yes, continue',
      dash_title: 'Dashboard',
      dash_subtitle: 'General business indicators',
      dash_total_sales: 'Total Sales',
      dash_net_profit: 'Net Profit',
      dash_orders: 'Orders',
      dash_products: 'Products',
      dash_last7: 'Last 7 days sales',
      dash_low_stock: 'Low stock products',
      dash_recent_orders: 'Recent orders',
      dash_by_branch: 'By branch',
      status_completed: 'Completed',
      status_pending: 'Pending',
      status_cancelled: 'Cancelled',
      status_paid: 'Paid',
      status_unpaid: 'Unpaid',
      currency: 'UZS',
      auth_company: 'Business management platform',
      auth_login_title: 'Sign in',
      auth_login_subtitle: 'Enter your credentials to access your account',
      auth_register_title: 'Register',
      auth_register_subtitle: 'Enter details to create a new company',
      auth_email: 'Email',
      auth_password: 'Password',
      auth_full_name: 'Full name',
      auth_company_name: 'Company name',
      auth_login_button: 'Login',
      auth_register_button: 'Register',
      auth_demo_account: 'Demo account:',
      auth_has_account: 'Already have an account?',
      auth_no_account: 'Don\'t have an account?',
      auth_sign_in: 'Login',
      auth_sign_up: 'Register',
      auth_error_email_invalid: 'Email format is invalid',
      auth_error_password_short: 'Password must be at least 4 characters',
      auth_error_invalid_credentials: 'Email or password is incorrect',
      auth_error_name_short: 'Name must be at least 2 characters',
      auth_error_email_invalid_simple: 'Email is invalid',
      auth_error_company_short: 'Company name must be at least 2 characters',
      auth_error_password_short_register: 'Password must be at least 6 characters',
      auth_error_email_taken: 'This email is already taken'
    }
  },

  t(key) {
    const lang = this.dict[this.currentLang] ? this.currentLang : 'uz';
    return this.dict[lang][key] || this.dict.uz[key] || key;
  },

  setLang(lang) {
    const nextLang = this.dict[lang] ? lang : 'uz';
    this.currentLang = nextLang;
    localStorage.setItem('zamin_lang', nextLang);
    this.apply();
  },

  init() {
    this.bindControls();
    this.apply();
  },

  bindControls() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setLang(btn.dataset.lang));
    });
  },

  apply() {
    document.documentElement.lang = this.currentLang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const translation = this.t(key);
      if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
        el.placeholder = translation;
      } else if (el.tagName === 'TEXTAREA' && el.hasAttribute('placeholder')) {
        el.placeholder = translation;
      } else {
        el.textContent = translation;
      }
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
    });

    if (typeof App !== 'undefined' && App.currentPage) {
      App.navigate(App.currentPage, true);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => I18n.init());