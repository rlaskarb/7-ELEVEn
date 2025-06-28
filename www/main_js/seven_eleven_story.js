document.addEventListener("DOMContentLoaded", function () {
  function changeStoryImages() {
    // 모든 스토리 슬롯 찾기
    const storySlots = document.querySelectorAll(".seven_story_shorts_slot");

    storySlots.forEach((slot) => {
      const links = slot.querySelectorAll(".seven_story_shorts_link");
      const activeLink = slot.querySelector(".seven_story_shorts_link.active");

      // 현재 활성화된 링크의 인덱스 찾기
      let currentIndex = Array.from(links).indexOf(activeLink);
      let nextIndex = (currentIndex + 1) % links.length; // 3개니까 0,1,2 순환

      // 현재 활성화된 것 비활성화
      activeLink.classList.remove("active");

      // 다음 것 활성화
      links[nextIndex].classList.add("active");
    });
  }

  // 유튜브 링크 클릭 이벤트
  document.querySelectorAll(".seven_story_shorts_link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const youtubeUrl = link.getAttribute("data-youtube");
      if (youtubeUrl && youtubeUrl !== "#") {
        window.open(youtubeUrl, "_blank");
      }
    });
  });

  // 3초마다 자동 변경
  setInterval(changeStoryImages, 3000);

  // 🧪 테스트용 콘솔 로그 (나중에 삭제)
  console.log("세븐일레븐 스토리 스크립트 로드 완료!");
  console.log(
    "찾은 슬롯 개수:",
    document.querySelectorAll(".seven_story_shorts_slot").length
  );
});
