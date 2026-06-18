document.addEventListener("DOMContentLoaded", function () {
  // ===== KIỂM TRA ĐĂNG NHẬP =====
  const token = localStorage.getItem("token");
  const loginBtn = document.querySelector(".btn-login");

  if (token) {
    if (loginBtn) {
      loginBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
      loginBtn.style.background =
        "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)";
      loginBtn.style.border = "none";
      loginBtn.style.padding = "12px 30px";
      loginBtn.style.borderRadius = "8px";
      loginBtn.style.fontWeight = "600";
      loginBtn.style.cursor = "pointer";
      loginBtn.style.display = "inline-flex";
      loginBtn.style.alignItems = "center";
      loginBtn.style.gap = "8px";
      loginBtn.style.textDecoration = "none";
      loginBtn.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem("token");
        alert("Đã đăng xuất!");
        window.location.href = "../Login page/Login.html";
      });
    }
  } else {
    // Chưa đăng nhập, giữ nguyên nút Login
    if (loginBtn) {
      loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
      loginBtn.style.background =
        "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)";
      loginBtn.style.border = "none";
      loginBtn.style.padding = "12px 30px";
      loginBtn.style.borderRadius = "8px";
      loginBtn.style.fontWeight = "600";
      loginBtn.style.cursor = "pointer";
      loginBtn.style.display = "inline-flex";
      loginBtn.style.alignItems = "center";
      loginBtn.style.gap = "8px";
      loginBtn.style.textDecoration = "none";
      loginBtn.href = "../Login page/Login.html";
    }
  }

  // ===== MOBILE MENU TOGGLE =====
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      hamburger.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach((n) =>
      n.addEventListener("click", () => {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
      }),
    );
  }

  // ===== SCROLL EFFECT FOR NAVBAR =====
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = "0 5px 20px rgba(0,0,0,0.3)";
    } else {
      navbar.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
    }
  });

  // ===== SMOOTH SCROLL FOR BUTTONS =====
  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      if (this.getAttribute("href") === "#") {
        e.preventDefault();
      }
    });
  });

  // ===== CAR CARD INTERACTIONS =====
  const carCards = document.querySelectorAll(".car-card");
  const viewDetailsBtns = document.querySelectorAll(".btn-view-details");

  viewDetailsBtns.forEach((btn, index) => {
    btn.addEventListener("click", function (event) {
      const carName = carCards[index].querySelector(".car-name").textContent;
      const carPrice = carCards[index].querySelector(".car-price").textContent;
      showNotification(`Viewing details for ${carName} - Price: ${carPrice}`);
      createRipple(this, event);
    });
  });

  // ===== HERO BUTTONS =====
  const heroBtns = document.querySelectorAll(".hero .btn");
  heroBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const btnText = this.textContent.trim();
      showNotification(`${btnText} - Feature coming soon!`);
    });
  });

  // ===== FEATURE CARDS HOVER EFFECT =====
  const featureCards = document.querySelectorAll(".feature-card");
  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });
    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // ===== SCROLL ANIMATION (Intersection Observer) =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  carCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });

  featureCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `all 0.6s ease ${index * 0.2}s`;
    observer.observe(card);
  });

  // ===== NOTIFICATION FUNCTION =====
  function showNotification(message) {
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) existingNotification.remove();

    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `
      <i class="fas fa-info-circle"></i>
      <span>${message}</span>
    `;

    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // ===== RIPPLE EFFECT =====
  function createRipple(button, event) {
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(255,255,255,0.6);
      left: ${x}px;
      top: ${y}px;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;

    button.style.position = "relative";
    button.style.overflow = "hidden";
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  // ===== ADD CSS ANIMATIONS DYNAMICALLY =====
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(400px); opacity: 0; }
    }
    @keyframes ripple {
      to { transform: scale(2); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // ===== NAV LINK ACTIVE STATE =====
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // ===== PRICE ANIMATION ON HOVER =====
  const carPrices = document.querySelectorAll(".car-price");
  carPrices.forEach((price) => {
    price.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1)";
      this.style.transition = "transform 0.3s ease";
    });
    price.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });

  console.log(
    "%c🚗 Welcome to Autohub!",
    "color: #ff6b35; font-size: 24px; font-weight: bold;",
  );
  console.log(
    "%cYour premium car showroom experience starts here.",
    "color: #f7931e; font-size: 14px;",
  );
});
