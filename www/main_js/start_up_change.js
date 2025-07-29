$(document).ready(function () {
	const startUpData = [
		{
			backgroudImg: "./main_images/start_up2.png",
			starth3: "세븐일레븐, <br> 왜 특별할까요?",
			startp1:
				"30년 이상 쌓아온 운영 노하우와<br> 탄탄한 유통망으로  업계를 선도하며,<br> 최상의 협력 시스템을 제공합니다.",
			startp2:
				"전 세계 19개국, 8만 매장이 증명하는 새로움과 <br /> 점주님들을 위한 차별화된 혜택이 기다립니다.",
			startMore: "./sub4/sub4_1.html",
		},
		{
			backgroudImg: "./main_images/start_up3.png",
			starth3: "창업 상담은 <br /> 언제나 환영!",
			startp1:
				"세븐일레븐 창업에 관심 있으신가요? <br /> 전문가와 1:1 상담을 통해 궁금증을 해결하고 <br /> 성공적인 창업을 준비하세요.",
			startp2: "여러분의 성공적인 첫걸음을 <br /> 세븐일레븐이 함께합니다.",
			startMore: "./sub4/sub4_2.html",
		},
		{
			backgroudImg: "./main_images/start_up4.png",
			starth3: "창업 설명회에서 <br /> 모든 것을!",
			startp1:
				"세븐일레븐 창업 설명회에 참여하여 <br /> 성공적인 창업 노하우와 최신 정보를 얻어가세요.",
			startp2: "성공적인 창업의 기회를 <br /> 놓치지 마세요!",
			startMore: "./sub4/sub4_3.html",
		},
		{
			backgroudImg: "./main_images/start_up5.png",
			starth3: "성공적인 <br /> 창업 스토리",
			startp1:
				"실제 세븐일레븐 점주들의 생생한 창업 성공 스토리를 들어보세요. <br /> 그들의 경험이 여러분의 성공에 영감을 줄 것입니다.",
			startp2: "성공은 준비된 자에게 찾아옵니다.",
			startMore: "./sub4/sub4_4.html",
		},
	];

	function updateContent(index) {
		const data = startUpData[index];
		const container = $(".start_up_guide_container");

		container.css("background", `url(${data.backgroudImg})`);
		container.find("h3").html(data.starth3);
		container.find("p:eq(0)").html(data.startp1);
		container.find("p:eq(1)").html(data.startp2);
		container
			.find(".more_btn.start_up_guide_more")
			.attr("href", data.startMore);
		$(".start_up_list > li").removeClass("active");
		$(".start_up_list > li").eq(index).addClass("active");
	}

	const original_content = $(".start_up_guide_container").html();
	const container = $(".start_up_guide_container");

	container.on("click", ".start_up_list > li a", function (event) {
		event.preventDefault();
		const index = $(this).closest("li").index();
		updateContent(index);
	});
	container.on("mouseleave", function () {
		$(this).html(original_content);
		$(this).css("background", "url(./main_images/start_up1.png)");
		$(this).find(".start_up_list > li").removeClass("active");
	});
});
