document.addEventListener("DOMContentLoaded", () => {
  const dashboardHub = document.querySelector(".view-hub");
  const detailPanes = document.querySelectorAll(".detail-pane");
  const navLinks = document.querySelectorAll(".side-nav__link");
  const bentoCards = document.querySelectorAll(".bento-card");
  const backButtons = document.querySelectorAll(".js-back");
  const homeBtn = document.querySelector("#nav-home");

  // Navigation: Switch View
  function showView(viewId) {
    const target = document.getElementById(`pane-${viewId}`);
    if (!target) return;

    // Transition Logic
    dashboardHub.classList.remove("js-view-active");
    detailPanes.forEach((p) => p.classList.remove("is-active"));

    target.classList.add("is-active");
    updateNavActiveState(viewId);
    window.scrollTo(0, 0);
  }

  // Navigation: Reset to Dashboard
  function resetToHome() {
    detailPanes.forEach((p) => p.classList.remove("is-active"));
    dashboardHub.classList.add("js-view-active");
    updateNavActiveState("home");
  }

  function updateNavActiveState(id) {
    navLinks.forEach((link) => {
      const isActive =
        link.dataset.view === id || (id === "home" && link.id === "nav-home");
      link.classList.toggle("side-nav__link--active", isActive);
    });
  }

  // Click Handlers: Grid Cards
  bentoCards.forEach((card) => {
    card.addEventListener("click", () => showView(card.dataset.view));
  });

  // Click Handlers: Sidebar Links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      if (link.id === "nav-home") resetToHome();
      else showView(link.dataset.view);
    });
  });

  // Click Handlers: Back Buttons
  backButtons.forEach((btn) => btn.addEventListener("click", resetToHome));

  // Click Handler: Brand Logo
  document
    .querySelector(".top-bar__brand")
    .addEventListener("click", resetToHome);

  // Live Clock
  function updateTime() {
    const now = new Date();
    document.querySelector(".js-time").textContent = now.toLocaleTimeString(
      "en-US",
      { hour: "2-digit", minute: "2-digit", hour12: true },
    );
    document.querySelector(".js-date").textContent = now.toLocaleDateString(
      "en-GB",
      { day: "numeric", month: "short", year: "numeric" },
    );
  }
  setInterval(updateTime, 1000);
  updateTime();
});
