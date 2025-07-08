document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".history_nav a");
  const scrollOffset = 100;

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const targetSelector = link.getAttribute("data-target");
      const targetElement = document.querySelector(targetSelector);

      if (targetElement) {
        const elementPosition =
          targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - scrollOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
});
