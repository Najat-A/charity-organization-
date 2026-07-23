/* ==========================================================================
   theme.js
   ------------------------------------------------------------------------
   يتحكم في تبديل ثيم ألوان الموقع (أخضر / أزرق / برتقالي / بنفسجي).
   يعمل عبر تغيير خاصية data-theme على وسم <html> فقط، وكل الألوان
   تتغير تلقائياً لأنها معرّفة كمتغيرات CSS في ملف themes.css.
   يحفظ اختيار المستخدم في localStorage ليبقى ثابتاً بين الصفحات.
   ========================================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "hope-theme";
  var DEFAULT_THEME = "green";

  function getTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    } catch (e) {
      return DEFAULT_THEME;
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelectorAll(".swatch").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-theme-value") === theme);
    });
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
  }

  window.getTheme = getTheme;
  window.applyTheme = applyTheme;

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(getTheme());
    document.querySelectorAll(".swatch").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyTheme(btn.getAttribute("data-theme-value"));
      });
    });
  });
})();
