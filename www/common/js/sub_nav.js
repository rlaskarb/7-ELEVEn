$(document).ready(function () {
	const currentPath = window.location.pathname.split("/").pop();

	const currentQuery = window.location.search; // ? 뒤에 붙는 파라미터

	let currentPage = currentPath + currentQuery;

	if (currentPage === "") {
		currentPage = "index.html";
	}
	$(".sub_nav ul li a").removeClass("current");

	$(".sub_nav ul li a").each(function () {
		const linkHref = $(this).attr("href");

		if (linkHref.includes(currentPage)) {
			$(this).addClass("current");

			return false;
		}
	});
});
