// top 버튼 스므스하게 이동시키기
document.addEventListener("DOMContentLoaded", function () {
	const topButton = document.querySelector(".top_move");
	const visual = document.querySelector(".visual");

	if (topButton && visual) {
		const visualHeight = visual.offsetHeight;
		window.addEventListener("scroll", function () {
			if (window.scrollY > visualHeight) {
				topButton.classList.add("show");
			} else {
				topButton.classList.remove("show");
			}
		});

		topButton.addEventListener("click", function (event) {
			event.preventDefault();
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		});
	}
});

/*

공부용

    *모든것의 시작 document

        document =  JavaScript 가 HTML 문서를 바라볼때 , 그문서 전체를 가리키는 이름이라고 생각 하는게 좋음.
                    웹페이지 모든 태그, 텍스트, 속성 정보가 이 document 안에 들어 있음.

                    우리가 '네비게이션 링크를 찾아와' 또는 'top 버튼 찾아와!' 라고 명령을 할때, 그명령을 내리는 대상이 document 이다.


    * 실행 시점 정하기 addEventListener("DOMContentLoaded" , ...)

        HTML 코드는 위에서 아래 순서대로 읽는다! 만약 JavaScript 코드가 HTML 태그들보다 먼저 실행되면, 아직 만들어지지도 않는
        태그를 찾을려고 하니  "그런게 없는데요??" 하는 에러가 발생한다.

        document.addEventListener("DOMContentLoaded" , ...) 는 일단 HTML 문서 로딩이 다 끝날 때까지 기달렸다가,
        그다음 괄호 안의 코드를 실행해 줘! 라는 아주 중요한 약속. 그래서 스크립트가 항상 안정적으로 작동을 한다.


    * HTML 요소 선택하기 - `querySelector` 와 `querySelectorAll`

        -document 라는 거대한 문서 안에서 내가 원하는 부품(HTML 태그) 을 찾아오는 명령. css 선택자 문법을 그대로 사용해서 아주 편리하다.
        -querySelector(".top_move") : .top_move 라는 클래스를 가진 요소를 딱 한개만 찾아옵니다. (만약 여려 개가 있어도 첫 번째 것만 가져옵니다.)
        -querySelectorAll(".history_nav a") : .history_nav 안에 있는 <a> 태그들 모두 다 찾아서 리스트 (목록) 형태로 가져온다 (sub1-3.js)

    
    * 이벤트 처리 - `addEventListener("click",...)`

        -3단계에서 찾아온 HTML 요소 (버튼, 링크 등)에 '이벤트 탐지기'를 붙이는 역활을 합니다.
        -topButton.addEventListener("click",function(){...})라고 쓰면, topButton을 계속 지켜보다가 , 만약 클릭(click)되면 function(){...}안에
         있는 코드를 실행해! 라는 뜻이다.
        -click 대신 mouseover(마우스를 올렸을때), scroll(스크롤 때) 등 다양한 이벤트를 감지 할수 있다.

    
    * 스크롤 제어! - `window.scrollTo()`

        window 란
            - document 가 문서내용물 이라면  window 는 그 문서를 담고있는 브라우저 창 자체를 의미. 스크롤바,창크기 등 브라우저 창에
                관련된 기능을 window가 관리한다.
        scrollTo({...})
            -window 객체에게 스크롤을 시키는 명령어
            -{top:0 , behavior: "smooth"} 처럼 중괄호 {} 안에 옵션을 넣어서 세밀하게 제어 할수 있습니다.
                -top: Y축(세로) 어디로 이동할지 위치를 지정한다.
                -behavior: smooth(부드럽게) 또는 auto(즉시이동) 같은 동장 방식을 지정.
*/
