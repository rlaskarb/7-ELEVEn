/*
  팝업관리
    1. 페이지 로드시 팝업 표시 여부 확인
    2. 체크박스 체크 후 닫기 클릭 시 하루 동안 숨김
    3. 부드로운 닫기 효과 
*/

// 1단계 팝업 닫기 함수
function closePopup() {
  console.log("닫기 버튼 클릭됨");

  //1-1 : 필요한 요소들 찾기
  const checkbox = document.getElementById("pop_up");
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
  setTimeout(function () {
    popupContainer.style.display = "none";
  }, 300);
}

// 2단계  페이지 로드시 팝업 표시 여부 확인
function checkShouldShowPopup() {
  console.log("팝업 표시 여부 확인중...");

  // 2-1 저장된 숨김 정보 가져오기
  const hideUntil = localStorage.getItem("hidePopupUntil");

  //2-2 저장된 정보가 없으면 팝업 보기
  if (!hideUntil) {
    console.log("저장된 숨김 정보 없음 - 팝업 표시");
    showPopup();
    return;
  }

  // 2-3 현재 시간과 비교하기
  const now = new Date().getTime(); // 현재시간
  const savedTime = parseInt(hideUntil); // 저장된 시간

  if (now < savedTime) {
    //아직 숨김 기간이 남아있음
    console.log("아직 숨김 기간임 - 팝업숨김");
    hidePopup();
  } else {
    // 숨김 기간이 지났음
    console.log("숨김 기간 지남 - 팝업 표시");
    localStorage.removeItem("hidePopupUntil"); // 저장된 정보 삭제
    showPopup();
  }
}

//3단계 : 팝업 보이기 함수
function showPopup() {
  const popupContainer = document.querySelector(".pop_up_container");

  //3-1 팝업 보이기
  popupContainer.style.display = "flex";
  popupContainer.style.opacity = "1";
  popupContainer.style.transform = "scale(1)";

  console.log("팝업 표시됨!");
}

// 4단계 팝업 숨기기 함수
function hidePopup() {
  const popupContainer = document.querySelector(".pop_up_container");
  // 4-1 팝업 숨김기
  popupContainer.style.display = "none";
  console.log("팝업 숨겨짐!");
}

// 5단계 : 부드러운 애니매이션을 위한 css 추가 준비
function addPopupAnimation() {
  const popupContainer = document.querySelector(".pop_up_container");

  //5-1 css 애니매에션 속성 추가
  popupContainer.style.transition = "all 0.3s ease";
}

/*
  프로그램 시작 지섬
  페이지가 완전히 로드된 후 실행되는 부분
*/

// HTML이 모두 준비가 되면 실행하기

document.addEventListener("DOMContentLoaded", function () {
  console.log("페이지 로드 완료! 팝업 시스템 시작");

  //1. 애니메이션 효과 준비
  addPopupAnimation();

  //2. 팝업 표시 여부 확인 및 실행
  checkShouldShowPopup();
});

/*
개발자 도구에서 테스트할 수 있는 함수들
  -브라우저 콘솔에서 이렇게 테스트 해봐요!
    -resetPopup() : 저장된 설정 최기화
    -forceShowPopup() : 강제로 팝업 보이기
    -forceHidePopup() : 강제로 팝업 숨기기
*/

// 테스트용 : 저장된 설정 초기화
function resetPopup() {
  localStorage.removeItem("hidePopupUntil");
  console.log("팝업 설정 최기화 완료!");
  location.reload(); // 페이지 새로고침
}

// 테스트용: 강제로 팝업 보이기
function forceShowPopup() {
  showPopup();
}

// 테스트용 : 강제로 팝업 숨기기
function forceHidePopup() {
  hidePopup();
}
