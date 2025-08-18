$(document).ready(function () {
	let tab2Swiper = null;

	// 탭 클릭 이벤트
	$(".good_nev a").click(function (e) {
		e.preventDefault();

		$(".good_nev a").removeClass("active");
		$(".tab_content").removeClass("active");

		$(this).addClass("active");

		// 해당 콘텐츠 보여주기
		const targetTab = $(this).attr("href");
		$(targetTab).addClass("active");

		//스와이퍼 기능
		if (targetTab === "#tab2") {
			tab2Swiper = new Swiper("#tab2 .my-tab2-swiper", {
				slidesPerView: 3,

				pagination: {
					el: "#tab2 .swiper-pagination",
					clickable: true,
				},

				navigation: {
					nextEl: "#tab2 .swiper-button-next",
					prevEl: "#tab2 .swiper-button-prev",
				},
			});
		}
	});

	// FAQ 아코디언 기능
	$(".faq_question").click(function () {
		const $answer = $(this).next(".faq_answer");
		let $question = $(this);

		// 현재 열려있는지 확인
		if ($answer.is(":visible")) {
			$answer.slideUp(400, function () {
				$(this).css("display", "none");
			});
			$question.removeClass("active");
		} else {
			// 다른 FAQ들 닫기
			$(".faq_answer").slideUp(400, function () {
				$(this).css("display", "none");
			});
			$(".faq_question").removeClass("active");

			// 현재 FAQ 열기
			$answer.css("display", "block").hide().slideDown(400);
			$question.addClass("active");

			// 멀티라인 FAQ의 경우 특별 효과 추가
			if ($answer.hasClass("faq_multiline")) {
				setTimeout(function () {
					$answer.addClass("active-multiline");
				}, 200);
			}
		}
	});
	$('.good_nev a[href="#tab1"]').click();
});
