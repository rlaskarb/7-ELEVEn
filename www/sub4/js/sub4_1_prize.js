$(document).ready(function () {
	const banner = $(".prize_img");

	const originalImgs = $(".prize_img img");

	const imgCount = originalImgs.length;

	// 각 이미지 너비 가져옴 첫번째 기준으로 계산
	const imgWidth = originalImgs.first().outerWidth(true);

	// 전체 원본 이미지 너비 계산 (이미지 너비 * 개수)
	const originalTotalWidth = imgWidth * imgCount;

	// 이미지 복제
	banner.append(originalImgs.clone());

	// 복제된 이미지를 포함한 전체 배너의 너비 설정
	const newTotalWidth = originalTotalWidth / 4;
	banner.width(newTotalWidth);

	function moveBanner() {
		banner.animate({ left: -originalTotalWidth }, 30000, "linear", function () {
			banner.css("left", 0);
			moveBanner();
		});
	}
	moveBanner();
});
