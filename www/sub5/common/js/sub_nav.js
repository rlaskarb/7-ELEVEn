document.addEventListener("DOMContentLoaded", function () {
  const subNavLinks = document.querySelectorAll(".sub_nav ul li a");
  const currentPath = window.location.pathname.split("/").pop();

  subNavLinks.forEach((link) => {
    const linkPath = link.getAttribute("href").split("/").pop();
    if (linkPath === currentPath) {
      link.parentElement.classList.add("current");
    }
  });
});
