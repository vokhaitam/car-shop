function Login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Kiểm tra tài khoản cố định
  if (email === "tamvo0164@gmail.com" && password === "12112006") {
    window.location.href = "home.html"; // chuyển sang trang home
  } else {
    alert("Sai email hoặc mật khẩu!");
  }
}
