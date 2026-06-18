document.addEventListener("DOMContentLoaded", function () {
  // ===== KIỂM TRA ĐĂNG NHẬP =====
  const token = localStorage.getItem("token");
  const loginBtn = document.querySelector(".btn-login");

  if (token) {
    // Nếu đã đăng nhập, đổi nút Login thành Logout
    if (loginBtn) {
      loginBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
      loginBtn.style.background =
        "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)";
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
      loginBtn.style.background = "";
      loginBtn.addEventListener("click", function () {
        window.location.href = "../Login page/Login.html";
      });
    }
  }

  // ===== CONTACT METHOD CARDS =====
  const methodCards = document.querySelectorAll(".method-card");

  methodCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Remove active from all
      methodCards.forEach((c) => c.classList.remove("active"));

      // Add active to clicked
      this.classList.add("active");

      const method = this.getAttribute("data-method");
      showNotification(
        `Selected: ${method.charAt(0).toUpperCase() + method.slice(1)}`,
        "success",
      );
    });
  });

  // ===== CONSULTATION FORM =====
  const consultationForm = document.getElementById("consultation-form");
  const successModal = document.getElementById("success-modal");

  consultationForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      fullname: document.getElementById("fullname").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      carModel: document.getElementById("car-model").value,
      content: document.getElementById("content").value,
    };

    // Validation
    if (!formData.fullname || !formData.email || !formData.phone) {
      showNotification("Please fill in all required fields!", "error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showNotification("Please enter a valid email address!", "error");
      return;
    }

    // Phone validation (Vietnamese)
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      showNotification(
        "Please enter a valid Vietnamese phone number!",
        "error",
      );
      return;
    }

    // Show loading state
    const submitBtn = this.querySelector(".btn-submit");
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      // Show success modal
      successModal.classList.add("active");
      document.body.style.overflow = "hidden";

      // Reset form
      this.reset();

      // Log form data
      console.log("Form submitted:", formData);
    }, 1500);
  });

  // ===== CLOSE MODAL =====
  document
    .getElementById("close-success-modal")
    .addEventListener("click", function () {
      successModal.classList.remove("active");
      document.body.style.overflow = "auto";
    });

  // Close modal when clicking outside
  successModal.addEventListener("click", function (e) {
    if (e.target === this) {
      this.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  // ===== GET OFFER BUTTON =====
  document
    .getElementById("get-offer-btn")
    .addEventListener("click", function () {
      showNotification(
        " Special offer code: AUTOHUB100 - Apply when booking!",
        "success",
      );

      // Add animation to button
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);
    });

  // ===== REAL-TIME VALIDATION =====
  const inputs = document.querySelectorAll(
    ".form-group input, .form-group textarea, .form-group select",
  );

  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      if (this.value && !this.checkValidity()) {
        this.style.borderColor = "var(--danger-color)";
        this.style.background = "rgba(245, 101, 101, 0.05)";
      } else if (this.value) {
        this.style.borderColor = "var(--success-color)";
        this.style.background = "rgba(72, 187, 120, 0.05)";
      }
    });

    input.addEventListener("focus", function () {
      this.style.borderColor = "var(--primary-color)";
      this.style.background = "var(--white)";
    });
  });

  // ===== AUTO-RESIZE TEXTAREA =====
  const textarea = document.getElementById("content");
  textarea.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = Math.max(120, this.scrollHeight) + "px";
  });

  // ===== CHARACTER COUNTER FOR TEXTAREA =====
  const contentWrapper = document.querySelector(".form-group:last-of-type");
  const charCounter = document.createElement("div");
  charCounter.style.cssText = `
        text-align: right;
        font-size: 12px;
        color: var(--text-light);
        margin-top: 5px;
    `;
  contentWrapper.appendChild(charCounter);

  textarea.addEventListener("input", function () {
    const length = this.value.length;
    charCounter.textContent = `${length}/500 characters`;

    if (length > 450) {
      charCounter.style.color = "var(--danger-color)";
    } else if (length > 300) {
      charCounter.style.color = "var(--warning-color)";
    } else {
      charCounter.style.color = "var(--text-light)";
    }
  });

  // ===== NOTIFICATION FUNCTION =====
  function showNotification(message, type = "info") {
    const existing = document.querySelector(".notification");
    if (existing) existing.remove();

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;

    const icons = {
      success: "fa-check-circle",
      error: "fa-exclamation-circle",
      info: "fa-info-circle",
    };

    const colors = {
      success: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
      error: "linear-gradient(135deg, #f56565 0%, #e53e3e 100%)",
      info: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
    };

    notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.3s ease;
            font-weight: 600;
        `;

    notification.innerHTML = `
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // ===== ADD CSS ANIMATIONS =====
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);

  // ===== SCROLL ANIMATIONS =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe cards
  document
    .querySelectorAll(".method-card, .section-card, .info-card, .offer-card")
    .forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = `all 0.6s ease ${index * 0.1}s`;
      observer.observe(card);
    });

  // ===== KEYBOARD SHORTCUTS =====
  document.addEventListener("keydown", function (e) {
    // ESC to close modal
    if (e.key === "Escape") {
      successModal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  // ===== CONSOLE LOG =====
  console.log(
    "%c📞 Contact Page Loaded!",
    "color: #ff6b35; font-size: 20px; font-weight: bold;",
  );
  console.log(
    "%cWe're here to help you find your dream car!",
    "color: #f7931e; font-size: 14px;",
  );
});
