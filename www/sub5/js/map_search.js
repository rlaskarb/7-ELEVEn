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
			name: "탑골공원점",
			sido: "서울특별시",
			gugun: "종로구",
			address: "서울특별시 종로구 수표로 110",
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
	//지도 생성 및 객체 리턴
	const map = new kakao.maps.Map(mapContainer, mapOption);
	const geocoder = new kakao.maps.services.Geocoder();
	const imageSrc = "../common/images/main_logo.png";
	const imageSize = new kakao.maps.Size(40, 40);
	const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

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

	// async / awit 사용한 검색 이벤트
	$searchBtn.on("click", async function () {
		markers.forEach((marker) => marker.setMap(null));
		markers = [];

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
					image: markerImage, // 커스텀 마커 이미지 설정
				});

				markers.push(marker);

				kakao.maps.event.addListener(marker, "click", function () {
					const infowindow = new kakao.maps.InfoWindow({
						content: `<div style="padding:5px;font-size:12px;">${store.name}</div>`,
					});
					infowindow.open(map, marker);
				});
				bounds.extend(coords);
			}
		}

		if (markers.length > 0) {
			msetBounds(bounds);
		} else {
			alert("모든 매장의 주소를 찾을 수 없습니다.");
		}
	});
});

/*

 `map_search.js` 코드 해설서 📖


  이 스크립트의 최종 목표는 "사용자가 선택한 지역의 세븐일레븐 매장을 주소 기반으로 찾아서, 예쁜 로고
  아이콘으로 지도에 표시해주는 것" 입니다. 이 목표를 위해 코드는 크게 네 부분으로 나뉘어 일합니다.

  1부: 무대 준비 (초기 설정)

  모든 연극이 시작되기 전에 무대 장치를 준비하듯, 우리 코드도 가장 먼저 필요한 도구와 데이터를 준비합니다.


   - `storeData` (우리의 재료 목록):
      이 배열은 우리가 지도에 표시할 모든 매장의 '정보'를 담고 있습니다. 각 매장은 이름, 시/도, 구/군,
  그리고 가장 중요한 주소 정보를 가지고 있습니다. 이전과 달리, 위도/경도라는 어려운 숫자 대신 우리가
  일상에서 쓰는 '주소'를 사용하기로 했죠.


   - `map` (우리가 그림을 그릴 도화지):
      getElementById로 HTML의 <div id="map_search"> 영역을 찾아옵니다. 그리고 new kakao.maps.Map()을 통해 그
   영역을 카카오 지도가 표시될 '도화지'로 만듭니다. 처음에는 서울 시청 근처가 보이도록 중심을 잡아줍니다.


   - `geocoder` (주소 번역가):
      new kakao.maps.services.Geocoder()로 생성된 이 객체는 아주 중요한 '번역가'입니다. 우리는 "서울특별시
  종로구 삼청로 22" 같은 주소를 주면, geocoder는 지도(기계)가 알아들을 수 있는 언어인 '위도'와 '경도' 좌표로
   똑똑하게 번역해줍니다.


   - `markerImage` (우리가 사용할 특별한 도장):
      지도에 위치를 표시하는 것을 '마커'라고 합니다. 보통은 기본 핀 모양이지만, 우리는 세븐일레븐 로고
  모양의 '특별한 도장'을 사용하고 싶었어요. 그래서 new kakao.maps.MarkerImage()를 이용해 로고 이미지의
  경로와 크기를 지정하여 우리만의 markerImage 도장을 만들어 둔 것입니다.

  2부: 똑똑한 필터 만들기 (드롭다운 메뉴)


  사용자가 원하는 지역을 쉽게 선택할 수 있도록 '시/도'와 '구/군' 드롭다운 메뉴를 설정하는 부분입니다.


   - '시/도' 메뉴 채우기:
      storeData에 있는 모든 매장의 '시/도' 정보를 수집합니다. 이때 new Set()이라는 기술을 사용하는데, 이건
  '중복된 이름은 알아서 하나만 남겨주는' 아주 편리한 상자입니다. 덕분에 "서울특별시"가 여러 번 있어도
  메뉴에는 한 번만 깔끔하게 표시됩니다.


   - '구/군' 메뉴의 연동:
      이 부분은 조금 더 똑똑하게 작동합니다. 사용자가 '시/도' 메뉴에서 "서울특별시"를 선택하면, '구/군'
  메뉴는 storeData를 다시 뒤져서 "서울특별시"에 속한 '구/군'(예: 종로구, 강남구)만 모아서 보여줍니다. 만약
  사용자가 "인천광역시"를 선택하면, '구/군' 메뉴는 "남동구", "서구" 등을 보여주도록 내용이 실시간으로
  바뀝니다. 이렇게 두 메뉴가 서로 연동되어 사용자가 편리하게 지역을 좁혀나갈 수 있게 도와줍니다.

  3부: 마침내 검색! (메인 이벤트와 비동기 처리)


  사용자가 '검색' 버튼을 눌렀을 때 일어나는 가장 중요하고 복잡한 부분입니다. 이 과정은 카카오 서버와
  통신해야 해서 약간의 '기다림'이 필요하기 때문에 async와 await라는 특별한 기술이 사용됩니다.


   1. 청소하기: 새로운 검색을 시작하기 전에, 이전에 지도에 표시되었던 낡은 마커들을 marker.setMap(null) 코드로
      깨끗하게 지웁니다.

   2. 사용자 선택 확인: 사용자가 드롭다운 메뉴에서 선택한 '시/도'와 '구/군' 값을 가져옵니다.


   3. 데이터 거르기: storeData라는 전체 재료 목록에서, 사용자가 선택한 지역에 맞는 매장들만 골라내어
      filteredStores라는 새로운 목록을 만듭니다.


   4. 한 집, 한 집 찾아가기 (for...of 와 await의 협업):
      이제 filteredStores 목록에 있는 매장들을 하나씩 방문하며 지도에 표시할 차례입니다.
       - `geocoder.addressSearch` (주소 물어보기): 각 매장의 '주소'를 위에서 만든 '주소 번역가(geocoder)'에게
         물어봅니다. "이 주소는 좌표가 뭔가요?"
       - `await new Promise(...)` (기다림의 미학): 번역가에게 물어보면 답이 바로 오지 않습니다. 카카오
         서버까지 가서 알아와야 하므로 시간이 걸립니다. 이때 await가 "결과가 올 때까지 잠시만 기다릴게!"라고
         말하며 코드의 실행을 잠시 멈춥니다. 마치 커피숍에서 주문하고 진동벨이 울릴 때까지 기다리는 것과
         같아요. 주소 변환에 성공하면(진동벨이 울리면), 좌표 값이란 커피를 들고 다음 작업을 시작합니다.
         실패하면 에러 메시지를 남기고 다음 매장으로 넘어갑니다.
       - 도장 찍기: 무사히 좌표를 받으면, new kakao.maps.Marker()를 이용해 해당 위치에 우리가 만든 예쁜 로고
         도장(markerImage)을 쾅! 찍습니다. 그리고 이 마커를 클릭하면 매장 이름이 표시되는 작은
         정보창(InfoWindow)이 뜨도록 설정합니다.

  4부: 전체 모습 보여주기 (지도 범위 조정)


  모든 매장에 도장을 찍었다면, 마지막으로 할 일이 남았습니다.


   - `map.setBounds(bounds)` (최적의 뷰 제공):
      for 반복문이 모든 매장을 처리하는 동안, bounds.extend(coords) 코드는 검색된 모든 마커들을 포함하는
  거대한 사각형 영역(bounds)을 계속해서 그리고 있었습니다. 모든 마커가 찍힌 후, map.setBounds(bounds)라는 이
   한 줄의 명령은 지도에게 "이 사각형 영역에 있는 모든 마커들이 한눈에 쏙 들어오도록 지도 중심과 확대 레벨을
   자동으로 맞춰줘!" 라고 지시합니다. 덕분에 사용자는 검색된 매장들을 보기 위해 직접 지도를 움직일 필요가
  없어집니다.

  --- */
