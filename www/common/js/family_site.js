// $(document).ready(function () {
//   $(function () {
//     $("#footer_family").on("change", function () {
//       var selectedUrl = $(this).val();
//       if (selectedUrl) {
//         window.open(selectedUrl, "_blank");s
//       }
//     });
//   });
// });

// 자바스크립트 버전
document.addEventListener("DOMContentLoaded", function () {
  const familySelect = document.querySelector("#footer_family");
  if (familySelect) {
    familySelect.addEventListener("change", function () {
      const selectedUrl = this.value;

      if (selectedUrl) {
        window.open(selectedUrl, "_blank");
      }
    });
  }
});
