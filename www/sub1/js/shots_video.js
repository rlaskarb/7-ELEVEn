$(document).ready(function () {
	// '자세히 보기' 버튼을 클릭했을 때
	$("#content .seven_story_shots a.view-video-btn").on("click", function (e) {
		e.preventDefault(); // 링크 기본 동작 방지
		e.stopPropagation(); // 다른 클릭 이벤트와 충돌 방지

		const $button = $(this);
		const $li = $button.closest("li"); // 버튼이 속한 li를 찾음
		const videoId = $button.data("video-id");

		// 버튼에 'video-active' 클래스가 있는지 확인하여 토글 기능 구현
		if ($button.hasClass("video-active")) {
			// 영상이 이미 활성화된 상태일 경우 (닫기 버튼 클릭 시)
			$li.find("iframe").remove(); // iframe 영상 제거
			$li.find("img").show(); // 숨겼던 이미지 다시 보여주기
			$button.text("자세히 보기").removeClass("video-active"); // 버튼 텍스트 되돌리기
		} else {
			const origin = window.location.origin;
			// 영상이 없는 상태일 경우 (자세히 보기 버튼 클릭 시)
			const iframeSrc = `https://www.youtube.com/embed/${videoId}?playsinline=1&origin=${origin}`;
			const $iframe = $("<iframe>", {
				src: iframeSrc,
				frameborder: 0,
				allow: "autoplay; encrypted-media",
				allowfullscreen: true,
			}).css({
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				borderRadius: "15px", // 이미지와 동일한 둥근 모서리
			});

			$li.css("position", "relative"); // iframe을 li 기준으로 위치시키기 위해 필요
			$li.find("img").hide(); // 이미지를 숨김 (li 크기는 유지됨)
			$li.append($iframe); // li에 영상 추가
			$button.text("닫기").addClass("video-active"); // 버튼 텍스트를 '닫기'로 변경
		}
	});
});
