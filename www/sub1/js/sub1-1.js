document.addEventListener("DOMContentLoaded", function () {
  const storyImg = document.querySelector(".start_up_story_img");
  const storyText1 = document.querySelector(".start_up_story_text1");
  const storyText2 = document.querySelector(".start_up_story_text2");
  const storyElements = [storyImg, storyText1, storyText2];

  const pins = document.querySelectorAll(".country_pin");
  const finalMessage = document.querySelector(".final_message");
  const koreaMessage = document.querySelector(".korea_special_message");
  const koreaPin = document.querySelector(".korea");
  const replayButton = document.getElementById("replay_animation_btn");

  function startAnimation() {
    // 미국 국기 이미지 줌인
    setTimeout(() => {
      storyImg.classList.add("show");
    }, 500);

    // 첫 번째 텍스트 줌인
    setTimeout(() => {
      storyText1.classList.add("show");
    }, 1500);

    // 두 번째 텍스트 줌인
    setTimeout(() => {
      storyText2.classList.add("show");
    }, 2500);

    // 첫번째 소개글 클로즈
    setTimeout(() => {
      storyElements.forEach((el) => el.classList.remove("show"));
    }, 4500);

    // 새 애니매이션 시작
    setTimeout(() => {
      pins.forEach((pin, index) => {
        setTimeout(() => {
          pin.classList.add("show");
        }, index * 200);
      });
    }, 5000);

    setTimeout(() => {
      finalMessage.classList.add("show");
    }, 9500);

    setTimeout(() => {
      koreaMessage.classList.add("show");
      koreaPin.classList.add("highlight");
    }, 10500);
  }

  // 애니매이션 리셋
  function resetAnimation() {
    // 첫번째 애니매이션 숨기기
    storyElements.forEach((el) => el.classList.remove("show"));

    // 두번째 애니메이션 효과 제거
    pins.forEach((pin) => pin.classList.remove("show", "highlight"));
    finalMessage.classList.remove("show");
    koreaMessage.classList.remove("show");
  }

  // 다시보기 버튼 활성화

  replayButton.addEventListener("click", function () {
    resetAnimation();
    setTimeout(startAnimation, 500);
  });

  // --- 5. 페이지 로드 시 첫 애니메이션 실행 ---
  startAnimation();
});
