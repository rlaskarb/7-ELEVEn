$(document).ready(function () {
	const benefitsData = [
		{
			title: "점포 운영지원",
			details: [
				{
					icon: "fa-solid fa-store",
					dt: "점포보험",
					dd: "이제 걱정 말고 장사만 하세요.<br> 화재부터 도난까지, 우리가 다 책임집니다.",
				},
				{
					icon: "fa-solid fa-user-shield",
					dt: "경영주 보험",
					dd: "사장님의 안전도 소중합니다. 예상치 못한 사고와<br> 상해로부터 경영주를 보호하는 든든한 보장",
				},
				{
					icon: "fa-solid fa-chart-line",
					dt: "경영 컨설팅 지원",
					dd: "매출 부진 원인 분석부터 개선 실행까지<br> 단계별 맞춤 지원 서비스",
				},
				{
					icon: "fa-solid fa-graduation-cap",
					dt: "오픈점 사전 검증",
					dd: "오픈 전 입지 분석과 예상으로<br> 매출 진단으로 성공 가능성을 미리 확인",
				},
			],
		},
		{
			title: "경영주 자녀 지원",
			details: [
				{
					icon: "fa-solid fa-graduation-cap",
					dt: "고등학생 자녀 등록금 전액 지원",
					dd: "우수 운영 점포(3년 이상)의 고등학생 자녀 1명에게<br> 등록금을 전액 지원하여 사장님의 교육비 부담을 덜어드립니다",
				},
				{
					icon: "fa-solid fa-piggy-bank",
					dt: "대학생 자녀 등록금 이자 지원",
					dd: "3개월 이상 운영하는 모든 점포의 대학생 자녀들에게 <br>학자금 대출 이자를 지원하여 학업에 집중할 수 있도록 돕습니다",
				},
				{
					icon: "fa-solid fa-campground",
					dt: "경영주 자녀 캠프",
					dd: "스키캠프, 롯데월드 등 다양한 체험 프로그램으로<br> 아이들에게 소중한 추억과 경험을 선물합니다",
				},
				{
					icon: "fa-solid fa-handshake-angle",
					dt: "경영주 자녀 채용 우대",
					dd: "경영주님이 추천하는 우수 인재에게 <br>특별 채용 기회를 제공하여 안정적인 취업의 길을 열어드립니다",
				},
			],
		},
		{
			title: "일상 플러스 혜택",
			details: [
				{
					icon: "fa-solid fa-plane-departure",
					dt: "일본, 대만 등 해외편의점 탐방 기회 제공",
					dd: "열심히 운영하시는 우수 점포 사장님들을 선정하여<br> 해외 선진 편의점을 직접 탐방하고 새로운 운영 아이디어를<br> 얻을 수 있는 특별 연수 프로그램을 제공합니다",
				},
				{
					icon: "fa-solid fa-hotel",
					dt: "법인콘도 이용",
					dd: "전국 주요 휴양지의 롯데 콘도를 특별 할인가로 <br>이용하여 가족과 함께 소중한 휴식 시간을<br> 보낼수 있는 힐링 프로그램입니다.",
				},
				{
					icon: "fa-solid fa-microphone-lines",
					dt: "경영주와 함께하는 행복충전 콘서트",
					dd: "바쁜 일상 속에서 잠시 여유를 찾을 수 있도록 <br>유명 가수들의 공연과 함께하는 문화 체험 시간을<br> 마련하여 경영주님들의 마음을 달래드립니다",
				},
				{
					icon: "fa-solid fa-gem",
					dt: "롯데백화점 VIP 멤버십 혜택",
					dd: "롯데백화점에서 특별 할인과 우선 예약 서비스를<br> 제공받을 수 있는 VIP 등급으로 승급하여 품격 있는<br> 쇼핑과 서비스를 경험하실 수 있습니다",
				},
			],
		},
	];

	const $benefitItems = $(".benefits_container > div > ul > li");
	const $modalOverlay = $("#modal_overlay");
	const $modalContainer = $("#modal_container");
	const $modalTitle = $modalContainer.find(".modal_title");
	const $modalBody = $modalContainer.find(".modal_body");
	const $closeModalBtn = $("#modal_close_btn");

	function opneModal(index) {
		const data = benefitsData[index];
		$modalTitle.text(data.title);
		const contentHTML = `<ul>${data.details
			.map(
				(item) =>
					`<li class="benefit_card">
                <div class="card_icon"> <i class="${item.icon}"></i></div>
                <dl>
                <dt>${item.dt}</dt>
                <dd>${item.dd}</dd>
                </dl>
                </li>`
			)
			.join("")}</ul>`;
		$modalBody.html(contentHTML);

		$modalOverlay.removeClass("is_hidden");
		$modalContainer.removeClass("is_hidden");
	}
	// 팝업 닫기
	function closeModal() {
		$modalOverlay.addClass("is_hidden");
		$modalContainer.addClass("is_hidden");
	}

	$benefitItems.on("click", function (event) {
		event.preventDefault();
		const index = $(this).index();
		opneModal(index);
	});

	$closeModalBtn.on("click", closeModal);
	$modalOverlay.on("click", closeModal);
});
