$(document).ready(function () {
	const startUpData = [
		{
			backgroudImg: "./main_images/start_up2.avif",
			starth3: "세븐일레븐, <br> 왜 특별할까요?",
			startp1:
				"30년 이상 쌓아온 운영 노하우와<br> 탄탄한 유통망으로  업계를 선도하며,<br> 최상의 협력 시스템을 제공합니다.",
			startp2:
				"전 세계 19개국, 8만 매장이 증명하는 새로움과 <br> 점주님들을 위한 차별화된 혜택이 기다립니다.",
			startMore: "./sub4/sub4_1.html",
		},
		{
			backgroudImg: "./main_images/start_up3.avif",
			starth3: "당신의 가게,<br> 우리의 여정!",
			startp1:
				"세븐일레븐과 함께라면 창업은 낯선 도전이 아닌 든든한 여행입니다. <br> 전문가와 나누는 1:1 상담부터 개점의 순간까지,<br> 모든 과정을 함께합니다.",
			startp2:
				"처음 설계하는 작은 가게 꿈이 <br> 현실이 되는 날까지, 세븐일레븐이 모든 과정을 함께합니다.",
			startMore: "./sub4/sub4_2.html",
		},
		{
			backgroudImg: "./main_images/start_up6.avif",
			starth3: "창업 설명회,<br> 새로운 시작의 초대",
			startp1:
				"첫걸음을 내딛는 순간, 혼자가 아닙니다.<br>세븐일레븐이 곁에서 함께 방향을 잡아드립니다.<br> 당신의 시작이 더 멀리, 더 단단해질 수 있도록 든든히 동행하겠습니다.",
			startp2:
				"당신의 꿈이 싹트고 자라날 수 있도록,<br> 창업의 모든 과정을 함께 준비합니다.",
			startMore: "./sub4/sub4_3.html",
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
		const $this = $(this);
		const fadeSpeed = 200;

	
		$this.fadeOut(fadeSpeed , function(){
			$(this).html(original_content);
			$(this).css("background", "url(./main_images/start_up1.avif)");
			$(this).find(".start_up_list > li").removeClass("active");
			$this.fadeIn(fadeSpeed);
		})
		
	});
});
