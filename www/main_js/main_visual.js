$(document).ready(function () {
	var timeOnOff; // 타이머 처리
	var imageCount = $(".gallery ul li").size(); //이미지 총 개수

	var cnt = 1; // 이미지 순서
	var onOff = true; // 동작 , 안동작

	// 1번 불 오픈!
	$(".btn1").css("background", "#d92629");
	$(".btn1").css("width", "30px");

	// 비주얼 사진 천천이 드러와
	$(".gallery .link1").fadeIn("slow");

	$(".gallery .link1 dt").delay(1000).animate({ top: 230, opacity: 1 }, "slow");
	$(".gallery .link1 dd").delay(2000).animate({ top: 330, opacity: 1 }, "slow");

	function moveing() {
		cnt++;
		if (cnt > imageCount) {
			cnt = 1;
		}

		$(".gallery li dt").css({ opacity: 0, top: "180px" }); // 애니매이션 시작 전 위치
		$(".gallery li dd").css({ opacity: 0, top: "280px" }); // 애니매이션 시작 전 위치

		$(".gallery li").fadeOut("slow"); // 모든 이미지가 안보이게

		$(".gallery .link" + cnt).fadeIn("slow", function () {
			$(this)
				.find("dt")
				.delay(1000)
				.animate({ top: "230px", opacity: 1 }, "slow");
			$(this)
				.find("dd")
				.delay(2000)
				.animate({ top: "330px", opacity: 1 }, "slow");
		});

		$(".mbutton").css({ background: "#017121", width: "16px" });
		//녹색 = 불꺼
		$(".btn" + cnt).css({ background: "#d92629", width: "30px" });
		// 빨간색 = 내꺼만 켜

		if (cnt == imageCount) cnt = 0; // 초기화
	}

	timeOnOff = setInterval(moveing, 5000); //setInterval(알람시계)

	//  도트 클릭할때 이벤트

	$(".mbutton").click(function (event) {
		var $target = $(event.target);

		clearInterval(timeOnOff); // 타이머 중지.

		$(".gallery li").fadeOut("slow");

		if ($target.is(".btn1")) {
			cnt = 1;
		} else if ($target.is(".btn2")) {
			cnt = 2;
		} else if ($target.is(".btn3")) {
			cnt = 3;
		}

		$(".gallery .link" + cnt).fadeIn("slow");

		$(".mbutton").css({ background: "#017121", width: "16px" });
		$(".btn" + cnt).css({ background: "#d92629", width: "30px" });

		$(".gallery li dt ,.gallery li dd").css({ opacity: 0 });

		$(".gallery .link" + cnt)
			.find("dt")
			.delay(1000)
			.animate({ top: "230px", opacity: 1 }, "slow");
		$(".gallery .link" + cnt)
			.find("dd")
			.delay(2000)
			.animate({ top: "330px", opacity: 1 }, "slow");

		if (cnt == imageCount) cnt = 0; // 초기화

		timeOnOff = setInterval(moveing, 5000); // 원 위치로!

		if (onOff == false) {
			onOff == true;
			$(".ps_icon").html(
				`<li class="hidden">stop</li>
          <li><i class="fa-regular fa-circle-stop"></i></li>`
			);
		}
	});

	// stop,play 버튼 클릭시 동작
	$(".ps_icon").click(function () {
		if (onOff == true) {
			clearInterval(timeOnOff);
			$(this).html(`<li class="hidden">play</li>
           <li><i class="fa-regular fa-circle-play"> </i>
          </li>`);
			onOff = false;
		} else {
			timeOnOff = setInterval(moveing, 5000); // 원 위치!
			$(this).html(`<li class="hidden">stop</li>
            <li><i class="fa-regular fa-circle-stop"></i>
          </li>`);
			onOff = true;
		}
	});

	// 왼쪽,오른쪽 버튼처리
	$(".visual .btn_arrow").click(function () {
		clearInterval(timeOnOff); // 알람 꺼줘!

		if ($(this).is(".btnRight")) {
			if (cnt == imageCount) {
				cnt = 0;
			}
			cnt++;
		} else if ($(this).is(".btnLeft")) {
			if (cnt == 1) cnt = imageCount + 1;
			if (cnt == 0) cnt = imageCount;
			cnt--; //
		}

		$(".gallery li").fadeOut("slow");
		$(".gallery .link" + cnt).fadeIn("slow");
		$(".mbutton").css({ background: "#017121", width: "16px" });
		$(".btn_arrow" + cnt).css({ background: "#d92629", width: "30px" });

		$(".gallery li dt ,.gallery li dd").css({ opacity: 0 });

		$(".gallery .link" + cnt)
			.find("dt")
			.delay(1000)
			.animate({ top: "230px", opacity: 1 }, "slow");
		$(".gallery .link" + cnt)
			.find("dd")
			.delay(2000)
			.animate({ top: "330px", opacity: 1 }, "slow");

		timeOnOff = setInterval(moveing, 5000); // 원 위치!!

		if (onOff == false) {
			onOff = true;
			$(".ps_icon").html(`<li class="hidden">stop</li>
            <li><i class="fa-regular fa-circle-stop"></i>
          </li>`);
		}
	});
});
