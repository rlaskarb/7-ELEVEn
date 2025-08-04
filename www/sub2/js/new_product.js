$(document).ready(function () {
	let key, value;

	// URL 파라미터 추출 함수 (검색 기능용)
	function getParams() {
		const url = decodeURIComponent(location.href);
		url = decodeURIComponent(url);
		let params = "";

		//공부하자
		params = url.substring(url.indexOf("?") + 1, url.length);

		//split() 공부 공부
		//함수는 문자열을 주어진 문자열 구분자나 정규식을 기준으로 나누어 배열로 변환하는 함수입니다
		key = params.split("=")[0];
		value = params.split("=")[1];
	}
	getParams();

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

					return;
					`<li>
          				<img src"${image}" alt="${name}">
          				<dl>
          					<dt>${name}</dt>
          					<dd>${price}원</dd>
          					<dd> # ${flavor} | # ${menu}</dd>
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
					return element.Name.includes(value);
				});
				if (newArray.length != 0) {
					dataPrint(newArray);
				} else {
					$(".new_product_list").html(
						'<span style="display:block;text-align:center; font-size:30px; color:red">검색된 상품이 없습니다</span>'
					);
				}
			}
		},
	});
});
