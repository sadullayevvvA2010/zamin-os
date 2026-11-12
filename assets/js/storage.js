
"use strict";

window.ZaminStorage = {
  prefix: "zaminOS_",

  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
      console.error("O‘qish xatosi:", error);
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(
        this.prefix + key,
        JSON.stringify(value)
      );
      return true;
    } catch (error) {
      console.error("Saqlash xatosi:", error);
      return false;
    }
  },

  loadData() {
    if (!window.ZaminData) return;

    [
      "products",
      "orders",
      "branches",
      "employees",
      "suppliers"
    ].forEach(key => {
      const saved = this.get(key, null);

      if (Array.isArray(saved)) {
        window.ZaminData[key] = saved;
      } else if (Array.isArray(window.ZaminData[key])) {
        this.set(key, window.ZaminData[key]);
      }
    });
  },

  saveData(key) {
    if (!window.ZaminData || !Array.isArray(window.ZaminData[key])) {
      return false;
    }

    return this.set(key, window.ZaminData[key]);
  },

  clearDemoData() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }
};

window.ZaminStorage.loadData();

