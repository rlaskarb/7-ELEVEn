window.onload = function () {
  const COMPANY_INFO = {
    name: "7-ELEVEn 본사",
    address: "서울시 강동구 천호대로 1077 이스트센트럴타워 16~18층",
    phone: "1577-0711",
    manualCoords: {
      lat: 37.53646956942485,
      lng: 127.13221517645553,
    },
  };

  // 지도 컨테이너 찾기
  const container = document.getElementById("content_area_map");

  if (!container) {
    alert("지도 영역을 찾을 수 없습니다.");
    return;
  }

  // 기본지도 생성
  const map = new kakao.maps.Map(container, {
    center: new kakao.maps.LatLng(37.53646956942485, 127.13221517645553),
    level: 3,
  });

  // 수동으로 좌표 찾기vs주소로 좌표 찾기
  const USE_MANUAL_COORDS = true;
  if (USE_MANUAL_COORDS) {
    const coords = new kakao.maps.LatLng(
      COMPANY_INFO.manualCoords.lat,
      COMPANY_INFO.manualCoords.lng
    );
    setupMapWithCoords(map, coords, COMPANY_INFO);
  } else {
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(COMPANY_INFO.address, function (result, status) {
      if (status === kakao.mpas.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        setupMapWithCoords(map, coords, COMPANY_INFO);
      } else {
        alert("주소 검색 실패!");
      }
    });
  }

  // 🗺️ 지도 설정 공통 함수
  function setupMapWithCoords(map, coords, companyInfo) {
    // 지도 중심 이동
    map.setCenter(coords);

    // 마커 표시
    const marker = new kakao.maps.Marker({
      position: coords,
      map: map,
    });

    // 정보창
    const infoWindow = new kakao.maps.InfoWindow({
      content: `
      <div style="padding:12px; text-align:center; min-width:250px;">
        <h4 style="margin:0 0 7px 0; color:red;">${companyInfo.name}</h4>
        <p style="color:green;">${companyInfo.address}</p>
      </div>
    `,
    });

    // 마커 클릭 이벤트
    kakao.maps.event.addListener(marker, "click", function () {
      infoWindow.open(map, marker);
    });

    // 자동으로 정보창 표시
    infoWindow.open(map, marker);

    console.log("🎉 지도 설정 완료!", coords.getLat(), coords.getLng());
  }
};
