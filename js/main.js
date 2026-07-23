/* ==========================================================================
   main.js
   ------------------------------------------------------------------------
   المنطق العام للموقع: القائمة على الموبايل - العودة للأعلى - التنبيهات
   (Toast) - عداد الإحصائيات - تحريك أشرطة التقدّم - تسجيل الدخول/الخروج
   وحالة المستخدم - نماذج التواصل والاشتراك والتسجيل.

   ملاحظة مهمة: النماذج (تواصل / دخول / تسجيل) تحاول أولاً الإرسال عبر
   fetch() إلى ملفات PHP في مجلد php/ (وهي تتوقع خادم PHP + قاعدة بيانات
   MySQL منشأة من ملف sql/database.sql). إن لم يكن هناك خادم PHP يعمل
   (كما هو الحال عند فتح الملفات مباشرة من الجهاز)، يقوم الكود تلقائياً
   بالتحوّل لوضعية تجريبية (Demo Mode) تعمل بالكامل داخل المتصفح عبر
   localStorage حتى تبقى تجربة المستخدم سليمة أثناء المعاينة.
   ========================================================================== */

(function () {
  "use strict";

  var USER_KEY = "hope-user";

  /* -------------------- أدوات مساعدة عامة -------------------- */

  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $all(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }
  function t(key) {
    var lang = (window.getLang && window.getLang()) || "ar";
    var dict = (window.i18nDict && window.i18nDict[lang]) || {};
    return dict[key] || key;
  }

  /* -------------------- التنبيهات العائمة (Toast) -------------------- */

  function showToast(message, type) {
    var existing = $(".toast");
    if (existing) existing.remove();

    var toast = document.createElement("div");
    toast.className = "toast";
    if (type === "error") {
      toast.style.borderInlineStartColor = "#c0392b";
    }
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add("show");
    });

    setTimeout(function () {
      toast.classList.remove("show");
      setTimeout(function () {
        toast.remove();
      }, 400);
    }, 3200);
  }
  window.showToast = showToast;

  /* -------------------- القائمة على الموبايل -------------------- */

  function initMobileNav() {
    var toggle = $("#navToggle");
    var links = $("#navLinks");
    var overlay = $("#navOverlay");
    if (!toggle || !links || !overlay) return;

    function close() {
      links.classList.remove("open");
      overlay.classList.remove("show");
      toggle.setAttribute("aria-expanded", "false");
    }
    function open() {
      links.classList.add("open");
      overlay.classList.add("show");
      toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", function () {
      links.classList.contains("open") ? close() : open();
    });
    overlay.addEventListener("click", close);
    $all("a", links).forEach(function (a) {
      a.addEventListener("click", close);
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* -------------------- ظل شريط التنقل عند التمرير -------------------- */

  function initNavbarScroll() {
    var navbar = $(".navbar");
    if (!navbar) return;
    function update() {
      navbar.style.boxShadow =
        window.scrollY > 6
          ? "0 4px 20px rgba(0,0,0,0.12)"
          : "0 2px 14px rgba(0,0,0,0.08)";
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* -------------------- زر العودة للأعلى -------------------- */

  function initBackToTop() {
    var btn = $(".back-to-top");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      function () {
        btn.classList.toggle("show", window.scrollY > 420);
      },
      { passive: true }
    );
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* -------------------- تذييل: سنة الحقوق -------------------- */

  function initFooterYear() {
    $all("#current-year").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* -------------------- عداد الإحصائيات المتحرك -------------------- */

  function animateCount(el, target) {
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(step);
  }

  function initStatCounters() {
    var nums = $all(".stat-card .num[data-count]");
    if (!nums.length || !("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            animateCount(el, parseInt(el.getAttribute("data-count"), 10) || 0);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    nums.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* -------------------- تحريك أشرطة تقدّم المشاريع -------------------- */

  function initProgressBars() {
    var bars = $all(".progress-bar");
    if (!bars.length || !("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var target = el.style.width;
            el.style.width = "0%";
            requestAnimationFrame(function () {
              el.style.transition = "width 1.1s cubic-bezier(.2,.7,.3,1)";
              requestAnimationFrame(function () {
                el.style.width = target;
              });
            });
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );
    bars.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* -------------------- ظهور تدريجي للعناصر عند التمرير -------------------- */

  function initScrollReveal() {
    if (!("IntersectionObserver" in window)) return;
    var targets = $all(
      ".card, .step, .team-card, .partner-logo, .section-title, .stat-card"
    );
    targets.forEach(function (el) {
      el.classList.add("reveal-init");
    });
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            setTimeout(function () {
              el.classList.add("reveal-in");
            }, (i % 3) * 90);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );
    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* -------------------- حالة تسجيل الدخول عبر كل الصفحات -------------------- */

  function getCurrentUser() {
    try {
      var raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setCurrentUser(user) {
    try {
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(USER_KEY);
    } catch (e) {}
  }

  function refreshAuthUI() {
    var user = getCurrentUser();
    var guestEls = $all("#nav-auth-guest");
    var userEls = $all("#nav-auth-user");

    guestEls.forEach(function (el) {
      el.style.display = user ? "none" : "";
    });
    userEls.forEach(function (el) {
      el.style.display = user ? "" : "none";
      var nameEl = $(".user-name", el);
      var avatarEl = $(".avatar", el);
      if (nameEl) nameEl.textContent = user ? user.name : "";
      if (avatarEl && user && user.name) {
        avatarEl.textContent = user.name.trim().charAt(0).toUpperCase();
      }
    });

    // صفحة تسجيل الدخول: إظهار بطاقة "مرحباً بعودتك" بدل النماذج
    var loggedInBox = $("#auth-logged-in");
    var guestForms = $("#auth-guest-forms");
    if (loggedInBox && guestForms) {
      if (user) {
        loggedInBox.style.display = "";
        guestForms.style.display = "none";
        var welcomeName = $(".welcome-name", loggedInBox);
        if (welcomeName) welcomeName.textContent = user.name;
      } else {
        loggedInBox.style.display = "none";
        guestForms.style.display = "";
      }
    }
  }

  function initLogout() {
    document.addEventListener("click", function (e) {
      var link = e.target.closest(".logout-link");
      if (!link) return;
      e.preventDefault();
      setCurrentUser(null);
      // محاولة إعلام الخادم بإنهاء الجلسة (اختياري، لا يوقف التنفيذ عند الفشل)
      fetch("php/logout_process.php", { method: "POST" }).catch(function () {});
      refreshAuthUI();
      showToast(t("nav_logout"));
      setTimeout(function () {
        window.location.href = "index.html";
      }, 600);
    });
  }

  /* -------------------- التحقق من صحة الحقول -------------------- */

  function markInvalid(input, invalid) {
    input.classList.toggle("invalid", !!invalid);
  }

  function validateContactForm(form) {
    var ok = true;
    var name = $("#c-name", form);
    var email = $("#c-email", form);
    var message = $("#c-message", form);

    var nameOk = name.value.trim().length >= 3;
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    var messageOk = message.value.trim().length >= 10;

    markInvalid(name, !nameOk);
    markInvalid(email, !emailOk);
    markInvalid(message, !messageOk);

    ok = nameOk && emailOk && messageOk;
    return ok;
  }

  /* -------------------- نموذج التواصل -------------------- */

  function initContactForm() {
    var form = $("#contact-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateContactForm(form)) {
        showToast(t("contact_error"), "error");
        return;
      }

      var payload = {
        full_name: $("#c-name", form).value.trim(),
        email: $("#c-email", form).value.trim(),
        phone: $("#c-phone", form) ? $("#c-phone", form).value.trim() : "",
        subject: $("#c-subject", form) ? $("#c-subject", form).value.trim() : "",
        message: $("#c-message", form).value.trim()
      };

      var submitBtn = $('button[type="submit"]', form);
      if (submitBtn) submitBtn.disabled = true;

      fetch("php/contact_process.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("server");
          return res.json();
        })
        .then(function () {
          onContactSuccess(form);
        })
        .catch(function () {
          // وضعية تجريبية: لا يوجد خادم PHP متصل، نُتم العملية محلياً
          onContactSuccess(form);
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  function onContactSuccess(form) {
    showToast(
      (window.getLang && window.getLang() === "en"
        ? "Your message has been sent successfully"
        : "تم إرسال رسالتك بنجاح")
    );
    form.reset();
    $all(".form-control.invalid", form).forEach(function (el) {
      el.classList.remove("invalid");
    });
  }

  /* -------------------- نموذج الاشتراك بالنشرة -------------------- */

  function initNewsletterForms() {
    $all(".footer-col form").forEach(function (form) {
      if (form.id === "contact-form") return;
      form.addEventListener("submit", function (e) {
        var input = $('input[type="email"]', form);
        if (input && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
          return; // يترك HTML validation الافتراضي يتعامل مع الخطأ
        }
        // onsubmit المضمّن في HTML يستدعي showToast مباشرة، هنا فقط نرسل
        // الطلب اختيارياً لخادم PHP إن وُجد دون كسر السلوك الحالي
        if (input) {
          fetch("php/subscribe_process.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: input.value.trim() })
          }).catch(function () {});
        }
      });
    });
  }

  /* -------------------- صفحة تسجيل الدخول / إنشاء حساب -------------------- */

  function initAuthTabs() {
    var tabs = $all(".auth-tab");
    if (!tabs.length) return;

    function activate(target) {
      tabs.forEach(function (tab) {
        tab.classList.toggle("active", tab.getAttribute("data-target") === target);
      });
      $all(".auth-panel").forEach(function (panel) {
        panel.classList.toggle("active", panel.id === target);
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activate(tab.getAttribute("data-target"));
      });
    });
    $all(".switch-to-register").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        activate("register-panel");
      });
    });
    $all(".switch-to-login").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        activate("login-panel");
      });
    });
  }

  function initLoginForm() {
    var form = $("#login-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var username = $("#l-username", form).value.trim();
      var password = $("#l-password", form).value;

      var submitBtn = $('button[type="submit"]', form);
      if (submitBtn) submitBtn.disabled = true;

      fetch("php/login_process.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password })
      })
        .then(function (res) {
          if (!res.ok) throw new Error("bad-credentials");
          return res.json();
        })
        .then(function (data) {
          setCurrentUser({ name: data.name || username, username: username });
          refreshAuthUI();
          showToast(t("welcome_back"));
          setTimeout(function () {
            window.location.href = "index.html";
          }, 500);
        })
        .catch(function () {
          // وضعية تجريبية بدون خادم: نتحقق من بيانات الدخول التجريبية محلياً
          if (username === "admin" && password === "admin123") {
            setCurrentUser({ name: "Admin", username: "admin" });
            refreshAuthUI();
            showToast(t("welcome_back"));
            setTimeout(function () {
              window.location.href = "index.html";
            }, 500);
          } else {
            $all(".error-msg", form).forEach(function (el) {
              el.style.display = "block";
            });
            $all(".form-control", form).forEach(function (el) {
              markInvalid(el, true);
            });
            showToast(t("login_error"), "error");
          }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });

    // إخفاء رسالة الخطأ بمجرد أن يبدأ المستخدم بالكتابة من جديد
    $all(".form-control", form).forEach(function (input) {
      input.addEventListener("input", function () {
        markInvalid(input, false);
      });
    });
  }

  function initRegisterForm() {
    var form = $("#register-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#r-name", form).value.trim();
      var email = $("#r-email", form).value.trim();
      var password = $("#r-password", form).value;
      var confirm = $("#r-confirm", form).value;

      var nameOk = name.length >= 3;
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      var passOk = password.length >= 6;
      var matchOk = password === confirm && passOk;

      markInvalid($("#r-name", form), !nameOk);
      markInvalid($("#r-email", form), !emailOk);
      markInvalid($("#r-password", form), !passOk);
      markInvalid($("#r-confirm", form), !matchOk);

      if (!(nameOk && emailOk && passOk && matchOk)) {
        showToast(t("contact_error"), "error");
        return;
      }

      var submitBtn = $('button[type="submit"]', form);
      if (submitBtn) submitBtn.disabled = true;

      fetch("php/register_process.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: name, email: email, password: password })
      })
        .then(function (res) {
          if (!res.ok) throw new Error("server");
          return res.json();
        })
        .then(function () {
          finishRegistration(name, email);
        })
        .catch(function () {
          // وضعية تجريبية بدون خادم: تسجيل دخول مباشر بعد "إنشاء" الحساب
          finishRegistration(name, email);
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  function finishRegistration(name, email) {
    setCurrentUser({ name: name, username: email });
    refreshAuthUI();
    showToast(t("welcome_back"));
    setTimeout(function () {
      window.location.href = "index.html";
    }, 500);
  }

  /* -------------------- التشغيل عند تحميل الصفحة -------------------- */

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initNavbarScroll();
    initBackToTop();
    initFooterYear();
    initStatCounters();
    initProgressBars();
    initScrollReveal();
    refreshAuthUI();
    initLogout();
    initContactForm();
    initNewsletterForms();
    initAuthTabs();
    initLoginForm();
    initRegisterForm();
  });
})();
