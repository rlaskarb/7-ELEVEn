$(document).ready(function () {
	let presentationData = [];

	// JSON 데이터 로드
	$.getJSON("./data/presentation.json", function (data) {
		presentationData = data.presentation_area;
	});
	// 모달 열기 함수
	window.openModal = function (region) {
		const modal = $("#pre_modal");
		const modalTitle = $("#pre_modal_title");
		const modalInfo = $("#pre_modal_info");

		// 지역별 데이터 필터링
		const regionMapping = {
			seoul: "서울",
			gyeonggi: "경기",
			incheon: "인천",
			gangwon: "강원",
			daejeon: "대전",
			chungcheong: "충청",
			jeolla: "전라",
			gwangju: "광주",
			daegu: "대구",
			gyeongsang: "경상",
			busan: "부산",
			jeju: "제주",
		};

		const selectedRegion = regionMapping[region];
		const filteredData = presentationData.filter(
			(item) => item.area === selectedRegion
		);

		modalTitle.text(selectedRegion + " 지역 창업설명회");

		// 표 형식으로 데이터 생성
		let tableHTML = `
            <div class="table_wrapper">
                <table class="presentation_table">
                    <thead>
                        <tr>
                            <th scope="col">일시</th>
                            <th scope="col">장소명</th>
                            <th scope="col">주소</th>
                            <th scope="col">상담전화</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

		if (filteredData.length > 0) {
			filteredData.forEach(function (item) {
				tableHTML += `
                    <tr>
                        <td class="datetime">${item.dateTime}</td>
                        <td class="place">${item.place}</td>
                        <td class="address">${item.address}</td>
                        <td class="phone">
                            <button class="phone_btn" onclick="makeCall('${item.about}')">
                                📞 ${item.about}
                            </button>
                        </td>
                    </tr>
                `;
			});
		}

		tableHTML += `
                    </tbody>
                </table>
            </div>
        `;

		modalInfo.html(tableHTML);
		modal.fadeIn(300);
	};

	// 모달 닫기
	window.closeModal = function () {
		$("#pre_modal").fadeOut(300);
	};

	// 전화 걸기
	window.makeCall = function (phoneNumber) {
		if (phoneNumber) {
			if (confirm(`${phoneNumber}로 창업 상담 전화를 거시겠습니까?`)) {
				window.location.href = `tel:${phoneNumber}`;
			}
		}
	};

	// 대표번호 전화 걸기 (모달 하단 버튼용)
	$(".call_btn").on("click", function () {
		makeCall("080-870-0711");
	});

	// 모달 바깥 클릭시 닫기
	$(document).on("click", "#pre_modal", function (e) {
		if (e.target === this) {
			closeModal();
		}
	});

	// ESC 키로 모달 닫기
	$(document).on("keydown", function (e) {
		if (e.keyCode === 27) {
			closeModal();
		}
	});

	// 링크 클릭 방지
	$(".presentation li a").on("click", function (e) {
		e.preventDefault();
	});
});
