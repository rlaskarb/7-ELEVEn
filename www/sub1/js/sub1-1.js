// 7-Eleven 브랜드 스토리 애니메이션

document.addEventListener("DOMContentLoaded", function () {
  // 애니메이션 시작 함수
  function startBrandStory() {
    // 1단계: 미국 국기 이미지 줌인 (1초 후)
    setTimeout(() => {
      const img = document.querySelector(".start_up_story_img");
      img.classList.add("show", "zoom-in");
    }, 1000);

    // 2단계: 첫 번째 텍스트 줌인 (2.5초 후)
    setTimeout(() => {
      const text1 = document.querySelector(".start_up_story_text1");
      text1.classList.add("show", "zoom-in");
    }, 2500);

    // 3단계: 두 번째 텍스트 줌인 (4초 후)
    setTimeout(() => {
      const text2 = document.querySelector(".start_up_story_text2");
      text2.classList.add("show", "zoom-in");
    }, 4000);

    // 4단계: 버튼 등장 (5초 후)
    setTimeout(() => {
      const btn = document.querySelector(".start_up_story_btn");
      btn.classList.add("show", "zoom-in");
    }, 5000);

    // 5단계: 모든 요소 사라짐 (8초 후 - 3초 유지 후)
    setTimeout(() => {
      hideStoryElements();
    }, 8000);

    // 6단계: 지도 핀들 순차 등장 (11초 후 시작)
    setTimeout(() => {
      showCountryPins();
    }, 9000);
  }

  function hideStoryElements() {
    // 스토리 관련 요소들 직접 선택해서 숨기기
    const img = document.querySelector(".start_up_story_img");
    const text1 = document.querySelector(".start_up_story_text1");
    const text2 = document.querySelector(".start_up_story_text2");
    const btn = document.querySelector(".start_up_story_btn");

    [img, text1, text2, btn].forEach((element) => {
      if (element) {
        element.style.opacity = "0";
        element.style.transform = "scale(0.3)";
        // 완전히 안보이게 하려면 이것도 추가
        element.style.visibility = "hidden";
      }
    });
  }

  // 국가 핀들 순차적으로 보여주기
  function showCountryPins() {
    const pins = document.querySelectorAll(".pin-ready");

    pins.forEach((pin, index) => {
      const order = parseInt(pin.dataset.order);

      setTimeout(() => {
        pin.classList.add("show");

        // 핀 등장 시 튕기는 효과
        pin.style.animation = "pinBounce 0.8s ease";

        // 툴팁 효과 (국가명 표시)
        // showCountryTooltip(pin);
      }, (order - 1) * 300); // 0.5초 간격
    });

    // 모든 핀이 나타난 후 최종 메시지들 표시 (19개 * 0.2초 + 1초 여유)
    setTimeout(() => {
      showFinalMessages();
    }, 19 * 300 + 1000);
  }

  // 최종 메시지들 표시
  function showFinalMessages() {
    // 전체 메시지 먼저 등장
    setTimeout(() => {
      const finalMessage = document.querySelector(".final_message");
      finalMessage.classList.add("show");
    }, 500);

    // 한국 특별 메시지 등장 (1.5초 후)
    setTimeout(() => {
      const koreaMessage = document.querySelector(".korea_special_message");
      koreaMessage.classList.add("show");

      // 한국 핀 강조 효과
      const koreaPin = document.querySelector(".korea");
      koreaPin.style.color = "#e77e2d";
      koreaPin.style.transform = "scale(1.5)";
      koreaPin.style.filter = "drop-shadow(0 0 10px #e77e2d)";
    }, 1500);
  }

  // 국가 툴팁 표시 함수
  function showCountryTooltip(pin) {
    const country = pin.dataset.country;

    // 기존 툴팁 제거
    const existingTooltip = document.querySelector(".country-tooltip");
    if (existingTooltip) {
      existingTooltip.remove();
    }

    // 새 툴팁 생성
    const tooltip = document.createElement("div");
    tooltip.className = "country-tooltip";
    tooltip.textContent = country;
    tooltip.style.cssText = `
            position: absolute;
            background: rgba(217, 38, 41, 0.9);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 15px;
            font-weight: 600;
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.5s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;

    // 툴팁 위치 계산
    const rect = pin.getBoundingClientRect();
    const container = document.querySelector(".seven_eleven_in_the_world");
    const containerRect = container.getBoundingClientRect();

    tooltip.style.left = rect.left - containerRect.left + rect.width / 2 + "px";
    tooltip.style.top = rect.top - containerRect.top - 30 + "px";
    tooltip.style.transform = "translateX(-50%)";

    container.appendChild(tooltip);

    // 툴팁 페이드인
    setTimeout(() => {
      tooltip.style.opacity = "1";
    }, 50);

    // 2초 후 툴팁 제거
    setTimeout(() => {
      if (tooltip.parentNode) {
        tooltip.style.opacity = "0";
        setTimeout(() => {
          if (tooltip.parentNode) {
            tooltip.remove();
          }
        }, 300);
      }
    }, 2000);
  }

  // 핀 튕기는 애니메이션 키프레임 추가
  const style = document.createElement("style");
  style.textContent = `
        @keyframes pinBounce {
            0% { transform: scale(0) translateY(0); }
            50% { transform: scale(1.3) translateY(-10px); }
            70% { transform: scale(0.9) translateY(-5px); }
            100% { transform: scale(1) translateY(0); }
        }
        
        .country-tooltip {
            animation: tooltipFloat 2s ease-in-out infinite;
        }
        
        @keyframes tooltipFloat {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(-3px); }
        }
    `;
  document.head.appendChild(style);

  // 핀 호버 효과 개선
  document.querySelectorAll(".country_pin").forEach((pin) => {
    pin.addEventListener("mouseenter", function () {
      if (this.classList.contains("show")) {
        showCountryTooltip(this);
        this.style.transform += " scale(1.2)";
        this.style.filter = "drop-shadow(0 0 8px currentColor)";
      }
    });

    pin.addEventListener("mouseleave", function () {
      this.style.transform = this.style.transform.replace(" scale(1.2)", "");
      this.style.filter = "";

      // 툴팁 제거
      const tooltip = document.querySelector(".country-tooltip");
      if (tooltip) {
        tooltip.style.opacity = "0";
        setTimeout(() => {
          if (tooltip.parentNode) {
            tooltip.remove();
          }
        }, 300);
      }
    });
  });

  // 재시작 버튼 기능 (다음으로 이동 버튼)
  document
    .querySelector(".start_up_story_btn")
    .addEventListener("click", function () {
      // 모든 애니메이션 초기화
      resetAnimation();

      // 1초 후 재시작
      setTimeout(() => {
        startBrandStory();
      }, 1000);
    });

  // 애니메이션 초기화 함수
  function resetAnimation() {
    // 모든 show 클래스 제거
    document.querySelectorAll(".show").forEach((element) => {
      element.classList.remove("show");
    });

    // 모든 스타일 초기화
    document
      .querySelectorAll(".fade-ready, .pin-ready, .message-ready")
      .forEach((element) => {
        element.style.opacity = "";
        element.style.transform = "";
        element.style.animation = "";
        element.style.color = "";
        element.style.filter = "";
      });

    // 툴팁 제거
    const tooltips = document.querySelectorAll(".country-tooltip");
    tooltips.forEach((tooltip) => tooltip.remove());
  }

  // 페이지 로드 시 애니메이션 시작
  startBrandStory();

  // 스크롤 감지하여 화면에 들어올 때 애니메이션 재시작 (선택사항)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          // 이미 애니메이션이 실행 중이 아닐 때만 시작
          const hasShow = document.querySelector(
            ".seven_eleven_in_the_world .show"
          );
          if (!hasShow) {
            resetAnimation();
            setTimeout(() => startBrandStory(), 500);
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  // 관찰 대상 등록
  const targetSection = document.querySelector(".seven_eleven_in_the_world");
  if (targetSection) {
    observer.observe(targetSection);
  }
});
