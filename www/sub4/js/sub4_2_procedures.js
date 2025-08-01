$(document).ready(function () {
	const $header = $("#headerArea");
	const $proceduresNav = $(".procedures_nav");
	const $navLinks = $proceduresNav.find("a");
	const $descroptionItem = $(".description_item");
	const stickyNavTop = $proceduresNav.offset().top;
	const navHeight = $proceduresNav.outerHeight();

	$(window).on("scroll", function () {
		const scrollTop = $(this).scrollTop();
		if (scrollTop >= stickyNavTop) {
			$header.hide();
			$proceduresNav.addClass("fixed");
        } else {
            $header.show();
            $proceduresNav.removeClass("fixed");    
        }

        $descroptionItem.each(function (index) {
            const itemTop = $(this).offset().top;

            if (scrollTop >= itemTop - navHeight - 100) {
                $navLinks.parent().removeClass('on')
                
            }
            
        })
	});
});
