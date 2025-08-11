$(document).ready(function () {
	// URL 파라미터 추출 함수 (검색 기능용)
	function getParams() {
		const params = new URL(location.href).searchParams;
		const query = params.get("query"); // 'query' 파라미터 값을 가져옴
		console.log("검색어:", query);
		return query; // 검색어만 반환
	}

	//검색결과 없을때 보여주는 html 템플릿
	function getNoResultHTML() {
		return `
		<div class="no_result_container">
			<img src="./images/content2/ddddd.png">
			<div>
			<span> 앗! 찾으시는 상품이 없네요⭐</span>
			<span> 하지만 저희가 한번 만들어 보겠습니다!🚀</span>
			<span>상품제안 하셔서 상품으로 출시되면 어마어한 상품이!!⭐</span>
			<a href="../sub6/sub6_1.html" class="suggestion_button">
						상품제안 바로가기
			</a>
			</div>
		</div>
		`;
	} 

	// 상품 리스트 HTML 생성 함수
	function dataPrint(arr) {
		const listItems = $.map(arr, function (item) {
			const price = Number(item.Price).toLocaleString(); // 가격 천단위 콤마로 포멧
			const name = item.Name;
			// 이미지 경로를 각 JSON 파일에 맞게 수정
			let image = item.Image;
			if (item.source === 'event') {
				image = `../sub3/${image.substring(2)}`; // './images/...' -> '../sub3/images/...'
			}

			return `<li>
						<img src="${image}" alt="${name}">
						<dl>
							<dt>${name}</dt>
							<dd>${price}원</dd>
						</dl>
						<a href="#" class="pop_open">자세히보기</a>
					</li>`;
		});

		$(".new_product_list").html("<ul>" + listItems.join("") + "</ul>");
	}
	
	// 팝업 생성함수 만들기
	function popUpChange(item) {
		let image = item.Image;
		if (item.source === 'event') {
			image = `../sub3/${image.substring(2)}`;
		}

		const name = item.Name;
		const price = Number(item.Price).toLocaleString();
		const dd1 = item.popDd1;
		const dd2 = item.popDd2;
		const dd3 = item.popDd3;
		const flavor = item.flavor;
		const menu = item.menu;

		const popupHtml = `<ul>
							<li>
								<img src="${image}" alt="${name}">
								<dl>
									<dt>${name}</dt>
									<dd>${dd1}</dd>
									<dd>${dd2}</dd>
									<dd>${dd3}</dd>
									<dd> 가격 : ${price}원</dd>
									<dd> #${flavor}  #${menu}</dd>
								</dl>
								<a href="#" class="close_pop">
								<i class="fa-solid fa-x"></i>
								</a>
							</li>
						</ul>
						`;

		$(".new_modal_box .new_popup_con").html(popupHtml);
	}


	// 3개의 JSON 파일을 동시에 불러오기
	const newProductPromise = $.ajax({ url: "./data/new_product.json", dataType: "json" });
	const diffProductPromise = $.ajax({ url: "./data/differentiation.json", dataType: "json" });
	const eventProductPromise = $.ajax({ url: "../sub3/data/event_product.json", dataType: "json" });

	Promise.all([newProductPromise, diffProductPromise, eventProductPromise]).then(function (results) {
		// 각 데이터에 출처(source)를 추가
		const newProduct = results[0].newProduct.map(item => ({...item, source: 'new'}));
		const diffProduct = results[1].differentiation.map(item => ({...item, source: 'differentiated'}));
		const eventProduct = results[2].event_product.map(item => ({...item, source: 'event'}));

		// 모든 상품 데이터를 하나로 합침
		const allProducts = [...newProduct, ...diffProduct, ...eventProduct];
		
		let currentData = newProduct; // 기본적으로 보여줄 데이터는 '이달의 신상'
		let newArray = []; // 필터링/검색 결과를 담을 배열
		let search_on = false; // 검색 상태 확인

		const searchQuery = getParams(); // URL에서 검색어 가져오기

		if (searchQuery) {
			// URL에 검색어가 있으면 전체 상품에서 검색
			$(".food_inquiry_btn").removeClass("active"); // 모든 카테고리 버튼 비활성화
			currentData = allProducts;
			newArray = currentData.filter(function (element) {
				return (
					element.Name.includes(searchQuery) ||
					element.flavor.includes(searchQuery) ||
					element.menu.includes(searchQuery)
				);
			});

			if (newArray.length > 0) {
				dataPrint(newArray);
			} else {
				$(".new_product_list").html(getNoResultHTML());
			}
			search_on = true;
		} else {
			// URL에 검색어가 없으면 '이달의 신상'만 표시
			dataPrint(currentData);
			search_on = false;
		}

		// 검색 버튼 클릭 이벤트 (페이지 내 검색)
		$(".new_food_btn").click(function (event) {
			event.preventDefault();
			const searchValue = $(".new_food_input").val();
			currentData = allProducts; // 페이지 내 검색은 항상 전체 상품 대상

			if (searchValue) {
				newArray = currentData.filter(function (element) {
					return (
						element.Name.includes(searchValue) ||
						element.flavor.includes(searchValue) ||
						element.menu.includes(searchValue)
					);
				});
				if (newArray.length > 0) {
					dataPrint(newArray);
				} else {
					$(".new_product_list").html(getNoResultHTML());
				}
				search_on = true;
				$(".new_food_input").val("");
			} else {
				// 검색어가 없으면 초기 상태(이달의 신상)로 돌림
				currentData = newProduct;
				dataPrint(currentData);
				search_on = false;
			}
		});

		//카테고리 필터링 이벤트
		$(".food_inquiry_btn").click(function (event) {
			event.preventDefault();
			$(".food_inquiry_btn").removeClass("active");
			$(this).addClass("active");

			const filterType = $(this).parent().data("filter");
			
			currentData = allProducts;

			if (filterType == "all_food") {
				dataPrint(currentData);
				search_on = true; // 전체보기도 검색의 일종으로 간주
				newArray = currentData;
			} else {
				let filteredData = [];
				const filterMap = {
					"beverage": "음료", "snacks": "과자", "bread": "빵",
					"candy": "사탕", "ice_cream": "아이스크림",
					"sweet": "달달", "salty": "짭짤", "dosirak" : "도시락"
				};
				const filterValue = filterMap[filterType];
				
				if (filterType === 'sweet' || filterType === 'salty') {
					filteredData = currentData.filter(item => item.flavor == filterValue);
				} else {
					filteredData = currentData.filter(item => item.menu == filterValue);
				}

				newArray = filteredData;
				dataPrint(newArray);
				search_on = true;
			}
		});

		// 팝업 열기 이벤트
		$(document).on("click", ".pop_open", function (e) {
			e.preventDefault();
			$(".new_modal_box").fadeIn("slow");
			const ind = $(this).closest("li").index();

			if (search_on) {
				popUpChange(newArray[ind]);
			} else {
				popUpChange(currentData[ind]);
			}
		});

		// 팝업 닫기 이벤트
		$(document).on("click", ".close_pop, .new_modal_box", function (event) {
			event.preventDefault();
			$(".new_modal_box").fadeOut("fast");
		});

		$(document).on("click", ".new_popup_content", function (event) {
			event.stopPropagation();
		});

	}).fail(function(jqXHR, textStatus, errorThrown) {
		console.error("JSON 파일 로딩 실패:", textStatus, errorThrown);
		$(".new_product_list").html("<span>데이터를 불러올 수 없습니다</span>");
	});
});