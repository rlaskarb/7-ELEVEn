$(document).ready(function () {
	// URL 파라미터 추출 함수 (검색 기능용)
	function getParams() {
		const params = new URL(location.href).searchParams;

		//첫번쨰 key ,value 추출
		const firstKey = [...params.keys()][0];
		const firstValue = params.get(firstKey);

		console.log("첫번째key : ", firstKey);
		console.log("첫번째value : ", firstValue);

		//모든 파라미터 출력
		for (const [k, v] of params) {
			console.log(`key=${k},value=${v}`);
		}
		//필요하면 반환
		return { key: firstKey, value: firstValue };
	}
	const { key, value } = getParams(); // 외부에서도 사용가능

	// Ajax로 JSON 데이터 불러오기

	$.ajax({
		url: "./data/new_product.json",
		dataType: "json",
		//json 파일에 연결이 완료되면 자동으로 호출되는 함수
		success: function (data) {
			const useData = data.newProduct;

			// 상품 리스트 HTML 생성 함수
			function dataPrint(arr) {
				const listItems = $.map(arr, function (item) {
					const price = Number(item.Price).toLocaleString(); // 가격 천단위 콤마로 포멧
					const name = item.Name;
					const image = item.Image;
					const flavor = item.flavor;
					const menu = item.menu;

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

			let newArray = []; //검색 결과 저장할 배열
			let search_on = false; // 검색 상태확인

			if (value) {
				newArray = useData.filter(function (element) {
					return (
						element.Name.includes(value) ||
						element.flavor.includes(value) ||
						element.menu.includes(value)
					);
				});
				if (newArray.length != 0) {
					dataPrint(newArray);
				} else {
					$(".new_product_list").html("<>");
				}
				search_on = true;
			} else {
				dataPrint(useData);
				search_on = false;
			}

			// 검색 버튼 클릭 이벤트
			$(".new_food_btn").click(function (event) {
				event.preventDefault();
				const searchValue = $(".new_food_input").val();

				if (searchValue) {
					newArray = useData.filter(function (element) {
						return element.Name.includes(searchValue);
					});
					if (newArray.length != 0) {
						dataPrint(newArray);
					} else {
						$(".new_product_list").html("<span>검색된 상품이 없습니다.</span>");
					}
					search_on = true;
					$(".new_food_input").val("");
				} else {
					dataPrint(useData);
				}
			});
			//카테고리 필터링 이벤트
			$(".food_inquiry_btn").click(function (event) {
				event.preventDefault();

				//활성화 버튼 스타일 변경
				$(".food_inquiry_btn").removeClass("active");
				$(this).addClass("active");

				const filterType = $(this).parent().data("filter");

				if (filterType == "all_food") {
					dataPrint(useData);
					search_on = false;
				} else {
					// 카테고리별 필터링 로직
					let filteredData = [];

					switch (filterType) {
						case "beverage":
							filteredData = useData.filter(function (item) {
								return item.menu == "음료";
							});
							break;
						case "snacks":
							filteredData = useData.filter(function (item) {
								return item.menu == "과자";
							});
							break;
						case "bread":
							filteredData = useData.filter(function (item) {
								return item.menu == "빵";
							});
							break;
						case "candy":
							filteredData = useData.filter(function (item) {
								return item.menu == "사탕";
							});
							break;
						case "ice_cream":
							filteredData = useData.filter(function (item) {
								return item.menu == "아이스크림";
							});
							break;
						case "sweet":
							filteredData = useData.filter(function (item) {
								return item.flavor == "달달";
							});
							break;
						case "salty":
							filteredData = useData.filter(function (item) {
								return item.flavor == "짭짤";
							});
							break;
						default:
							filteredData = useData;
					}

					newArray = filteredData;
					dataPrint(newArray);
					search_on = true;
				}
			});
			// 팝업 변수와 함수
		},
	});
});
