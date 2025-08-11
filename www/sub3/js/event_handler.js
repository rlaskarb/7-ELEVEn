// 개선된 이벤트 핸들러 (팝업 기능 포함)
// 현재 페이지가 어떤 페이지인지 자동으로 판단하는 함수
function getCurrentPageType() {
	const currentPath = window.location.pathname;
	if (currentPath.includes("sub3_2")) {
		return "ongoing";
	} else if (currentPath.includes("sub3_3")) {
		return "finished";
	}
	return null;
}

// 날짜 비교 함수 (더 안전한 날짜 처리)
function isEventOngoing(endDateString) {
	const today = new Date();
	today.setHours(23, 59, 59, 999); // 오늘 마지막 시간으로 설정

	const endDate = new Date(endDateString + "T23:59:59"); // 종료일 마지막 시간

	return endDate >= today;
}

// 전역 변수로 이벤트 데이터 저장 (팝업에서 사용하기 위해)
let globalEventsData = [];

// 메인 이벤트 로드 함수 (자동으로 페이지 타입 감지)
function loadEvents() {
	const pageType = getCurrentPageType();

	if (!pageType) {
		console.error("페이지 타입을 감지할 수 없습니다.");
		return;
	}

	$(document).ready(function () {
		// JSON 데이터 로드
		$.getJSON("./data/events_in_progress.json", function (data) {
			console.log("JSON 데이터 로드 성공:", data);

			const allEvents = data.events_in_progress;
			globalEventsData = allEvents; // 전역 변수에 저장

			if (!allEvents || allEvents.length === 0) {
				console.warn("이벤트 데이터가 없습니다.");
				displayNoEventsMessage();
				return;
			}

			// 이벤트 필터링
			let filteredEvents;
			if (pageType === "ongoing") {
				filteredEvents = allEvents.filter((event) =>
					isEventOngoing(event.endDate)
				);
				console.log("진행중인 이벤트 수:", filteredEvents.length);
			} else if (pageType === "finished") {
				filteredEvents = allEvents.filter(
					(event) => !isEventOngoing(event.endDate)
				);
				console.log("종료된 이벤트 수:", filteredEvents.length);
			}

			// 이벤트 렌더링 (간단한 카드 형태로)
			renderSimpleEventCards(filteredEvents, pageType);
		}).fail(function (jqxhr, textStatus, error) {
			console.error("JSON 로드 실패:", textStatus, error);
			const $eventListContainer = $("#event_list");
			$eventListContainer.html(`
                <div class="error_message">
                    <p>이벤트 데이터를 불러오는 중 문제가 발생했습니다.</p>
                    <p>잠시 후 다시 시도해주세요.</p>
                </div>
            `);
		});
	});
}

// 간단한 이벤트 카드 렌더링 함수
function renderSimpleEventCards(events, pageType) {
	const $eventListContainer = $("#event_list");

	if ($eventListContainer.length === 0) {
		console.error("ID 'event_list'를 가진 요소를 찾을 수 없습니다.");
		return;
	}

	if (events.length === 0) {
		displayNoEventsMessage(pageType);
		return;
	}

	const containerClass =
		pageType === "ongoing"
			? "ongoing_event_list_container"
			: "finished_event_list_container";
	const itemClass =
		pageType === "ongoing" ? "ongoing_event_item" : "finished_event_item";

	let eventHtml = `<ul class="${containerClass}">`;

	// 간단한 카드 형태로 이벤트 렌더링
	events.forEach((event) => {
		const eventId = event.di || event.id; // di 또는 id 필드 사용

		eventHtml += `
            <li class="${itemClass}">
                <div class="event_card" data-event-id="${eventId}">
                    <div class="event_image">
                        <img src="${event.image}" alt="${event.title}" loading="lazy">
                    </div>
                    <div class="event_info">
                        <h3 class="event_title">${event.title}</h3>
                        <p class="event_period">
                            ${event.startDate} ~ ${event.endDate}
                        </p>
                    </div>
                    <button class="event_detail_btn">자세히 보기</button>
                </div>
            </li>
        `;
	});

	eventHtml += `</ul>`;
	$eventListContainer.html(eventHtml);

	// 팝업 이벤트 리스너 등록
	bindPopupEvents();

	console.log(`${pageType} 이벤트 ${events.length}개 렌더링 완료`);
}

// 팝업 이벤트 리스너 바인딩
function bindPopupEvents() {
	// 이벤트 카드 클릭 시 팝업 열기
	$(document).on("click", ".event_card", function () {
		const eventId = $(this).data("event-id");
		openEventPopup(eventId);
	});

	// 자세히 보기 버튼 클릭 시 팝업 열기
	$(document).on("click", ".event_detail_btn", function (e) {
		e.stopPropagation(); // 카드 클릭 이벤트와 중복 방지
		const eventId = $(this).closest(".event_card").data("event-id");
		openEventPopup(eventId);
	});

	// 팝업 닫기 이벤트들
	$(document).on("click", ".popup_close_btn", closeEventPopup);
	$(document).on("click", ".event_popup_overlay", function (e) {
		if (e.target === this) {
			closeEventPopup();
		}
	});

	// ESC 키로 팝업 닫기
	$(document).on("keydown", function (e) {
		if (e.key === "Escape" && $(".event_popup_overlay").hasClass("active")) {
			closeEventPopup();
		}
	});
}

// 특정 이벤트 찾기 함수
function findEventById(eventId) {
	return globalEventsData.find((event) => (event.di || event.id) == eventId);
}

// 이벤트 팝업 열기
function openEventPopup(eventId) {
	const event = findEventById(eventId);

	if (!event) {
		console.error("이벤트를 찾을 수 없습니다:", eventId);
		return;
	}

	// 기존 팝업이 있다면 제거
	$(".event_popup_overlay").remove();

	// content를 줄바꿈으로 분리하여 처리
	const contentLines = event.content
		.split(",")
		.map((line) => `<p class="popup_content_line">${line.trim()}</p>`)
		.join("");

	// 팝업 HTML 생성
	const popupHtml = `
        <div class="event_popup_overlay">
            <div class="event_popup_container">
                <div class="popup_header">
                    <h2 class="popup_title">${event.title}</h2>
                    <button class="popup_close_btn">&times;</button>
                </div>
                
                <div class="popup_content">
                    <div class="popup_image_section">
                        <img src="${event.image}" alt="${
		event.title
	}" class="popup_image">
                    </div>
                    
                    <div class="popup_info_section">
                        <div class="popup_period">
                            <strong>이벤트 기간:</strong> ${
															event.startDate
														} ~ ${event.endDate}
                        </div>
                        
                        <div class="popup_details">
                            <strong>이벤트 내용:</strong>
                            <div class="popup_content_details">
                                ${contentLines}
                            </div>
                        </div>
                        
                        ${
													event.url && event.url !== "#"
														? `<div class="popup_link_section">
                                <a href="${event.url}" target="_blank" class="popup_external_link">
                                    이벤트 페이지로 이동
                                </a>
                            </div>`
														: ""
												}
                    </div>
                </div>
                
                <div class="popup_footer">
                    <button class="popup_close_btn secondary">닫기</button>
                </div>
            </div>
        </div>
    `;

	// body에 팝업 추가
	$("body").append(popupHtml);

	// 팝업 활성화 (애니메이션 효과를 위해 약간의 딜레이)
	setTimeout(() => {
		$(".event_popup_overlay").addClass("active");
	}, 10);

	// body 스크롤 방지
	$("body").addClass("popup_open");
}

// 이벤트 팝업 닫기
function closeEventPopup() {
	$(".event_popup_overlay").removeClass("active");

	// 애니메이션 완료 후 DOM에서 제거
	setTimeout(() => {
		$(".event_popup_overlay").remove();
		$("body").removeClass("popup_open");
	}, 300);
}

// 이벤트가 없을 때 메시지 표시
function displayNoEventsMessage(pageType = null) {
	const $eventListContainer = $("#event_list");

	let message;
	if (pageType === "ongoing") {
		message = `
            <div class="no_events_message">
                <p>현재 진행중인 이벤트가 없습니다.</p>
                <p>곧 새로운 이벤트로 찾아뵙겠습니다!</p>
            </div>
        `;
	} else if (pageType === "finished") {
		message = `
            <div class="no_events_message">
                <p>종료된 이벤트가 없습니다.</p>
                <p>진행중인 이벤트를 확인해보세요!</p>
            </div>
        `;
	} else {
		message = `
            <div class="no_events_message">
                <p>이벤트 정보를 불러올 수 없습니다.</p>
            </div>
        `;
	}

	$eventListContainer.html(message);
}

// 페이지 로드 시 자동 실행
$(document).ready(function () {
	loadEvents();
});
