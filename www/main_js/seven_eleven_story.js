$(document).ready(function () {
	const sevenStoryShorts = $(".seven_story_shorts"); // 슬라이더 전체 역역
	const slider = $(".seven_story_shorts ul"); // 실제로 움직일 ul
	const originalSlides = slider.find("li"); // 원본 li
	const itemsPerView = 3; // 보여줄 갯수
	const slideWidth = originalSlides.outerWidth(true);

	originalSlides
		.slice(0, itemsPerView)
		.clone()
		.addClass("cloned")
		.appendTo(slider);

	const allSlides = slider.find("li");
	const totalSlides = allSlides.length;

	slider.width(totalSlides * slideWidth);

	let currentIndex = 0;
	let isAnimating = false;
	let interval;

	function moveSlider(index) {
		if (isAnimating) return;
		isAnimating = true;

		slider.stop().animate({ left: -index * slideWidth }, 500, function () {
			if (index >= originalSlides.length) {
				slider.css("left", 0);
				currentIndex = 0;
			}
			isAnimating = false;
		});
	}

	// 다음/이전 버튼 클릭
	$(".shorts_arrow.next").on("click", function (e) {
		e.preventDefault();
		currentIndex++;
		moveSlider(currentIndex);
	});

	$(".shorts_arrow.prev").on("click", function (e) {
		e.preventDefault();
		if (currentIndex === 0) {
			currentIndex = originalSlides.length;
			slider.css("left", -currentIndex * slideWidth);
		}
		currentIndex--;
		moveSlider(currentIndex);
	});

	// 자동 재생가능
	function startAutoplay() {
		stopAutoplay();
		interval = setInterval(function () {
			$(".shorts_arrow.next").click();
		}, 3000);
	}

	function stopAutoplay() {
		clearInterval(interval); // 자동재생을 멈춤
	}

	// 마우스 드래그
	let isDragging = false;
	let startPos = 0;

	slider.on("mousedown", function (e) {
		e.preventDefault();
		isDragging = true;
		startPos = e.pageX;
		slider.css("cursor", "grabbing");
		// stopAutoplay();
	});

	// $(document).on("mouseup", function () {
	// 	if (isDragging) {
	// 		isDragging = false;
	// 		slider.css("cursor", "grab");
	// 		startAutoplay(); // 다시재생
	// 	}
	// });

	slider.on("mousemove", function (e) {
		if (!isDragging) return;
		const diff = startPos - e.pageX; // 처음 누를 곳과 현재위치의 차이 계산

		if (Math.abs(diff) > 50) {
			if (diff > 0) {
				$(".shorts_arrow.next").click();
			} else {
				$(".shorts_arrow.prev").click();
			}
			isDragging = false;
		}
	});

	// sevenStoryShorts.on("mouseenter", stopAutoplay());
	// sevenStoryShorts.on("mouseleave", startAutoplay());
	startAutoplay();
});
