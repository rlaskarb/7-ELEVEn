$(document).ready(function () {
	const newMenuData = [
		{
			image: "./sub2/images/content2/new1.jpg",
			productName: "최강록의 리얼웨지감자 ",
			company: "7-ELEVEn",
			description: "강록솊의 진심을 담아 진공저온튀김 공법으로 만들었어요",
			mdReview: "나야 감자..🥔",
			price: "2,000원",
		},
		{
			image: "./sub2/images/content2/new2.jpg",
			productName: "밀키스 포도",
			company: "LOTTE",
			description: "부드러운 탄산에 진한 포도 풍미가 가득!",
			mdReview: "자꾸만 생각나는 밀키스 포도맛🍇",
			price: "2,200원",
		},
		{
			image: "./sub2/images/content2/new3.jpg",
			productName: "크림에 빠진 롤",
			company: "7-ELEVEn",
			description: "크림에 빠진 롤 삼총사! 납작복숭아 / 메론 / 얼그레이레몬롤 ",
			mdReview: "한 번 빠지면 출구 없는 크림 롤!",
			price: "3,300원",
		},
		{
			image: "./sub2/images/content2/new4.jpg",
			productName: "미노리키친 가츠동과 삼각김밥 ",
			company: "7-ELEVEn",
			description: "일본 가정식의 맛 그대로 미노리키친 푸드 시리즈",
			mdReview: "오늘 한끼는 가츠동과 삼각김밥 어때요?",
			price: "가츠동 5,800원 / 삼각 1,300원",
		},
		{
			image: "./sub2/images/content2/new5.jpg",
			productName: "롯샌 멜론",
			company: "LOTTE",
			description: "요즘 대세 인기 멜론 맛으로 역대급 멜론 과자",
			mdReview: "🍈롯샌 멜론과 함께 멜론 코어에 탑승!",
			price: "1,700원",
		},
		{
			image: "./sub2/images/content2/new6.jpg",
			productName: "부르봉블란츌 딸기 랑그드샤",
			company: "7-ELEVEn",
			description: "입에서 사르르 순삭하는 딸기 랑그드샤",
			mdReview: " 딸기 랑그드샤..샤랑해…💕 ",
			price: "3,000원",
		},
		{
			image: "./sub2/images/content2/new7.jpg",
			productName: "스윙칩고수타코맛 ",
			company: "오리온",
			description: "고수 입문자도, 고수 러버도 맛있게 즐길 수 있어요",
			mdReview: "과연 나의 고수력 은?!🧐",
			price: "1,700원",
		},
		{
			image: "./sub2/images/content2/new8.jpg",
			productName: "누룽지팝",
			company: "농심",
			description: "고소한 누룽지에 달달한 설탕이 솔솔~",
			mdReview: "바삭한 식감이 살아있어요!🤩",
			price: "3,600원",
		},
		{
			image: "./sub2/images/content2/new9.jpg",
			productName: "딸기이즘콘",
			company: "LOTTE",
			description: "본연의 딸기우유맛에 치즈다이스가 더해져 달콤하고 고소해요!",
			mdReview: "딸기이즘콘 먹으러 세븐 갈 사람!",
			price: "3,000원",
		},

		{
			image: "./sub2/images/content2/new10.jpg",
			productName: "머그컵 카스테라볼 , 메이플 시럽 팬케익 ",
			company: "7-ELEVEn",
			description: "🤎카라멜 밀크크림과 🍯메이플시럽을 준비했어요",
			mdReview: "달달한 간식은 사랑입니다. ",
			price: "카스테라볼 3,400원 / 팬케익 2,800원 ",
		},
	];

	// 슬라이드 번호 저장변수
	let currentIndex = 0;
	let timer;

	// 특정번호 슬라이드 내용 화면에 보여주는 함수

	function showSlide(index) {
		const currentData = newMenuData[index];
		const $contentWrapper = $(".new_menu_content_wrapper");
		// 애니매이션이 진행중이면 또 실행되지 않도록 함.
		if ($contentWrapper.is(":animated")) {
			return;
		}

		$contentWrapper.animate({ opacity: 0, left: "-100px" }, 400, function () {
			const newImg = new Image();
			newImg.src = currentData.image;

			// 이미지 로드가 완료되면 실행됨.
			newImg.onload = function () {
				// attr() 속성값을 가져오거나 변경할수 있는 함수.
				$contentWrapper.find(".new_menu_right_box img").attr("src", newImg.src);

				const $menuChange = $contentWrapper.find(".new_menu_change");

				$menuChange.find("dd").eq(0).text(currentData.productName);
				$menuChange.find("dd").eq(1).text(currentData.company);
				$menuChange.find("dd").eq(2).text(currentData.description);
				$menuChange.find("dd").eq(3).find("span").text(currentData.mdReview);
				$menuChange.find("dd").eq(4).find("span").text(currentData.price);

				$contentWrapper.css("left", "100px");
				$contentWrapper.animate({ opacity: 1, left: "0px" }, 400);
			};
		});

		// 먼저 초기화
		$(".new_menu_dot").removeClass("active");
		//추가
		$(".new_menu_dot").eq(index).addClass("active");
		//업데이트
		currentIndex = index;
	}
	//클릭 기능
	$(".new_menu_slider_dots").on("click", ".new_menu_dot", function () {
		const index = $(this).index();
		clearInterval(timer);
		showSlide(index);
		startSlider();
	});

	function startSlider() {
		clearInterval(timer);
		timer = setInterval(function () {
			let nextIndex = (currentIndex + 1) % newMenuData.length;
			showSlide(nextIndex);
		}, 3000);
	}

	$(document).ready(function () {
		const $dotsContainer = $(".new_menu_slider_dots");
		newMenuData.forEach(function () {
			$dotsContainer.append('<li class="new_menu_dot"></li>');
		});
	});

	showSlide(0);
	startSlider();
});
