document.addEventListener("DOMContentLoaded", function () {
  // ===== HIỆU ỨNG CHO NÚT REGISTER + GỌI API =====
  const form = document.querySelector("form");
  const registerBtn = document.querySelector(".register-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Lấy dữ liệu từ form
    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const phone = document.getElementById("phone")?.value.trim() || "";
    const location = document.getElementById("location")?.value.trim() || "";
    const dob = document.getElementById("dob")?.value || "";
    const terms = document.getElementById("terms").checked;

    // Kiểm tra checkbox
    if (!terms) {
      const container = document.querySelector(".register-container");
      container.style.animation = "none";
      setTimeout(() => {
        container.style.animation = "shake 0.5s ease";
      }, 10);
      alert("Please agree to the Terms of service policy!");
      return;
    }

    // Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    // Kiểm tra mật khẩu đủ dài
    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    // Hiệu ứng loading
    const originalText = registerBtn.textContent;
    const originalBg = registerBtn.style.background;
    registerBtn.disabled = true;
    registerBtn.textContent = "Registering...";
    registerBtn.style.opacity = "0.8";

    try {
      // GỌI API ĐĂNG KÝ
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          fullname: fullname,
          phone: phone,
          address: location,
          dob: dob || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Hiệu ứng thành công
        registerBtn.textContent = "✓ Success!";
        registerBtn.style.background =
          "linear-gradient(135deg, #48bb78 0%, #38a169 100%)";

        setTimeout(() => {
          // Chuyển thẳng sang login, không cần alert
          window.location.href = "/Login page/Login.html";
        }, 500);
      } else {
        // Hiệu ứng thất bại
        registerBtn.textContent = "✗ Failed!";
        registerBtn.style.background =
          "linear-gradient(135deg, #f56565 0%, #e53e3e 100%)";

        setTimeout(() => {
          registerBtn.textContent = originalText;
          registerBtn.style.background = originalBg;
          registerBtn.style.opacity = "1";
          registerBtn.disabled = false;
        }, 1500);

        alert(data.error || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi kết nối server! Vui lòng kiểm tra server đã chạy chưa.");

      registerBtn.textContent = originalText;
      registerBtn.style.background = originalBg;
      registerBtn.style.opacity = "1";
      registerBtn.disabled = false;
    }
  });

  // ===== HIỆU ỨNG CHO NÚT SOCIAL =====
  const socialBtns = document.querySelectorAll(".social-btn");
  socialBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const platform = this.textContent;
      const originalTransform = this.style.transform;

      this.style.transform = "scale(0.95)";

      setTimeout(() => {
        this.style.transform = originalTransform;
        alert(`Login with ${platform} (Tính năng đang phát triển)`);
      }, 150);
    });
  });

  // ===== HIỆU ỨNG CHO INPUT =====
  const inputs = document.querySelectorAll(".input-wrapper input");
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.style.transform = "scale(1.02)";
      this.parentElement.style.transition = "transform 0.3s ease";
    });

    input.addEventListener("blur", function () {
      this.parentElement.style.transform = "scale(1)";
    });
  });

  // ===== HIỆU ỨNG CHO CHECKBOX =====
  const checkbox = document.getElementById("terms");
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      this.parentElement.style.transform = "scale(1.02)";
      setTimeout(() => {
        this.parentElement.style.transform = "scale(1)";
      }, 200);
    }
  });
});

// ===== KEYFRAMES CHO HIỆU ỨNG SHAKE =====
const style = document.createElement("style");
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
  }
`;
document.head.appendChild(style);
