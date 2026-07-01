require("dotenv").config();

console.log(
  "GOOGLE_CLIENT_ID:",
  process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + "...",
);
console.log(
  "GOOGLE_CLIENT_SECRET:",
  process.env.GOOGLE_CLIENT_SECRET?.substring(0, 10) + "...",
);

const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const authRoutes = require("./routes/auth");
const path = require("path");
const cors = require("cors");

const app = express();

// Cấu hình session (cần cho passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // secure: true nếu dùng HTTPS
  }),
);

// Khởi tạo passport
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Routes auth (Google + Facebook)
app.use("/api/auth", authRoutes);

// Route đăng nhập Google
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/Login page/Login.html",
  }),
  (req, res) => {
    res.redirect("/Home page/Home.html");
  },
);

// Route logout
app.get("/api/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/Login page/Login.html");
  });
});

// Route Facebook
app.get("/api/auth/facebook", passport.authenticate("facebook", { scope: [] }));
app.get(
  "/api/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/Login page/Login.html",
  }),
  (req, res) => {
    res.redirect("/Home page/Home.html");
  },
);

// Trang chủ
app.get("/", (req, res) => {
  res.redirect("/Login page/Login.html");
});

// ⚠️ Nếu bạn muốn dùng Clerk cho route /protected, bỏ comment phần dưới
const { ClerkExpressRequireAuth } = require("@clerk/express");
app.get("/protected", ClerkExpressRequireAuth(), (req, res) => {
  res.send(`Hello user ${req.auth.userId}`);
});

// Khởi động server (chỉ một lần duy nhất)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server chạy ở http://localhost:${PORT}`));
