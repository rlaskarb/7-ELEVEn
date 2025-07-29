$(document).ready(function () {
	const imageSets = [
		[
			"./images/content1/lottecon1.png",
			"./images/content1/lottecon2.png",
			"./images/content1/lottecon3.png",
		],
		[
			"./images/content1/lottecon4.png",
			"./images/content1/lottecon5.png",
			"./images/content1/lottecon6.png",
		],
		[
			"./images/content1/lottecon7.png",
			"./images/content1/lottecon8.png",
			"./images/content1/lottecon9.png",
		],
	];

	let currentSetIndex = 0;

	const $imageGroup = $(".cooperative_img img");

	setInterval(function () {
		$imageGroup
			.fadeOut(500)
			.promise()
			.done(function () {
				currentSetIndex = (currentSetIndex + 1) % imageSets.length;
				const nextImageSet = imageSets[currentSetIndex];
				$imageGroup.each(function (index, element) {
					$(element).attr("src", nextImageSet[index]);
				});
				$imageGroup.fadeIn(500);
			});
	}, 3000);
});

/*
  `$imageGroup.fadeOut(500).promise().done(function() { ... });`
       * .promise(): fadeOut 애니메이션 3개가 모두 끝날 때까지 기다리라는 특별한
         명령입니다.
       * .done(): promise()의 기다림이 끝나면, .done() 안에 있는 함수를 정확히 딱 한
         번만 실행해 줍니다.
*/
