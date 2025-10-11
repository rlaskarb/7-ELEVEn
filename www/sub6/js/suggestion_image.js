$(document).ready(function () {
	// --- 1. 높이 조절 기능 ---
	const imageContainer = $(".suggestion_image");
	const formContainer = $(".suggestion_form");

	function setContainerHeight() {
		const formHeight = formContainer.outerHeight();
		imageContainer.height(formHeight);
	}

	// 페이지 로드 및 창 크기 변경 시 높이 설정
	setContainerHeight();
	$(window).on("resize", setContainerHeight);

	// --- 2. 애니메이션 기능 ---
	const container = $(".scroll_container");
	const items = container.children(".scroll_item");

	// 무한 루프를 위해 아이템 복제
	container.append(items.clone());

	let totalHeight = 0;
	container.children(".scroll_item").each(function () {
		totalHeight += $(this).outerHeight(true);
	});

	const originalHeight = totalHeight / 2;

	function scrollAnimation() {
		container.animate(
			{ top: -originalHeight },
			35000, // 속도
			"linear",
			function () {
				container.css("top", 0);
				scrollAnimation();
			}
		);
	}

	// 호버 기능 (멈춤/재개)
	$(".suggestion_image").hover(
		function () {
			container.stop();
		},
		function () {
			scrollAnimation();
		}
	);

	// 최초 애니메이션 시작
	scrollAnimation();
});
