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

  // ===== CART DATA =====
  let cartItems = [
    {
      id: 1,
      name: "Mercedes-Benz C-Class",
      price: 1850000000,
      image:
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=300",
      badge: "Best Seller",
      rating: 4.9,
      reviews: 128,
    },
    {
      id: 2,
      name: "BMW 5 Series",
      price: 2450000000,
      image: "https://images.unsplash.com/photo-1555215695-3004980adade?w=300",
      rating: 4.8,
      reviews: 96,
    },
  ];

  let savedItems = [];
  let selectedInstallment = 12;

  // ===== INITIALIZE =====
  updateCartDisplay();
  setupEventListeners();

  // ===== EVENT LISTENERS =====
  function setupEventListeners() {
    // Remove buttons
    document.querySelectorAll(".btn-remove").forEach((btn) => {
      btn.addEventListener("click", function () {
        const itemId = parseInt(this.getAttribute("data-id"));
        removeItem(itemId);
      });
    });

    // Save for later buttons
    document.querySelectorAll(".btn-save-later").forEach((btn) => {
      btn.addEventListener("click", function () {
        const itemId = parseInt(this.getAttribute("data-id"));
        saveForLater(itemId);
      });
    });

    // Clear cart
    document
      .getElementById("clear-cart")
      .addEventListener("click", function () {
        if (confirm("Are you sure you want to clear all items?")) {
          cartItems = [];
          updateCartDisplay();
        }
      });

    // Installment options
    document.querySelectorAll(".installment-option").forEach((option) => {
      option.addEventListener("click", function () {
        document
          .querySelectorAll(".installment-option")
          .forEach((o) => o.classList.remove("active"));
        this.classList.add("active");
        selectedInstallment = parseInt(this.getAttribute("data-months"));
      });
    });

    // Apply promo code
    document
      .getElementById("apply-promo")
      .addEventListener("click", function () {
        const promoCode = document.getElementById("promo-code").value.trim();
        if (promoCode) {
          applyPromoCode(promoCode);
        }
      });

    // Schedule viewing button
    document
      .getElementById("schedule-viewing")
      .addEventListener("click", function () {
        openModal();
      });

    // Modal close
    document
      .getElementById("modal-close")
      .addEventListener("click", closeModal);

    // Close modal when clicking outside
    document
      .getElementById("schedule-modal")
      .addEventListener("click", function (e) {
        if (e.target === this) {
          closeModal();
        }
      });

    // Schedule form submit
    document
      .getElementById("schedule-form")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        submitScheduleForm();
      });

    // Consultation button
    document
      .querySelector(".btn-consultation")
      .addEventListener("click", function () {
        showNotification(
          "Our team will contact you within 24 hours!",
          "success",
        );
      });
  }

  // ===== CART FUNCTIONS =====
  function removeItem(itemId) {
    const item = document.querySelector(`.cart-item[data-id="${itemId}"]`);
    if (item) {
      item.style.animation = "slideOut 0.4s ease";
      setTimeout(() => {
        cartItems = cartItems.filter((item) => item.id !== itemId);
        updateCartDisplay();
        showNotification("Item removed from cart", "info");
      }, 400);
    }
  }

  function saveForLater(itemId) {
    const item = cartItems.find((i) => i.id === itemId);
    if (item) {
      savedItems.push(item);
      cartItems = cartItems.filter((i) => i.id !== itemId);
      updateCartDisplay();
      showNotification("Item saved for later", "success");
    }
  }

  function updateCartDisplay() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");

    // Update cart count
    cartCount.textContent = `${cartItems.length} vehicle${cartItems.length !== 1 ? "s" : ""} in your selected list`;

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const registrationFee = subtotal * 0.1;
    const insurance = 50000000;
    const total = subtotal + registrationFee + insurance;

    // Update summary
    document.getElementById("subtotal").textContent = formatPrice(subtotal);
    document.getElementById("registration-fee").textContent =
      formatPrice(registrationFee);
    document.getElementById("insurance").textContent = formatPrice(insurance);
    document.getElementById("total-amount").textContent = formatPrice(total);

    // Update installment display
    updateInstallmentDisplay(total);

    // Show empty state if no items
    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Start shopping to add items to your cart</p>
                    <a href="Home.html" class="btn-continue">
                        <i class="fas fa-arrow-left"></i> Continue Shopping
                    </a>
                </div>
            `;
    }

    // Show/hide saved items section
    const savedSection = document.getElementById("saved-section");
    if (savedItems.length > 0) {
      savedSection.style.display = "block";
      renderSavedItems();
    } else {
      savedSection.style.display = "none";
    }
  }

  function updateInstallmentDisplay(total) {
    const downPayment = total * 0.2;
    const loanAmount = total - downPayment;

    document.querySelectorAll(".installment-option").forEach((option) => {
      const months = parseInt(option.getAttribute("data-months"));
      const monthlyPayment = loanAmount / months;
      option.querySelector(".option-price").textContent =
        `~${formatPrice(monthlyPayment)}/month`;
    });
  }

  function renderSavedItems() {
    const savedContainer = document.getElementById("saved-items");
    savedContainer.innerHTML = savedItems
      .map(
        (item) => `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3 class="item-name">${item.name}</h3>
                    <div class="item-price">${formatPrice(item.price)}</div>
                </div>
                <div class="item-actions">
                    <button class="btn-move-to-cart" data-id="${item.id}">
                        <i class="fas fa-shopping-cart"></i> Move to cart
                    </button>
                </div>
            </div>
        `,
      )
      .join("");

    // Add event listeners for move to cart
    savedContainer.querySelectorAll(".btn-move-to-cart").forEach((btn) => {
      btn.addEventListener("click", function () {
        const itemId = parseInt(this.getAttribute("data-id"));
        moveToCart(itemId);
      });
    });
  }

  function moveToCart(itemId) {
    const item = savedItems.find((i) => i.id === itemId);
    if (item) {
      cartItems.push(item);
      savedItems = savedItems.filter((i) => i.id !== itemId);
      updateCartDisplay();
      showNotification("Item moved to cart", "success");
    }
  }

  // ===== PROMO CODE =====
  function applyPromoCode(code) {
    const validCodes = {
      AUTOHUB10: 10,
      WELCOME20: 20,
      VIP50: 50,
    };

    if (validCodes[code.toUpperCase()]) {
      const discount = validCodes[code.toUpperCase()];
      const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
      const discountAmount = subtotal * (discount / 100);

      document.getElementById("discount-row").style.display = "flex";
      document.getElementById("discount-amount").textContent =
        `-${formatPrice(discountAmount)}`;

      showNotification(`Promo code applied! ${discount}% discount`, "success");
    } else {
      showNotification("Invalid promo code", "error");
    }
  }

  // ===== MODAL FUNCTIONS =====
  function openModal() {
    document.getElementById("schedule-modal").classList.add("active");
    document.body.style.overflow = "hidden";

    // Set minimum date to today
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("schedule-date").setAttribute("min", today);
  }

  function closeModal() {
    document.getElementById("schedule-modal").classList.remove("active");
    document.body.style.overflow = "auto";
  }

  function submitScheduleForm() {
    const formData = {
      name: document.getElementById("schedule-name").value,
      phone: document.getElementById("schedule-phone").value,
      email: document.getElementById("schedule-email").value,
      date: document.getElementById("schedule-date").value,
      time: document.getElementById("schedule-time").value,
      location: document.getElementById("schedule-location").value,
    };

    // Simulate API call
    showNotification("Scheduling appointment...", "info");

    setTimeout(() => {
      closeModal();
      showNotification(
        "Appointment scheduled successfully! We will confirm shortly.",
        "success",
      );
      document.getElementById("schedule-form").reset();
    }, 1500);
  }

  // ===== UTILITY FUNCTIONS =====
  function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  }

  function showNotification(message, type = "info") {
    // Remove existing notification
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

  // Add CSS animations
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(20px);
            }
        }

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

        .empty-cart {
            text-align: center;
            padding: 60px 20px;
        }

        .empty-cart i {
            font-size: 80px;
            color: var(--gray-color);
            margin-bottom: 20px;
        }

        .empty-cart h3 {
            font-size: 24px;
            color: var(--dark-color);
            margin-bottom: 10px;
        }

        .empty-cart p {
            color: var(--text-light);
            margin-bottom: 30px;
        }
    `;
  document.head.appendChild(style);
});
