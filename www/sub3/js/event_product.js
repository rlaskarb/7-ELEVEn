$(document).ready(function () {
	//1 URL 파라미터 추출
	function getParams() {
		const params = new URL(location.href).searchParams;

		const firstKey = [...params.keys()][0];
		const firstValue = params.get(firstKey);

		console.log("첫번째key : ", firstKey);
		console.log("첫번째value : ", firstValue);

		// 찾아봐서 공부하기
		for (const [k, v] of params) {
			console.log(`kye${k},value=${v}`);
		}
		return { key: firstKey, value: firstValue };
	}
	const { key, value } = getParams(); // 외부에서도 사용가능

	//검색결과 없을때 보여주는 HTML 템플릿
	function getNoResultHTML() {
		return `
        <div class="no_result_container">
            <img src="./images/content2/ddddd.png">
            <div>
                <span>앗! 찾으시는 상품이 없네요⭐ </span>
                <span> 하지만 저희가 한번 만들어 보겠습니다!🚀</span>
			    <span>상품제안 하셔서 상품으로 출시되면 어마어한 상품이!!⭐</span>
			    <a href="../sub6/sub6-1.html" class="suggestion_button">
						 상품제안 바로가기
                </a>
            </div>
        </div>
        `;
	}

	// 2. Ajax로 json 불러오기
	$.ajax({
		url: "./data/event_product.json",
		dataType: "json",
		success: function (data) {
			const useData = data.event_product;

			function dataPrint(arr) {
				const listItems = $.map(arr, function (item) {
					const price = Number(item.Price).toLocaleString(); //가격 천원단위로 콤마!
					const name = item.Name;
					const image = item.Image;

					return `<li>
                        <img src="${image}" alt="${name}">
          				<dl>
          					<dt>${name}</dt>
          					<dd>${price}원</dd>
          				</dl>
          				<a href="#" class="pop_open">자세히보기</a>
                    </li>
                    `;
				});
				$(".new_product_list").html("<ul>" + listItems.join("") + "</ul>");
			}

			//3. 데이터 출력 함수

			let newArray = [];
			let search_on = false; //검색 상태확인

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
					$(".new_product_list").html("<>"); // 질문1개
				}
				search_on = true;
			} else {
				dataPrint(useData);
				search_on = false;
			}

			//4. 검색 버튼 클릭 이벤트
			$(".new_food_btn").click(function (event) {
				event.preventDefault();
				const searchValue = $(".new_food_input").val();

				if (searchValue) {
					newArray = useData.filter(function (element) {
						return (
							element.Name.includes(searchValue) ||
							element.flavor.includes(searchValue) ||
							element.menu.includes(searchValue)
						);
					});
					if (newArray.length != 0) {
						dataPrint(newArray);
					} else {
						$(".new_product_list").html(getNoResultHTML());
					}
					search_on = true;
					$(".new_food_input").val("");
				} else {
					dataPrint(useData);
				}
			});

			// 카테고리 필터링 이벤트
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
						case "on_sale":
							filteredData = useData.filter(function (item) {
								return item.menu == "할인중";
							});
							break;
						case "one_plus":
							filteredData = useData.filter(function (item) {
								return item.menu == "1+1";
							});
							break;
						case "two_plus":
							filteredData = useData.filter(function (item) {
								return item.menu == "2+1";
							});
							break;
						case "presentation":
							filteredData = useData.filter(function (item) {
								return item.menu == "증정품";
							});
							break;
						case "ice_cream":
							filteredData = useData.filter(function (item) {
								return item.menu == "아이스크림";
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

			// 팝업 생성함수 만들기
			let ind = 0; // 현재 선택된 아이템의 인덱스

			function popUpChange(item) {
				const image = item.Image;
				const name = item.Name;
				const price = Number(item.Price).toLocaleString(); // 가격 천단위 콤마로 포멧
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

			// 팝업 열기 이벤트 (동적으로 생성된 요소에 이벤트 바인딩)
			$(document).on("click", ".pop_open", function (e) {
				e.preventDefault();
				$(".new_modal_box").fadeIn("slow");

				// 클릭된 요소의 인덱스 찾기
				ind = $(this).closest("li").index();

				// let search_on = false; // 검색 상태확인
				if (search_on == false) {
					popUpChange(useData[ind]);
				} else {
					popUpChange(newArray[ind]);
				}
			});

			// 팝업 닫기 이벤트
			$(document).on("click", ".close_pop", ".new_modal_box", function (event) {
				event.preventDefault();
				$(".new_modal_box").fadeOut("fast");
			});

			// 팝업 내용 영역 클릭 시 팝업이 닫히지 않도록 방지
			$(document).on("click", ".new_popup_content", function (event) {
				event.stopPropagation();
			});
		},
		error: function () {
			console.log("json 파일 들고오는거 실패했어..ㅠ");
			$(".new_product_list").html("<span>데이터를 불러올 수 없습니다</span>");
		},
	});
});
