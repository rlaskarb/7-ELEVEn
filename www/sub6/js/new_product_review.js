$(document).ready(function () {
	const supabaseUrl = "https://ozummxbytqiyzpljwbli.supabase.co";
	const supabaseKey =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96dW1teGJ5dHFpeXpwbGp3YmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2Njg5NTksImV4cCI6MjA3MDI0NDk1OX0.s7SmnNVrasiE52xZD1ALRXOUzWkwMcIrLzUkfe18aeo";

	const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

	const $modalBox = $(".edit_modal_box"); // 등록된 글 조회되는 큰박스 창
	const $modalContent = $(".edit_popup_content"); // 실제 조회값이 담기는 박스 창
	const $writeModalBox = $(".write_modal_box");


	// 📌 모달 열기 함수
	function openModal(modalType) {
		const $modal = modalType === "edit" ? $modalBox : $writeModalBox;
		$modal.addClass("show");
		$("body").css("overflow", "hidden");
	}

	// 📌 모달 닫기 함수
	function closeModal(modalType) {
		const $modal = modalType === "edit" ? $modalBox : $writeModalBox;
		$modal.removeClass("show");
		// 두 모달이 모두 닫혔을 때만 스크롤복구
		if (
			!$(".edit_modal_box").hasClass("show") &&
			!$(".write_modal_box").hasClass("show")
		) {
			$("body").css("overflow", "auto");
		}
	}

	async function loadReview() {
		const $boardList = $(".new_product_review_tuck_box");
		// 📌 로딩 효과 추가
		$boardList.addClass("loading").html("<li>로딩 중...</li>");

		const { data: review, error } = await supabaseClient
			.from("NewProductReview")
			.select("*")
			.order("id", { ascending: false });

		// 📌 로딩 효과 제거
		$boardList.removeClass("loading");

		if (error) {
			console.error("게시글 조회 실패:", error);
			alert("게시판 데이터를 불러오는 데 실패했습니다.");
			return;
		}

		console.log("4-2. 게시글 조회 성공! 받아온 데이터:", review);

		$boardList.empty();

		// 📌 빈 목록 처리
		if (review.length === 0) {
			$boardList.html(`
				<div class="empty_list_message">
					아직 등록된 신상품 후기가 없어요.<br>
					첫 번째 신상품 후기를 공유해보세요! 🍧
				</div>
			`);
			return;
		}

		review.forEach(function (review) {
			const imageUrl = review.filePath || ".././common/images/noimg.jpg";
			const displayDate = review.created_at.substring(0, 10);

			// 내용이 너무 길면 자르기
			const truncatedContent =
				review.newContent.length > 50
					? review.newContent.substring(0, 50) + "..."
					: review.newContent;

			// 제목이 너무 길면 자르기
			const truncatedTitle =
				review.newTitle.length > 20
					? review.newTitle.substring(0, 20) + "..."
					: review.newTitle;

			// 📌 개선된 카드 HTML
			const reviewHtml = `
                        <li>
                            <a href="#" class="edit-trigger" data-post-id="${review.id}" >
                                <div class=" review_img">
                                    <img src="${imageUrl}" alt="${review.newTitle} 이미지" loading="lazy">
                                </div>
								<div class="review_content">
                                	<dl>
                                    	<dt>${truncatedTitle}</dt>
                                    	<dd>${truncatedContent}</dd>
										<dd>${review.newName}</dd>	
                                	</dl>
									<div class="review_info">
										<span class="review_date">${displayDate}</span>	
									</div>
								</div>
                            </a>
                       </li>
                    `;
			$boardList.append(reviewHtml);
		});
	}

	// 새 글 저장 함수
	$("#review-form").on("submit", async function (event) {
		event.preventDefault();

		const submitButton = $(".write_buttons button[type='submit']");
		submitButton.prop("disabled", true).text("등록 중...");

		const title = $("#review-title").val();
		const content = $("#review-content").val();
		const nickname = $("#review-nickname").val();
		const email = $("#review-email").val();
		const finalNickname = nickname.trim() === "" ? "익명" : nickname;
		const finalEmail = email.trim() === "" ? "" : email;

		const fileInput = document.getElementById("review-file");
		const file = fileInput.files[0];
		let filePath = null;

		try {
			if (file) {
				const fileName = `${Date.now()}-${file.name}`;
				const { data: uploadData, error: uploadError } =
					await supabaseClient.storage
						.from("review-images")
						.upload(fileName, file);
				if (uploadError) {
					console.error("파일 업로드 실패:", uploadError);
					alert("파일 업로드에 실패했습니다.");
					return;
				}

				const { data: publicUrlData } = supabaseClient.storage
					.from("review-images")
					.getPublicUrl(fileName);
				filePath = publicUrlData.publicUrl;
			}

			const { data, error } = await supabaseClient
				.from("NewProductReview")
				.insert([
					{
						newTitle: title,
						newContent: content,
						newName: finalNickname,
						email: finalEmail,
						filePath: filePath,
					},
				]);

			if (error) {
				console.error("글 등록 실패:", error);
				alert("글을 등록하는 데 실패했습니다.");
			} else {
				alert("신상품 후기가 성공적으로등록되었습니다!");
				$("#review-form")[0].reset();
				closeModal("write"); // 글쓰기 팝업닫기;
				loadReview();
			}
		} catch (e) {
			console.error("폼 제출 중 예상치 못한 오류가 발생 : ", e);
			alert("폼 제출 중 오류가 발생 하였습니다.");
		} finally {
			submitButton.prop("disabled", false).text("신상품 후기 등록하기");
		}
	});

	// 📌 삭제 함수 (모달 전용)
	async function deleteReview(reviewId) {
		if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
			return;
		}

		const deleteButton = $(
			`.modal_buttons .delete-btn[data-post-id="${reviewId}"]`
		);
		deleteButton.prop("disabled", true).text("삭제 중...");

		try {
			const { error } = await supabaseClient
				.from("NewProductReview")
				.delete()
				.eq("id", reviewId);

			if (error) {
				console.error("게시글 삭제 실패:", error);
				alert("게시글 삭제에 실패했습니다.");
				deleteButton.prop("disabled", false).text("삭제");
			} else {
				alert("게시글이 성공적으로 삭제되었습니다.");
				closeModal("edit"); // 모달 닫기
				loadReview(); // 목록 새로고침
			}
		} catch (e) {
			console.error("삭제 중 오류:", e);
			alert("삭제 중 오류가 발생했습니다.");
			deleteButton.prop("disabled", false).text("삭제");
		}
	}

	// 📌 수정: '수정' 버튼 클릭 시, 팝업을 생성하고 보여주는 이벤트
	$(document).on("click", ".edit-trigger", async function (event) {
		event.preventDefault();

		const reviewId = $(this).data("post-id");
		console.log("클릭된 게시글 ID:", reviewId);

		const { data: review, error } = await supabaseClient
			.from("NewProductReview")
			.select("*")
			.eq("id", reviewId)
			.single();

		if (error) {
			console.error("단일 게시글 조회 실패! Supabase 오류:", error);
			alert("게시글 정보를 불러오는 데 실패했습니다.");
			return;
		}

		const imageUrl = review.filePath || ".././common/images/noimg.jpg";

		// 📌 수정/삭제 버튼이 포함된 모달 HTML
		const reviewHtml = `
			     <ul>
                   <li> 
                    	<div class="review_img_edit">
                        	<img src="${imageUrl}" alt="${review.newTitle} 이미지">
                        	<p>※ 이미지 수정은 현재 지원되지 않습니다.</p>
                    	</div>
                        
						<form id="edit-form" data-post-id="${review.id}">
                            <dl>
                                <dt>
									<input type="text" id="edit-title"
										value="${review.newTitle}" required>
								</dt>
                                
								<dd>
									<strong>닉네임:</strong>
									<input type="text" id="edit-nickname"
								 		value="${review.newName}">
								</dd>
                                
								<dd>
									<textarea id="edit-content" required>${review.newContent}</textarea>
	   							</dd>
                            </dl>
                            
							<div class="modal_buttons">
                                <button type="submit" class="edit-btn">수정 완료</button>
								<button type="button" class="delete-btn" data-post-id="${review.id}">삭제</button>
                            </div>
                        </form>
                        
						<a href="#" class="close_pop">
							<i class="fa-solid fa-x"></i>
						</a>
                    </li>
                </ul>
            `;

		$modalContent.html(reviewHtml);
		openModal("edit"); // 📌 새로운 모달 열기 함수 사용
	});

	// 수정 폼 제출 이벤트
	$(document).on("submit", "#edit-form", async function (event) {
		event.preventDefault();

		// 수정 기능 임시 막기
		try {
			throw new Error("임시 삭제 방지");
		} catch (error) {
			console.error(error);
			alert("미안해요.. 비밀번호 기능이 구현될 때까지 잠시 막아두겠습니다.");
		}
	});

	// 	const reviewId = $(this).data("post-id");
	// 	const submitButton = $(this).find("button[type='submit']");
	// 	const deleteButton = $(this).find(".delete-btn");

	// 	// 📌 수정 중에는 모든 버튼 비활성화
	// 	submitButton.prop("disabled", true).text("수정 중...");
	// 	deleteButton.prop("disabled", true);

	// 	const updatedReview = {
	// 		newTitle: $("#edit-title").val(),
	// 		newContent: $("#edit-content").val(),
	// 		newName: $("#edit-nickname").val(),
	// 	};

	// 	try {
	// 		const { error } = await supabaseClient
	// 			.from("NewProductReview")
	// 			.update(updatedReview)
	// 			.eq("id", reviewId);

	// 		if (error) {
	// 			alert("게시글 수정에 실패했습니다.");
	// 			submitButton.prop("disabled", false).text("수정 완료");
	// 			deleteButton.prop("disabled", false);
	// 		} else {
	// 			alert("게시글이 성공적으로 수정되었습니다.");
	// 			closeModal("edit"); // 📌 새로운 모달 닫기 함수 사용
	// 			loadReview();
	// 		}
	// 	} catch (e) {
	// 		console.error("수정 중 오류:", e);
	// 		alert("수정 중 오류가 발생했습니다.");
	// 		submitButton.prop("disabled", false).text("수정 완료");
	// 		deleteButton.prop("disabled", false);
	// 	}
	// });

	// 📌 모달 내 삭제 버튼 클릭 이벤트
	// $(document).on("click", ".modal_buttons .delete-btn", function () {
	// 	const reviewId = $(this).data("post-id");
	// 	deleteReview(reviewId);
	// });

	//  비밀번호 만들지못해서 임시 삭제기능 막는 코드
	$(document).on("click", ".modal_buttons .delete-btn", function (e) {
		e.preventDefault();
		try {
			throw new Error("임시 삭제 방지");
		} catch (error) {
			console.error(error);
			alert("미안해요.. 비밀번호 기능이 구현될 때까지 잠시 막아두겠습니다.");
		}
	});

	// 📌 모달 닫기 이벤트들
	// X 버튼 클릭
	$(document).on("click", ".close_pop", function (e) {
		e.preventDefault();
		if ($(this).closest(".edit_modal_box").length) {
			closeModal("edit");
		} else if ($(this).closest(".write_modal_box").length) {
			closeModal("write");
		}
	});

	// 배경 클릭 시 모달 닫기
	$(document).on("click", ".edit_modal_box, .write_modal_box", function (e) {
		if (e.target === this) {
			if ($(this).hasClass("edit_modal_box")) {
				closeModal("edit");
			} else if ($(this).hasClass("write_modal_box")) {
				closeModal("write");
			}
		}
	});

	// ESC 키로 모달 닫기
	$(document).on("keydown", function (e) {
		if (e.key === "Escape") {
			if ($(".edit_modal_box").hasClass("show")) {
				closeModal("edit");
			}
			if ($(".write_modal_box").hasClass("show")) {
				closeModal("write");
			}
		}
	});

	// '꿀조합 등록하기' 버튼 클릭 이벤트
	$("#open_write_modal").on("click", function (e) {
		e.preventDefault();
		openModal("write"); // '글쓰기' 팝업열기
	});

	// 페이지 로드 시 글 목록 불러오기
	loadReview();
});
