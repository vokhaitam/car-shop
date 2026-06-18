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

  // ===== MODAL FUNCTIONS =====
  const editProfileModal = document.getElementById("edit-profile-modal");
  const changePasswordModal = document.getElementById("change-password-modal");

  // Open Edit Profile Modal
  document
    .getElementById("modify-profile-btn")
    .addEventListener("click", function () {
      editProfileModal.classList.add("active");
    });

  document
    .getElementById("edit-personal-info")
    .addEventListener("click", function () {
      editProfileModal.classList.add("active");
    });

  // Open Change Password Modal
  document
    .getElementById("change-password-btn")
    .addEventListener("click", function () {
      changePasswordModal.classList.add("active");
    });

  // Close Modals
  document.getElementById("modal-close").addEventListener("click", function () {
    editProfileModal.classList.remove("active");
  });

  document
    .getElementById("modal-close-password")
    .addEventListener("click", function () {
      changePasswordModal.classList.remove("active");
    });

  // Close modal when clicking outside
  window.addEventListener("click", function (e) {
    if (e.target === editProfileModal) {
      editProfileModal.classList.remove("active");
    }
    if (e.target === changePasswordModal) {
      changePasswordModal.classList.remove("active");
    }
  });

  // ===== EDIT PROFILE FORM =====
  document
    .getElementById("edit-profile-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = {
        name: document.getElementById("edit-name").value,
        email: document.getElementById("edit-email").value,
        phone: document.getElementById("edit-phone").value,
        location: document.getElementById("edit-location").value,
      };

      // Simulate API call
      showNotification("Saving changes...", "info");

      setTimeout(() => {
        // Update profile display
        document.querySelector(".profile-name").textContent = formData.name;

        // Update info fields
        const inputs = document.querySelectorAll(".info-group input");
        inputs[0].value = formData.name;
        inputs[1].value = formData.email;
        inputs[2].value = formData.phone;
        inputs[3].value = formData.location;

        editProfileModal.classList.remove("active");
        showNotification("Profile updated successfully!", "success");
      }, 1000);
    });

  // ===== CHANGE PASSWORD FORM =====
  document
    .getElementById("change-password-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const currentPassword = document.getElementById("current-password").value;
      const newPassword = document.getElementById("new-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      // Validation
      if (newPassword !== confirmPassword) {
        showNotification("New passwords do not match!", "error");
        return;
      }

      if (newPassword.length < 6) {
        showNotification("Password must be at least 6 characters!", "error");
        return;
      }

      // Simulate API call
      showNotification("Changing password...", "info");

      setTimeout(() => {
        changePasswordModal.classList.remove("active");
        showNotification("Password changed successfully!", "success");
        this.reset();
      }, 1000);
    });

  // ===== SCHEDULE APPOINTMENT =====
  document
    .getElementById("schedule-appointment")
    .addEventListener("click", function () {
      showNotification("Redirecting to appointment scheduling...", "info");
      setTimeout(() => {
        window.location.href = "Shopping.html";
      }, 1000);
    });

  // ===== REMOVE FAVORITE =====
  document.querySelectorAll(".btn-remove-favorite").forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = this.closest(".favorite-car-card");
      const carName = card.querySelector("h4").textContent;

      if (confirm(`Remove ${carName} from favorites?`)) {
        card.style.animation = "fadeOut 0.3s ease";
        setTimeout(() => {
          card.remove();
          updateStats();
          showNotification("Removed from favorites", "info");
        }, 300);
      }
    });
  });

  // ===== SETTINGS BUTTONS =====
  document
    .getElementById("transaction-history-btn")
    .addEventListener("click", function () {
      showNotification("Transaction History - Coming soon!", "info");
    });

  document
    .getElementById("manage-favorites-btn")
    .addEventListener("click", function () {
      scrollToSection("favorites");
    });

  document
    .getElementById("viewing-history-btn")
    .addEventListener("click", function () {
      showNotification("Car Viewing History - Coming soon!", "info");
    });

  // ===== SCROLL TO SECTION =====
  window.scrollToSection = function (sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      section.style.animation = "highlight 1s ease";
      setTimeout(() => {
        section.style.animation = "";
      }, 1000);
    }
  };

  // ===== UPDATE STATS =====
  function updateStats() {
    const favoriteCards =
      document.querySelectorAll(".favorite-car-card").length;
    document.querySelectorAll(".stat-number")[1].textContent = favoriteCards;
  }

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

        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(0.9);
            }
        }

        @keyframes highlight {
            0%, 100% {
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            }
            50% {
                box-shadow: 0 10px 40px rgba(255, 107, 53, 0.4);
            }
        }
    `;
  document.head.appendChild(style);

  // ===== CONFIRM APPOINTMENT ACTION =====
  document.querySelectorAll(".appointment-item").forEach((item) => {
    item.addEventListener("click", function () {
      const carName = this.querySelector("h4").textContent;
      const status = this.querySelector(
        ".appointment-status",
      ).textContent.trim();
      showNotification(`${carName} - ${status}`, "info");
    });
  });

  // ===== WELCOME MESSAGE =====
  console.log(
    "%c👤 Welcome to your Account Dashboard!",
    "color: #ff6b35; font-size: 20px; font-weight: bold;",
  );
  console.log(
    "%cManage your profile, appointments, and favorites.",
    "color: #f7931e; font-size: 14px;",
  );
});
