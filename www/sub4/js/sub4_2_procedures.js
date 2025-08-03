$(document).ready(function () {
	const $header = $("#headerArea");
	const $proceduresNav = $(".procedures_nav");
	const $navLinks = $proceduresNav.find("li a");
	const $descriptionItem = $(".description_item");
	const $timelineWrapper = $(".timeline_wrapper");
	const navHeight = $proceduresNav.outerHeight();
	let navTop = $proceduresNav.offset().top;

	$(window).on("scroll", function () {
		const scrollTop = $(this).scrollTop();

		if (scrollTop >= navTop - 150) {
			$header.hide();
			$proceduresNav.addClass("fixed");
		} else {
			$header.show();
			$proceduresNav.removeClass("fixed");
		}

		$descriptionItem.each(function (index) {
			const itemTop = $(this).offset().top;

			if (scrollTop >= itemTop - navHeight - 200) {
				$navLinks.parent().removeClass("on");
				$navLinks.eq(index).parent().addClass("on");
			}
		});
	});

	$navLinks.on("click", function (event) {
		event.preventDefault();

		const targetId = $(this).attr("href");
		const $targetElement = $(targetId);

		if ($targetElement.length) {
			const offsetPosition = $targetElement.offset().top - navHeight - 20;
			$("html,body").animate({ scrollTop: offsetPosition }, 500);
		}
	});
});
