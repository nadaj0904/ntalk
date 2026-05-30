/**
 * 비밀번호 찾기 페이지 전용 스크립트 (Vanilla JS)
 * ntalk_ajax 통신 표준 준수: 공통 sendAjax() 함수 사용
 */

/**
 * 이메일 형식 검증
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

/**
 * 휴대폰 번호 형식 검증 (10~11자리 숫자)
 * @param {string} mobile
 * @returns {boolean}
 */
function validateMobile(mobile) {
    return /^[0-9]{10,11}$/.test(mobile);
}

/**
 * 특정 폼 그룹에 에러 상태를 표시
 * @param {string} groupId - form-group 요소의 ID
 * @param {string} inputId - input 요소의 ID
 * @param {boolean} isError
 */
function setFieldError(groupId, inputId, isError) {
    const group = document.getElementById(groupId);
    const input = document.getElementById(inputId);
    if (!group || !input) return;

    if (isError) {
        group.classList.add('error');
        input.classList.add('has-error');
    } else {
        group.classList.remove('error');
        input.classList.remove('has-error');
    }
}

/**
 * 폼 제출 핸들러 - Front-End 유효성 검사 + AJAX 전송
 * @param {Event} event
 * @returns {boolean} false (폼 기본 제출 차단)
 */
function handleForgotPassword(event) {
    event.preventDefault();

    const emailInput  = document.getElementById('userEmail');
    const mobileInput = document.getElementById('userMobile');

    const email  = emailInput  ? emailInput.value.trim()  : '';
    const mobile = mobileInput ? mobileInput.value.trim() : '';

    let isValid = true;

    // ── 이메일 검증 ──────────────────────────────────
    if (!email || !validateEmail(email)) {
        setFieldError('emailGroup', 'userEmail', true);
        isValid = false;
    } else {
        setFieldError('emailGroup', 'userEmail', false);
    }

    // ── 휴대폰 번호 검증 ──────────────────────────────
    if (!mobile || !validateMobile(mobile)) {
        setFieldError('mobileGroup', 'userMobile', true);
        isValid = false;
    } else {
        setFieldError('mobileGroup', 'userMobile', false);
    }

    if (!isValid) {
        return false;
    }

    // ── 버튼 비활성화 (중복 제출 방지) ─────────────────
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 발송 중...';
    }

    // ── AJAX 전송 ─────────────────────────────────────
    const requestData = { email: email, mobile: mobile };

    sendAjax(
        '/api/login/reset-password',
        'POST',
        requestData,
        // ✅ 성공 콜백
        function(response) {
            showSuccessPanel();
        },
        // ❌ 실패 콜백 (서버 비즈니스 에러)
        function(errorMessage) {
            // 버튼 복원
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> 임시 비밀번호 발송';
            }
            alert('오류: ' + errorMessage);
        }
    );

    return false;
}

/**
 * 성공 패널 표시 (폼 숨김 + 성공 UI 슬라이드 인)
 */
function showSuccessPanel() {
    const form         = document.getElementById('forgotPasswordForm');
    const infoBox      = document.querySelector('.info-box');
    const successPanel = document.getElementById('successPanel');

    // 폼 및 안내 박스 숨김
    if (form)    form.style.display    = 'none';
    if (infoBox) infoBox.style.display = 'none';

    // 성공 패널 표시
    if (successPanel) {
        successPanel.style.display = 'block';
        // 애니메이션이 올바르게 재생되도록 display 후 class 적용
        requestAnimationFrame(function() {
            successPanel.style.opacity = '1';
        });
    }
}

// ── 실시간 유효성 피드백 (입력 중 에러 해제) ──────────────
document.addEventListener('DOMContentLoaded', function() {
    const emailInput  = document.getElementById('userEmail');
    const mobileInput = document.getElementById('userMobile');

    if (emailInput) {
        emailInput.addEventListener('input', function() {
            if (validateEmail(this.value.trim())) {
                setFieldError('emailGroup', 'userEmail', false);
            }
        });
    }

    if (mobileInput) {
        mobileInput.addEventListener('input', function() {
            if (validateMobile(this.value.trim())) {
                setFieldError('mobileGroup', 'userMobile', false);
            }
        });
    }
});
