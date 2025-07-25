//  자바스트립트 버전
// document.addEventListener("DOMContentLoaded", function () {
//   const navLinks = document.querySelectorAll(".history_nav a");
//   const scrollOffset = 100;

//   navLinks.forEach(function (link) {
//     link.addEventListener("click", function (event) {
//       event.preventDefault();

//       const targetSelector = link.getAttribute("data-target");
//       const targetElement = document.querySelector(targetSelector);

//       if (targetElement) {
//         const elementPosition =
//           targetElement.getBoundingClientRect().top + window.scrollY;
//         const offsetPosition = elementPosition - scrollOffset;
//         window.scrollTo({
//           top: offsetPosition,
//           behavior: "smooth",
//         });
//       }
//     });
//   });
// });

// 제이 쿼리 버전

$(document).ready(function () {
  const scrollOffset = 100;

  $(".history_nav a").on("click", function (event) {
    event.preventDefault();

    const targetSelector = $(this).data("target");
    const targetElement = $(targetSelector);
    if (targetElement.length) {
      const offsetPosition = targetElement.offset().top - scrollOffset;
      $("html ,body").animate({ scrollTop: offsetPosition }, 1000);
    }
  });
});
