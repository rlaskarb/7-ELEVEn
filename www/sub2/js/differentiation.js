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
		url: "./data/differentiation.json",
		dataType: "json",
		success: function (data) {
			const useData = data.differentiation;

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

				//버튼 스타일 변경
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
					}
				}
			});
		},
	});
});
