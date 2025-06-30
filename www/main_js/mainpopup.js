/*

팝업관리

1. 페이지 로드시 팝업 표시 여부 확인
2. 체크박스 체크 후 닫기 클릭 시 하루 동안 숨김
3. 부드로운 닫기 효과 

*/

// 1단계 팝업 닫기 함수
function closesPopup() {
  console.log("닫기 버튼 클릭됨");

  //1-1 : 필요한 요소들 찾기
  const checkbox = document.getElementById("pup_up");
  const popupContainer = document.querySelector(".pop_up_container");

  //1-2 : 체크박스가 체크되어 있는지 확인
  if (checkbox.checked) {
    console.log("체크박스 체크됨 - 하루 동안 숨기기 설정");

    //내일 날짜 계산하기
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    //브라우저에 "언제까지 숨길지" 저장하기
    localStorage.setItem("hidePopupUntil", tomorrow.getTime());
    console.log("저장완료! 내일까지 숨김", tomorrow);
  }

  //1-3 팝업 숨기기 (부드러운 효과)
  popupContainer.style.opacity = "0";
  popupContainer.style.transform = "scale(0.8)";

  // 0.3 후 완전히 숨기기
  setTimeout(function () {});
}
