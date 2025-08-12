$(document).ready(function () {
	// 가짜 데이터 만들기
	const storeData = [
		{
			name: "경복궁점",
			sido: "서울특별시",
			gugun: "종로구",
			address: "서울특별시 종로구 삼청로 22",
		},
		{
			name: "탑골공원점",
			sido: "서울특별시",
			gugun: "종로구",
			address: "서울특별시 종로구 수표로 110",
		},
		{
			name: "S종로3가역점",
			sido: "서울특별시",
			gugun: "종로구",
			address: "서울특별시 종로구 돈화문로 11길",
		},
		{
			name: "종로묘동점",
			sido: "서울특별시",
			gugun: "종로구",
			address: "서울특별시 종로구 돈화문로 33",
		},
		{
			name: "만수대로점",
			sido: "인천광역시",
			gugun: "남동구",
			address: "인천광역시 남동구 구월로281",
		},
		{
			name: "구월모래내점",
			sido: "인천광역시",
			gugun: "남동구",
			address: "인천광역시 남동구 구월동호구포로810번길 58",
		},
		{
			name: "만수2점",
			sido: "인천광역시",
			gugun: "남동구",
			address: "인천광역시 남동구 백범로227번길95",
		},
		{
			name: "의정부녹양키움점",
			sido: "경기도",
			gugun: "의정부시",
			address: "경기도 의정부시 체육로306-32",
		},
		{
			name: "녹양역점",
			sido: "경기도",
			gugun: "의정부시",
			address: "경기도 의정부시 체육로 298-5",
		},
		{
			name: "녹양누리점",
			sido: "경기도",
			gugun: "의정부시",
			address: "경기도 의정부시 체육로 298-5",
		},
		{
			name: "인천검암점",
			sido: "인천광역시",
			gugun: "서구",
			address: "인천광역시 서구 승학로471번길 7상가동 101호",
		},
		{
			name: "검암으뜸점",
			sido: "인천광역시",
			gugun: "서구",
			address: "인천 서구 승학로 551 ",
		},
		{
			name: "검암풍림점",
			sido: "인천광역시",
			gugun: "서구",
			address: "인천광역시 서구 검암로40번길5-1, 1층",
		},
		{
			name: "대전봉명타운점",
			sido: "대전광역시",
			gugun: "유성구",
			address: "대전광역시 유성구 계룡로88번길50",
		},
		{
			name: "구암타운점",
			sido: "대전광역시",
			gugun: "유성구",
			address: "대전 유성구 계룡로26번길",
		},
		{
			name: "유성온천역점",
			sido: "대전광역시",
			gugun: "유성구",
			address: "대전광역시 유성구 계룡로 92제 1층",
		},
	];

	const mapContainer = document.getElementById("map_search");
	const mapOption = {
		center: new kakao.maps.LatLng(37.57, 126.991),
		level: 5,
	};

	// 지도 생성
	const map = new kakao.maps.Map(mapContainer, mapOption);

	// 지도 타입 컨트롤 추가 (일반지도, 스카이뷰)
	const mapTypeControl = new kakao.maps.MapTypeControl();
	map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

	// 확대/축소 컨트롤 추가
	const zoomControl = new kakao.maps.ZoomControl();
	map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

	const geocoder = new kakao.maps.services.Geocoder();

	// 🎯 로고 크기 줄이기 (40x40 → 25x25)
	const imageSrc = "../common/images/main_logo.png";
	const imageSize = new kakao.maps.Size(25, 25); // 크기 줄임
	const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

	const $sidoSelect = $("#sido");
	const sidoSet = new Set();

	storeData.forEach(function (store) {
		sidoSet.add(store.sido);
	});

	sidoSet.forEach(function (sido) {
		const option = `<option value="${sido}">${sido}</option>`;
		$sidoSelect.append(option);
	});

	const $gugunSelect = $("#gugun");

	$sidoSelect.on("change", function () {
		const selectedSido = $(this).val();
		$gugunSelect.empty().append('<option value="">구/군 선택</option>');

		if (!selectedSido) {
			return;
		}

		const gugunSet = new Set();
		storeData.forEach(function (store) {
			if (store.sido === selectedSido) {
				gugunSet.add(store.gugun);
			}
		});

		gugunSet.forEach(function (gugun) {
			const option = `<option value="${gugun}">${gugun}</option>`;
			$gugunSelect.append(option);
		});
	});

	const $searchBtn = $("#search_btn");
	let markers = [];
	let infoWindows = []; // 정보창들 관리용

	// 🎯 검색 이벤트 (정보창 자동 표시 기능 추가)
	$searchBtn.on("click", async function () {
		// 기존 마커와 정보창 제거
		markers.forEach((marker) => marker.setMap(null));
		infoWindows.forEach((infoWindow) => infoWindow.close());
		markers = [];
		infoWindows = [];

		const selectedSido = $sidoSelect.val();
		const selectedGugun = $gugunSelect.val();

		const filteredStores = storeData.filter((store) => {
			if (selectedSido && selectedGugun) {
				return store.sido === selectedSido && store.gugun === selectedGugun;
			} else if (selectedSido) {
				return store.sido === selectedSido;
			}
			return true;
		});

		if (filteredStores.length === 0) {
			alert("검색 결과가 없습니다.");
			return;
		}

		const bounds = new kakao.maps.LatLngBounds();

		for (const store of filteredStores) {
			const geocodeResult = await new Promise((resolve) => {
				geocoder.addressSearch(store.address, function (result, status) {
					if (status === kakao.maps.services.Status.OK) {
						resolve(result);
					} else {
						console.error(`'${store.address}' 주소 변환 실패`);
						resolve(null);
					}
				});
			});

			if (geocodeResult) {
				const coords = new kakao.maps.LatLng(
					geocodeResult[0].y,
					geocodeResult[0].x
				);

				const marker = new kakao.maps.Marker({
					map: map,
					position: coords,
					image: markerImage,
				});

				// 🎯 정보창을 바로 표시 (클릭 안해도 보임)
				const infoWindow = new kakao.maps.InfoWindow({
					content: `
						<div style="
							padding: 8px 12px; 
							font-size: 13px; 
							color: #333;
							background: white;
							border-radius: 5px;
							box-shadow: 0 2px 8px rgba(0,0,0,0.15);
							min-width: 120px;
							text-align: center;
						">
							<strong style="color: #E31E24;">${store.name}</strong>
						</div>
					`,
					removable: true, // X 버튼으로 닫을 수 있게
				});

				infoWindow.open(map, marker);

				markers.push(marker);
				infoWindows.push(infoWindow);

				// 마커 클릭시 정보창 다시 열기
				kakao.maps.event.addListener(marker, "click", function () {
					infoWindow.open(map, marker);
				});

				bounds.extend(coords);
			}
		}
	});

	// 🎯 현재 위치 버튼 기능 추가
	const $currentLocationBtn = $(
		'<button id="current_location_btn" style="margin-left: 10px;">📍 내 위치</button>'
	);
	$(".store_search").append($currentLocationBtn);

	$currentLocationBtn.on("click", function () {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				function (position) {
					const lat = position.coords.latitude;
					const lng = position.coords.longitude;
					const moveLatLng = new kakao.maps.LatLng(lat, lng);

					map.setCenter(moveLatLng);
					map.setLevel(4); // 확대해서 보여주기

					// 내 위치 마커 표시
					const currentMarker = new kakao.maps.Marker({
						position: moveLatLng,
						map: map,
					});

					const currentInfoWindow = new kakao.maps.InfoWindow({
						content:
							'<div style="padding:5px; color: #0066cc;"><strong>📍 현재 위치</strong></div>',
					});
					currentInfoWindow.open(map, currentMarker);
				},
				function () {
					alert("위치 정보를 가져올 수 없습니다.");
				}
			);
		} else {
			alert("이 브라우저는 위치 서비스를 지원하지 않습니다.");
		}
	});
});
