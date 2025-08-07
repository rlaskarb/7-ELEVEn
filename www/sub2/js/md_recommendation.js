$(document).ready(function () {
	const sliderContainer = $(".new_banner_container"); // 슬라이더 전체 영역
	const slider = $(".new_banner_content"); // 실제로 움직일 ul
	const originalSlides = slider.find("li"); // 원본 <li> 6개
	const itemsPerView = 3; // 한 번에 보여줄 개수

	// 맨 앞 3개 슬라이드를 복제해서 맨 뒤에 붙여넣습니다.
	originalSlides
		.slice(0, itemsPerView)
		.clone()
		.addClass("cloned")
		.appendTo(slider);

	// 복제된 것을 포함한 모든 li와 그 너비를 다시 계산합니다.
	const allSlides = slider.find("li");
	const totalSlides = allSlides.length;
	const slideWidth = originalSlides.outerWidth(true);

	//<ul>의 전체 너비를 'li너비'로 설정해줍니다.
	slider.width(totalSlides * slideWidth);

	// 슬라이더의 상태를 기억할 변수들을 만듭니다.
	let currentIndex = 0; // 현재 페이지 번호
	let isAnimating = false;
	// 애니메이션이 겹치지 않도록 하는 '신호등' 역할

	let interval; // 자동재생을 담을 그릇

	// 이 함수는 슬라이더의 '엔진'
	function moveSlider(index) {
		if (isAnimating) return; //버튼 연타 방지
		isAnimating = true; //신호등을 빨간불로

		slider.stop().animate({ left: -index * slideWidth }, 500, function () {
			// ✨무한 루프의 비밀✨
			if (index >= originalSlides.length) {
				// 만약 마지막 페이지(복제된 페이지)에 도착했다면,

				slider.css("left", 0); // 순간이동
				currentIndex = 0; // 리셋
			}
			isAnimating = false; //신호등을 초록불로
		});
	}

	// 이제 사용자가 슬라이더를 제어할 수 있도록 이벤트를 연결합니다.

	//다음/이전 버튼 클릭
	$(".banner_arrow.next").on("click", function (e) {
		e.preventDefault();
		currentIndex++;
		moveSlider(currentIndex); // 엔진(moveSlider)을 돌립니다.
	});

	$(".banner_arrow.prev").on("click", function (e) {
		e.preventDefault();
		if (currentIndex === 0) {
			// 만약 첫 페이지에서 '이전'을 누르면
			// 맨 뒤(복제된 슬라이드 바로 앞)로 순간이동 시킨 후,
			currentIndex = originalSlides.length;
			slider.css("left", -currentIndex * slideWidth);
		}
		currentIndex--;
		moveSlider(currentIndex); // 엔진을 돌립니다.
	});

	// 자동재생 기능
	function startAutoplay() {
		stopAutoplay(); // 혹시라도 켜져 있으면 일단 끄고,
		interval = setInterval(function () {
			$(".banner_arrow.next").click();
		}, 3000);
	}

	function stopAutoplay() {
		clearInterval(interval); // 자동재생을 멈춥니다.
	}

	// 마우스 드래그 기능
	let isDragging = false;
	let startPos = 0;

	slider.on("mousedown", function (e) {
		// 마우스를 눌렀을 때
		e.preventDefault();
		isDragging = true;
		startPos = e.pageX; // 누른 지점의 가로 좌표를 기억
		slider.css("cursor", "grabbing"); // 커서 모양 변경
		stopAutoplay(); // 자동재생 멈춤
	});

	$(document).on("mouseup", function () {
		// 마우스를 뗐을 때 (문서 전체에서)
		if (isDragging) {
			isDragging = false;
			slider.css("cursor", "grab");
			startAutoplay(); // 자동재생 다시 시작
		}
	});

	slider.on("mousemove", function (e) {
		// 마우스를 움직일 때
		if (!isDragging) return;
		const diff = startPos - e.pageX; // 처음 누른 곳과 현재 위치의 차이 계산

		if (Math.abs(diff) > 50) {
			// 50px 이상 움직였을 때만
			if (diff > 0) {
				// 오른쪽으로 끌었으면
				$(".banner_arrow.next").click();
			} else {
				// 왼쪽으로 끌었으면
				$(".banner_arrow.prev").click();
			}
			isDragging = false; // 한 번만 실행되도록!
		}
	});

	// 슬라이더에 마우스를 올리면 자동재생 멈춤
	sliderContainer.on("mouseenter", stopAutoplay);
	// 마우스가 벗어나면 자동재생 다시 시작
	sliderContainer.on("mouseleave", startAutoplay);
	// 페이지가 열리면 자동재생 바로 시작
	startAutoplay();
});
