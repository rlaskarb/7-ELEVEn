$(document).ready(function () {
	const regionData = {
		seoul: {
			title: "서울 지역 창업설명회",
			locations: ["본사", "강서", "대치", "등촌", "마포", "공릉", "신천"],
		},
		gyeonggi: {
			title: "경기 지역 창업설명회",
			locations: ["수원", "시흥", "의정부", "동천", "군포", "고양"],
		},
		incheon: {
			title: "인천 지역 창업설명회",
			locations: ["미추홀구", "계양구"],
		},
		gangwon: {
			title: "강원 지역 창업설명회",
			address: "강원도 원주시 반곡동 혁신로 39-1, 201~202호",
		},
		daejeon: {
			title: "대전 지역 창업설명회",
			address: "대전시 동구 한밭대로 1322",
		},
		chungcheong: {
			title: "충청 지역 창업설명회",
			locations: ["천안", "충주"],
		},
		jeolla: {
			title: "전라 지역 창업설명회",
			locations: ["전주", "군산", "순천", "여수", "목포"],
		},
		gwangju: {
			title: "광주 지역 창업설명회",
			address: "광주광역시 북구 태봉로 67 중앙빌딩3층",
		},
		daegu: {
			title: "대구 지역 창업설명회",
			locations: ["동구", "중구"],
		},
		gyeongsang: {
			title: "경상 지역 창업설명회",
			locations: ["마산", "진주", "포항", "구미"],
		},
		busan: {
			title: "부산 지역 창업설명회",
			address: "부산광역시 부산진구 중앙대로 626",
		},
		ulsan: {
			title: "울산 지역 창업설명회",
			address: "울산광역시 남구 삼산로 74 울산롯데마트 1층 (달동)",
		},
		jeju: {
			title: "제주 지역 창업설명회",
			address: "제주도 제주시 중앙로 273, 201호",
		},
	};

	function openModal(region) {
		const modal = document.getElementById("modal");
		const modalTitle = document.getElementById("modal_title");
		const modalInfo = document.getElementById("modal_info");

		const data = regionData[region];
		modalTitle.textContent = data.title;

		let infoHTML = "";
		if (data.locations) {
			infoHTML += "<p><strong>운영 지점:</strong></p>";
			infoHTML += "<p>" + data.locations.join(", ") + "</p>";
			infoHTML +=
				"<p><strong>안내:</strong> 자세한 설명회 일정과 장소는 전화 상담을 통해 확인하실 수 있습니다.</p>";
		} else if (data.address) {
			infoHTML += "<p><strong>설명회 장소:</strong></p>";
			infoHTML += "<p>" + data.address + "</p>";
			infoHTML +=
				"<p><strong>안내:</strong> 설명회 일정은 전화 상담을 통해 확인하실 수 있습니다.</p>";
		}
		infoHTML += "<p><strong>상담 시간:</strong> 평일 09:00 ~ 18:00</p>";

		modalInfo.innerHTML = infoHTML;
		modal.style.display = "block";
	}

	// 팝업 닫기
	function closeModal() {
		document.getElementById("modal").style.display = "none";
	}

	// 전화 걸기
	function makeCall() {
		if (confirm("창업 상담 전화를 거시겠습니까?\n080-870-0711로 연결됩니다.")) {
			window.location.href = "tel:080-870-0711";
		}
	}

	// 모달 바깥 클릭시 닫기
	window.onclick = function (event) {
		const modal = document.getElementById("modal");
		if (event.target === modal) {
			closeModal();
		}
	};

	// 링크 클릭 방지
	document.querySelectorAll(".presentation li a").forEach(function (link) {
		link.addEventListener("click", function (e) {
			e.preventDefault();
		});
	});
});
