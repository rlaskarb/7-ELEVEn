$(document).ready(function () {
	// EmailJS 초기화 (Public Key)
	emailjs.init({
		publicKey: "rTtduLQ4RksqiTvr5",
	});

	$("#user_tel").on("input", function () {
		$(this).val(
			$(this)
				.val()
				.replace(/[^0-9]/g, "")
				.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
				.replace(/(\-{1,2})$/g, "")
		);
	});

	// contact-form 제출 이벤트 리스너
	$("#contact-form").on("submit", function (event) {
		event.preventDefault(); // 폼 기본 제출 방지

		// 체크박스 검사
		if (!$("#agree_checkbox").is(":checked")) {
			alert("개인정보 수집이용에 동의부탁드립니다.");
			return;
		}

		//이메일 검사
		const email = $("#user_email").val();
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
		if (!emailRegex.test(email)) {
			alert("올바른 이메일 주소를 입력해주시면 감사드려요");
			$("#user_email").focus();
			return;
		}

		// Service ID와 Template ID
		const serviceID = "service_myl4gtm";
		const templateID = "template_gf2byao";

		// 로딩 표시 (예: 버튼 비활성화)
		const submitButton = $(this).find('button[type="submit"]');
		submitButton.prop("disabled", true).text("제안 보내는 중...");

		// EmailJS를 사용해 폼 데이터 전송
		emailjs
			.sendForm(serviceID, templateID, this)
			.then(
				() => {
					console.log("SUCCESS!");
					alert("메일 전송에 성공하였습니다.");
					// 성공 시 폼 초기화
					this.reset();
				},
				(error) => {
					console.log("FAILED...", error);
					alert("메일 전송에 실패하였습니다.");
				}
			)
			.finally(() => {
				// 버튼 다시 활성화
				submitButton
					.prop("disabled", false)
					.text("세븐일레븐에 제안보내기 버튼");
			});
	});
});
