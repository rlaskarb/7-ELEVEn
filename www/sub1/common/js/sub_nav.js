document.addEventListener("DOMContentLoaded", function () {
  const subNavLinks = document.querySelectorAll(".sub_nav ul li a");
  const currentPath = window.location.pathname.split("/").pop();

  subNavLinks.forEach((link) => {
    const linkPath = link.getAttribute("href").split("/").pop();
    if (linkPath === currentPath) {
      link.parentElement.classList.add("current");
    }
  });
});

/*
  pathname: URL 주소중 뒤에오는 경로 부분만 가져온다.

  split() :  문자열(String)을 특정 문자를 기준으로 여러조각을 나누는 명령어 
  
  pop() : 배열의 가장 마지막에 있는 요소를 뽑아내는 명령어 

*/
