// $(document).ready(function () {
// 	const $header = $("#headerArea");
// 	const $proceduresNav = $(".procedures_nav");
// 	const $navLinks = $proceduresNav.find("a");
// 	const $descriptionItem = $(".description_item");
// 	const stickyNavTop = $proceduresNav.offset().top;
// 	const navHeight = $proceduresNav.outerHeight();

// 	$(window).on("scroll", function () {
// 		const scrollTop = $(this).scrollTop();
// 		if (scrollTop >= stickyNavTop) {
// 			$header.hide();
// 			$proceduresNav.addClass("fixed");
// 		} else {
// 			$header.show();
// 			$proceduresNav.removeClass("fixed");
// 		}

// 		$descriptionItem.each(function (index) {
// 			const itemTop = $(this).offset().top;

// 			if (scrollTop >= itemTop - navHeight - 100) {
// 				$navLinks.parent().removeClass("on");
// 				$navLinks.eq(index).parent().addClass("on");
// 			}
// 		});
// 	});

// 	$navLinks.on("click", function (event) {
// 		event.preventDefault();

// 		const targetSelector = $(this).data(target);
// 		const $targetElement = $(targetSelector);

// 		if ($targetElement.length) {
// 			const offsetPosition = $targetElement.offset().top - navHeight - 100;
// 			$("html,body").animate({ scrollTop: offsetPosition }, 1000);
// 		}
// 	});
// });
