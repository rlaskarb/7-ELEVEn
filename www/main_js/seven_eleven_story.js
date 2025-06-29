/*
 document = 웹페이지 전체를 대표하는 객체
    쉬운비유
        *웹페이지= 한권의 책
        *document = 그책을 조작할수 있는 리모
*/

/*
    addEventListener = 이벤트 감시자 추가하기
        쉬운비유
            *도어벨 = 이벤트(누군가 문을 누름)
            *addEventListener = 도어벨에 반응하는 장치 설치
            *function() = 도어벨이 울리면 실행할 행동
*/

/*
    DOMContentLoaded = HTML 다 읽혔어요! 신호
        쉬운비유
            *요리사(브라우저)가 재료(HTML) 준비하는 중
            *DOMContentLoaded = 재료준비완료! 신호
            *그때 요리(JavaScript) 시작!
*/

/*
    function = 할 일을 묶어 놓은 상자
        쉬운비유
            *function =레시피
            *function() = 그 레시피 실행하기
            {} = 레시피 내용이 적힌 부분
*/

// DOM !! 모든 HTML 이 준비가 되면 알려줘!!
// 번역 -> 브라우저야, HTML 다읽고 나서 이 함수 실행 시켜줘~
document.addEventListener("DOMContentLoaded", function () {
  // 여기 안의 코드들이 실행됨~!

  // 함수이름 changeStoryImages(변수명) -> 역활: 스토리 이미지들을 바꾸는 일
  // 번역 -> 이미지를 바꾸는 방법을 changStoryImage 라고 이름을 지어두자
  function changeStoryImages() {
    // HTML 에서 클래스이름이 ()안에 있는 모든요소를 찾아줘~
    const storySlots = document.querySelectorAll(".seven_story_shorts_slot");
    // 찾은 slot(변수) 을 하나씩 처리해!!
    storySlots.forEach((slot) => {
      // 현재 슬롯 안에 모든 링크들 찾기!
      const links = slot.querySelectorAll(".seven_story_shorts_link");
      // 현재보이는 링크 찾기 (active 클래스가 있는 것)
      const activeLink = slot.querySelector(".seven_story_shorts_link.active");

      // 현재 보이는 링크가 몇 번째 인지 알아내기
      let currentIndex = Array.from(links).indexOf(activeLink);
      // 다음에 보여줄 링크번호 계산 (0->1->2->0 순환)
      let nextIndex = (currentIndex + 1) % links.length;

      // 현재 보이는 것 숨기기
      activeLink.classList.remove("active");

      // 다음에 보이는 것 보이기
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
