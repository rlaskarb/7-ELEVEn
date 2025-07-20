// DOM이 모두 로드된 후에 스크립트가 실행되도록 합니다.
document.addEventListener("DOMContentLoaded", function () {
  // 필요한 요소들을 모두 선택합니다.
  const guide_container = document.getElementById("introduction_guide");
  const nav_items = document.querySelectorAll(".start_up_guide_menu li");
  const content_items = document.querySelectorAll(".guide_content");

  // 각 탭(nav_items)에 클릭 이벤트를 추가합니다.
  nav_items.forEach(function (nav_item) {
    nav_item.addEventListener("click", function (event) {
      event.preventDefault(); // a 태그의 기본 동작(페이지 이동)을 막습니다.

      // 클릭된 탭에서 data_guide 값을 가져옵니다. (예: "1", "2", "3")
      const target_guide = this.getAttribute("data_guide");

      // 1. 모든 요소에서 'active' 클래스 제거 (초기화)
      nav_items.forEach(function (item) {
        item.classList.remove("active");
      });
      content_items.forEach(function (item) {
        item.classList.remove("active");
      });

      // 2. 클릭된 탭에 'active' 클래스 추가
      this.classList.add("active");

      // 3. 연결된 내용에 'active' 클래스 추가
      const target_content = document.querySelector(
        `.guide_content[data_content="${target_guide}"]`
      );
      if (target_content) {
        target_content.classList.add("active");
      }

      // 4. 메인 컨테이너의 배경 이미지 클래스 변경
      guide_container.classList.remove("bg_1", "bg_2", "bg_3");
      guide_container.classList.add("bg_" + target_guide);
    });
  });
});
