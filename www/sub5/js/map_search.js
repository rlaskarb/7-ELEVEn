$(document).ready(function () {
	// 가짜 데이터 만들기
	const storeData = [
		{
			name: "세븐일레븐 강남점",
			sido: "서울특별시",
			gugun: "강남구",
			lat: 37.4979,
			lng: 127.0276,
		},
		{
			name: "세븐일레븐 역삼점",
			sido: "서울특별시",
			gugun: "강남구",
			lat: 37.5006,
			lng: 127.0364,
		},
		{
			name: "세븐일레븐 종로점",
			sido: "서울특별시",
			gugun: "종로구",
			lat: 37.57,
			lng: 126.9796,
		},
		{
			name: "세븐일레븐 부산역점",
			sido: "부산광역시",
			gugun: "동구",
			lat: 35.1151,
			lng: 129.0422,
		},
		{
			name: "세븐일레븐 인천 남동구점",
			sido: "인천광역시",
			gugun: "남동구",
			lat: 37.4909,
			lng: 126.4407,
		},
		{
			name: "세븐일레븐 인천 주안역점",
			sido: "인천광역시",
			gugun: "미추홀구",
			lat: 37.5909,
			lng: 126.8407,
		},
		{
			name: "세븐일레븐 인천시청역점",
			sido: "인천광역시",
			gugun: "남동구",
			lat: 37.4999,
			lng: 126.4876,
		},
	];

	const mapContainer = document.getElementById("map_search");
	const mapOption = {
		center: new kakao.maps.LatLng(37.453203242161365, 126.71857136941792),
		level: 3,
	};
	//지도 생성 및 객체 리턴
	const map = new kakao.maps.Map(mapContainer, mapOption);

	const $sidoSelect = $("#sido");

	// 시/도 목록을 중복없이 저장할 상자.
	const sidoSet = new Set();

	storeData.forEach(function (store) {
		//set에 시/도 이름을 추가 (중복이름제거!)
		sidoSet.add(store.sido);
	});

	sidoSet.forEach(function (sido) {
		const option = `<option value="${sido}">${sido}</option>`;
		// 시/도 선택 드롭다운에 만들어진 옵션을 추가
		$sidoSelect.append(option);
	});

	const $gugunSelect = $("#gugun");

	$sidoSelect.on("change", function () {
		//val() : 선택된 드롭다운의 value 값을 가져오는 함수
		const selectedSido = $(this).val();
		$gugunSelect.empty().append('<option value="">구/군 선택</option>');

		if (!selectedSido) {
			return; //함수 여기서 종료
		}

		const gugunSet = new Set();

		storeData.forEach(function (store) {
			if (store.sido === selectedSido) {
				gugunSet.add(store.gugun);
			}
		});

		gugunSet.forEach(function (gugun) {
			const option = `<option value="${gugun}"> ${gugun} </option>`;
			$gugunSelect.append(option);
		});
	});

	const $searchBtn = $("#search_btn");
	let markers = [];

	$searchBtn.on("click", function () {
		const selectedSido = $sidoSelect.val();
		const selectedGugun = $gugunSelect.val();
		markers.forEach(function (marker) {
			marker.setMap(null); // 마커를 지도에서 제거?
		});
		markers = []; // 마커 배열도 비워줍니다?

		const filteredStores = storeData.filter(function (store) {
			if (selectedSido && selectedGugun) {
				return store.sido === selectedSido && store.gugun === selectedGugun;
			} else if (selectedSido) {
				return store.sido === selectedSido;
			} else {
				return true;
			}
		});

		if (filteredStores.length > 0) {
			// 지도영역 재설정 하기위한 객체
			const bounds = new kakao.maps.LatLngBounds();

			filteredStores.forEach(function (store) {
				const position = new kakao.maps.LatLng(store.lat, store.lng);

				const marker = new kakao.maps.Marker({
					map: map,
					position: position,
				});

				markers.push(marker);

				kakao.maps.event.addListener(marker, "click", function () {
					const infowindow = new kakao.maps.InfoWindow({
						content: `<div style="padding:5px;font-size:12px;">${store.name}</div>`,
					});
					infowindow.open(map, marker);
				});
				bounds.extend(position);
			});
			map.setBounds(bounds);
		} else {
			alert("검색결과가 없습니다");
		}
	});
});
