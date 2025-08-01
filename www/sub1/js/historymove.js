$(document).ready(function () {
	const $header = $("#headerArea");
	const $historyNav = $(".history_nav");
	const $navLinks = $historyNav.find("a"); /* 연혁네비 안에 a 찾아! */
	const $historySections = $(".company_history > ul >li"); /*연혁 안에 li */
	const stickyNavTop = $historyNav.offset().top;
	const navHeight =
		$historyNav.outerHeight(); /*outerHeight() -> css 포함시킨 실제높이를 가져온다*/

	$(window).on("scroll", function () {
		const scrollTop = $(this).scrollTop();

		if (scrollTop >= stickyNavTop - 200) {
			$header.hide();
			$historyNav.addClass("fixed");
		} else {
			$header.show();
			$historyNav.removeClass("fixed");
		}

		$historySections.each(function (index) {
			const sectionTop = $(this).offset().top;

			if (scrollTop >= sectionTop - navHeight - 160) {
				$navLinks.parent().removeClass("on");
				$navLinks.eq(index).parent().addClass("on");
			}
		});
	});

	$navLinks.on("click", function (event) {
		event.preventDefault();

		const targetSelector = $(this).data("target");

		const $targetElement = $(targetSelector);

		if ($targetElement.length) {
			const offsetPosition = $targetElement.offset().top - navHeight - 100;
			$("html , body").animate({ scrollTop: offsetPosition }, 1000);
		}
	});
});
