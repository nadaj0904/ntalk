/**
 * 로그인 페이지 전용 스크립트 (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', function() {
    // 저장된 아이디 불러오기 (Local Storage 활용 예시)
    const savedId = localStorage.getItem('gems_admin_saved_id');
    if (savedId) {
        document.getElementById('adminId').value = savedId;
        document.getElementById('saveId').checked = true;
    }
});

/**
 * 비밀번호 표시/숨김 토글
 */
function togglePasswordVisiblity() {
    const pwInput = document.getElementById('adminPw');
    const icon = document.getElementById('togglePwIcon');

    if (pwInput.type === 'password') {
        pwInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
        icon.title = '비밀번호 숨기기';
    } else {
        pwInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        icon.title = '비밀번호 보기';
    }
}

/**
 * 이메일 포맷 검증 정규식
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

/**
 * 폼 제출 시 예외 처리 (Front-end Validation)
 */
function handleLogin(event) {
    let isValid = true;
    
    const idInput = document.getElementById('adminId');
    const pwInput = document.getElementById('adminPw');
    const idGroup = document.getElementById('idGroup');
    const pwGroup = document.getElementById('pwGroup');

    // 초기화
    idGroup.classList.remove('error');
    pwGroup.classList.remove('error');
    idInput.classList.remove('has-error');
    pwInput.classList.remove('has-error');

    // ID Validation (이메일 형태)
    if (!idInput.value || !validateEmail(idInput.value.trim())) {
        idGroup.classList.add('error');
        idInput.classList.add('has-error');
        isValid = false;
    }

    // Password Validation (빈값 체크)
    if (!pwInput.value) {
        pwGroup.classList.add('error');
        pwInput.classList.add('has-error');
        isValid = false;
    }

    if (!isValid) {
        // 폼 전송 차단
        event.preventDefault();
        return false;
    }

    // 아이디 저장 로직 처리
    const saveIdCheckbox = document.getElementById('saveId');
    if (saveIdCheckbox.checked) {
        localStorage.setItem('gems_admin_saved_id', idInput.value.trim());
    } else {
        localStorage.removeItem('gems_admin_saved_id');
    }

    // 실제 백엔드로 AJAX 전송 (공통 모듈 sendAjax 사용)
    const requestData = {
        adminId: idInput.value.trim(),
        adminPw: pwInput.value
    };

    sendAjax('/api/login', 'POST', requestData, function(response) {
        // 성공 시 콜백 (리다이렉트 URL 수신)
        window.location.href = response.data; // 서버에서 "/index"를 넘겨줌
    });

    // 폼 전송(새로고침) 차단 (AJAX 처리됨)
    event.preventDefault();
    return false;
}
