$(document).ready(function () {
	const bannerContainer = $(".seven_story_shorts");
	const banner = bannerContainer.find("ul");
	const originalImgs = banner.find("li");
	const itemCount = originalImgs.length;

	if (itemCount === 0) {
		return;
	}

	// 각 이미지 너비 가져옴 첫번째 기준으로 계산
	const imgWidth = originalImgs.first().outerWidth(true);

	// 전체 원본 이미지 너비 계산 (이미지 너비 * 개수)
	const originalTotalWidth = imgWidth * itemCount;

	// 이미지 복제
	banner.append(originalImgs.clone());

	// 복제된 이미지를 포함한 전체 배너의 너비 설정
	const totalWidth = originalTotalWidth * 2;
	banner.width(totalWidth);

	//상태변수 설정
	let currentLeft = 0;
	let timer;

	function startAnimation() {
		clearInterval(timer);
		// setInterval 실행후 그 ID를 timer 변수에 할당함.
		timer = setInterval(function () {
			currentLeft--;

			if (currentLeft <= -originalTotalWidth) {
				currentLeft = 0;
			}
			banner.css("left", currentLeft + "px");
		}, 10);
	}

	bannerContainer.hover(
		function () {
			clearInterval(timer);
		},
		function () {
			startAnimation();
		}
	);
	startAnimation();
});
