$(function () {
    // 약관 동의 섹션 토글 기능
    // dt를 클릭했을 때, 바로 뒤에 오는 dd를 슬라이드 토글
    $('.terms_section dt').on('click', function () {
        // 현재 클릭된 dt
        const $currentDt = $(this);
        // 현재 클릭된 dt의 바로 다음 dd
        const $currentDd = $currentDt.next('dd');
 
        // 클릭된 것을 제외한 모든 dd는 닫기
        $('.terms_section dd').not($currentDd).slideUp();
        // 클릭된 것을 제외한 모든 dt에서 active 클래스 제거
        $('.terms_section dt').not($currentDt).removeClass('active');

        // 현재 클릭된 dd를 토글하고, dt에 active 클래스 토글
        $currentDd.slideToggle();
        $currentDt.toggleClass('active');
    });

    // 전체 동의 기능
    $('#checkAll').on('change', function () {
        // 'agree'라는 name을 가진 모든 체크박스의 상태를 '전체 동의' 체크박스 상태와 동기화
        $('input[name="agree"]').prop('checked', $(this).prop('checked'));
    });

    // 개별 체크박스 상태 확인
    $('input[name="agree"]').on('change', function () {
        const $agreeCheckboxes = $('input[name="agree"]');
        const totalCount = $agreeCheckboxes.length;
        const checkedCount = $agreeCheckboxes.filter(':checked').length;

        // 모든 개별 체크박스가 선택되었다면 '전체 동의'도 체크, 아니면 해제
        $('#checkAll').prop('checked', totalCount === checkedCount);
    });

    // 폼 제출 시 필수 약관 동의 확인
    $('form').on('submit', function (e) {
        // 필수 체크박스 ID 목록
        const requiredIds = ['#check01', '#check02', '#check03', '#check04'];
        let allRequiredChecked = true;

        // 필수 체크박스들이 모두 체크되었는지 확인
        $(requiredIds.join(', ')).each(function () {
            if (!$(this).is(':checked')) {
                allRequiredChecked = false;
                return false; // .each() 루프 중단
            }
        });

        if (!allRequiredChecked) {
            e.preventDefault(); // 폼 제출 막기
            alert('필수 약관에 모두 동의해주세요.');
        }
    });

    // 비밀번호 확인 체크
    $('#memberPass2').on('blur', function () {
        const pass1 = $('#memberPass').val();
        const pass2 = $(this).val();

        if (pass1 && pass2 && pass1 !== pass2) {
            $(this).css('border-color', '#d92629');
            alert('비밀번호가 일치하지 않습니다.');
        } else if (pass1 === pass2 && pass1 !== '') {
            $(this).css('border-color', '#017121');
        } else {
            // 일치하거나, 값이 없으면 원래 테두리로 복원
            $(this).css('border-color', ''); 
        }
    });
});
