// Đợi trang load xong
document.addEventListener("DOMContentLoaded", function () {
  // ===== 1. HIỆU ỨNG FADE-IN KHI LOAD TRANG =====
  const loginContainer = document.querySelector(".login-container");
  if (loginContainer) {
    loginContainer.style.opacity = "0";
    loginContainer.style.transform = "translateY(30px)";
    loginContainer.style.transition = "all 0.6s ease";
    setTimeout(() => {
      loginContainer.style.opacity = "1";
      loginContainer.style.transform = "translateY(0)";
    }, 100);
  }

  // ===== 2. HIỆU ỨNG CHO INPUT =====
  const inputs = document.querySelectorAll(".input-wrapper input");
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      const wrapper = this.parentElement;
      wrapper.style.transform = "scale(1.02)";
      wrapper.style.transition = "transform 0.3s ease";
    });
    input.addEventListener("blur", function () {
      const wrapper = this.parentElement;
      wrapper.style.transform = "scale(1)";
    });
  });

  // ===== 3. HIỆU ỨNG CHO CHECKBOX =====
  const checkbox = document.querySelector(".remember-me input");
  if (checkbox) {
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        this.parentElement.style.transform = "scale(1.05)";
        setTimeout(() => {
          this.parentElement.style.transform = "scale(1)";
        }, 200);
      }
    });
  }

  // ===== 4. HIỆU ỨNG CHO LINK =====
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      this.style.transform = "translateX(5px)";
      this.style.transition = "transform 0.2s ease";
    });
    link.addEventListener("mouseleave", function () {
      this.style.transform = "translateX(0)";
    });
  });

  // ===== 5. HIỆU ỨNG ICON XOAY =====
  const icon = document.querySelector(".icon");
  if (icon) {
    icon.addEventListener("mouseenter", function () {
      this.style.transform = "rotate(360deg)";
      this.style.transition = "transform 0.6s ease";
    });
    icon.addEventListener("mouseleave", function () {
      this.style.transform = "rotate(0deg)";
    });
  }

  // ===== 6. SOCIAL BUTTONS =====
  const socialBtns = document.querySelectorAll(".social-btn");
  socialBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const platform = this.textContent.trim();
      alert(`Login with ${platform} (Tính năng đang phát triển)`);
    });
  });

  // ===== 7. ĐĂNG NHẬP API =====
  const loginForm = document.querySelector(".login-form");
  const loginBtn = document.querySelector(".login-btn");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!email || !password) {
        alert("Vui lòng nhập đầy đủ email và mật khẩu!");
        return;
      }

      // Hiệu ứng loading
      const originalText = loginBtn.innerHTML;
      loginBtn.disabled = true;
      loginBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Đang đăng nhập...';
      loginBtn.style.opacity = "0.7";

      try {
        // Giả lập API call (thay bằng URL thật của bạn)
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (data.success) {
          localStorage.setItem("token", data.token);
          window.location.href = "/Home page/Home.html";
        } else {
          loginBtn.innerHTML = '<i class="fas fa-times"></i> Thất bại!';
          loginBtn.style.background =
            "linear-gradient(135deg, #f56565 0%, #e53e3e 100%)";

          setTimeout(() => {
            loginBtn.innerHTML = originalText;
            loginBtn.style.background = "";
            loginBtn.style.opacity = "1";
            loginBtn.disabled = false;
          }, 1500);

          alert(data.error || "Sai email hoặc mật khẩu!");
        }
      } catch (error) {
        console.error("Lỗi: ", error);
        alert("Lỗi kết nối server!");

        loginBtn.innerHTML = originalText;
        loginBtn.style.opacity = "1";
        loginBtn.disabled = false;
      }
    });
  }
});

// Thêm keyframes cho hiệu ứng shake
const style = document.createElement("style");
style.textContent = `@keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); } 20%, 40%, 60%, 80% { transform: translateX(10px); } }`;
document.head.appendChild(style);
