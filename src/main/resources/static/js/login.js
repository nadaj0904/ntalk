/**
 * 로그인 페이지 전용 스크립트 (Vanilla JS)
 * — 로그인 폼, 비밀번호 찾기 모달, 계정 생성 문의 모달 포함
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

/* ================================================================
   모달 공통 유틸
   ================================================================ */

function openModal(name) {
    const overlay = document.getElementById('modal-' + name);
    if (!overlay) return;
    overlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
}

function closeModal(name) {
    const overlay = document.getElementById('modal-' + name);
    if (!overlay) return;
    overlay.classList.remove('is-active');
    document.body.style.overflow = '';
}

function handleOverlayClick(event, name) {
    if (event.target === event.currentTarget) {
        closeModal(name);
    }
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal('forgot-password');
        closeModal('register-inquiry');
    }
});

function setModalFieldError(groupId, inputId, isError) {
    const group = document.getElementById(groupId);
    const input = document.getElementById(inputId);
    if (!group || !input) return;
    group.classList.toggle('error', isError);
    input.classList.toggle('has-error', isError);
}

/* ================================================================
   비밀번호 찾기 모달
   ================================================================ */

function handleForgotPassword(event) {
    event.preventDefault();

    const emailVal  = (document.getElementById('fp-email')?.value  || '').trim();
    const mobileVal = (document.getElementById('fp-mobile')?.value || '').trim();

    let isValid = true;

    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        setModalFieldError('fp-emailGroup',  'fp-email',  true);
        isValid = false;
    } else {
        setModalFieldError('fp-emailGroup',  'fp-email',  false);
    }

    if (!mobileVal || !/^[0-9]{10,11}$/.test(mobileVal)) {
        setModalFieldError('fp-mobileGroup', 'fp-mobile', true);
        isValid = false;
    } else {
        setModalFieldError('fp-mobileGroup', 'fp-mobile', false);
    }

    if (!isValid) return false;

    const btn = document.getElementById('fp-submitBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 발송 중...'; }

    sendAjax(
        '/api/login/reset-password', 'POST',
        { email: emailVal, mobile: mobileVal },
        function() {
            document.getElementById('fpForm').style.display        = 'none';
            document.getElementById('fp-info-box').style.display   = 'none';
            document.getElementById('fp-success').style.display    = 'block';
        },
        function(msg) {
            if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> 임시 비밀번호 발송'; }
            alert('오류: ' + msg);
        }
    );

    return false;
}

/* ================================================================
   계정 생성 문의 모달
   ================================================================ */

function handleRegisterInquiry(event) {
    event.preventDefault();

    const nameVal  = (document.getElementById('ri-name')?.value         || '').trim();
    const emailVal = (document.getElementById('ri-email')?.value        || '').trim();
    const mobileVal= (document.getElementById('ri-mobile')?.value       || '').trim();
    const orgVal   = (document.getElementById('ri-organization')?.value || '').trim();
    const msgVal   = (document.getElementById('ri-message')?.value      || '').trim();

    let isValid = true;

    if (!nameVal) {
        setModalFieldError('ri-nameGroup',   'ri-name',   true);
        isValid = false;
    } else {
        setModalFieldError('ri-nameGroup',   'ri-name',   false);
    }

    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        setModalFieldError('ri-emailGroup',  'ri-email',  true);
        isValid = false;
    } else {
        setModalFieldError('ri-emailGroup',  'ri-email',  false);
    }

    if (!mobileVal || !/^[0-9]{10,11}$/.test(mobileVal)) {
        setModalFieldError('ri-mobileGroup', 'ri-mobile', true);
        isValid = false;
    } else {
        setModalFieldError('ri-mobileGroup', 'ri-mobile', false);
    }

    if (!isValid) return false;

    const btn = document.getElementById('ri-submitBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 접수 중...'; }

    sendAjax(
        '/api/login/register-inquiry', 'POST',
        { name: nameVal, email: emailVal, mobile: mobileVal, organization: orgVal, message: msgVal },
        function() {
            document.getElementById('riForm').style.display       = 'none';
            document.getElementById('ri-info-box').style.display  = 'none';
            document.getElementById('ri-success').style.display   = 'block';
        },
        function(msg) {
            if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> 계정 생성 문의 접수'; }
            alert('오류: ' + msg);
        }
    );

    return false;
}

// 계정 생성 문의 — 문자 수 카운터
document.addEventListener('DOMContentLoaded', function() {
    const msg = document.getElementById('ri-message');
    const cnt = document.getElementById('ri-msgCount');
    if (msg && cnt) {
        msg.addEventListener('input', function() { cnt.textContent = this.value.length; });
    }

    // 실시간 에러 해제
    const fpEmail  = document.getElementById('fp-email');
    const fpMobile = document.getElementById('fp-mobile');
    const riName   = document.getElementById('ri-name');
    const riEmail  = document.getElementById('ri-email');
    const riMobile = document.getElementById('ri-mobile');

    if (fpEmail)  fpEmail.addEventListener('input',  function() { if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value.trim()))  setModalFieldError('fp-emailGroup',  'fp-email',  false); });
    if (fpMobile) fpMobile.addEventListener('input', function() { if (/^[0-9]{10,11}$/.test(this.value.trim()))               setModalFieldError('fp-mobileGroup', 'fp-mobile', false); });
    if (riName)   riName.addEventListener('input',   function() { if (this.value.trim())                                       setModalFieldError('ri-nameGroup',   'ri-name',   false); });
    if (riEmail)  riEmail.addEventListener('input',  function() { if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value.trim()))  setModalFieldError('ri-emailGroup',  'ri-email',  false); });
    if (riMobile) riMobile.addEventListener('input', function() { if (/^[0-9]{10,11}$/.test(this.value.trim()))               setModalFieldError('ri-mobileGroup', 'ri-mobile', false); });
});
