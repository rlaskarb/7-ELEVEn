$(document).ready(function () {
	let storeData = []; // 매장 데이터를 저장할 변수

	// JSON 파일에서 매장 데이터 불러오기
	$.getJSON("./data/store_address.json", function (data) {
		storeData = data.store_address; 

		// 데이터 로드 후 초기화 및 이벤트 바인딩
		initializeMapAndEvents();
	}).fail(function () {
		console.error("store_address.json 파일을 불러오는데 실패했습니다.");
		alert("매장 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
	});

	function initializeMapAndEvents() {
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

		
		const imageSrc = "../common/images/main_logo.png";
		const imageSize = new kakao.maps.Size(25, 25); // 
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
							<strong style="color: #E31E24;">${store.name}</strong><br>
							<small style="color: #666;">${store.address}</small>
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

			if (markers.length > 0) {
				map.setBounds(bounds);

				// 검색 결과 알림
				setTimeout(() => {
					console.log(`총 ${filteredStores.length}개의 매장을 찾았습니다!`);
				}, 1000);
			} else {
				alert("모든 매장의 주소를 찾을 수 없습니다.");
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
								'<div style="padding:5px; color:rgba(217, 38, 41, 0.9);"><strong>📍 현재 위치</strong></div>',
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
	}
});
