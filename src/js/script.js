const toggle = document.getElementById("themeToggle");
const root = document.documentElement;

toggle.addEventListener("click", () => {
  const currentTheme = root.getAttribute("data-theme");
  root.setAttribute(
    "data-theme",
    currentTheme === "dark" ? "light" : "dark"
  );
});
