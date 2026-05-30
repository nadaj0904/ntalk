/**
 * 계정 생성 문의 페이지 스크립트
 * ntalk_ajax 통신 표준 준수: 공통 sendAjax() 사용
 */

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}

function validateMobile(mobile) {
    return /^[0-9]{10,11}$/.test(mobile);
}

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

function handleRegisterInquiry(event) {
    event.preventDefault();

    const nameVal  = (document.getElementById('userName')?.value   || '').trim();
    const emailVal = (document.getElementById('userEmail')?.value   || '').trim();
    const mobileVal= (document.getElementById('userMobile')?.value  || '').trim();
    const orgVal   = (document.getElementById('userOrganization')?.value || '').trim();
    const msgVal   = (document.getElementById('userMessage')?.value  || '').trim();

    let isValid = true;

    if (!nameVal) {
        setFieldError('nameGroup', 'userName', true);
        isValid = false;
    } else {
        setFieldError('nameGroup', 'userName', false);
    }

    if (!emailVal || !validateEmail(emailVal)) {
        setFieldError('emailGroup', 'userEmail', true);
        isValid = false;
    } else {
        setFieldError('emailGroup', 'userEmail', false);
    }

    if (!mobileVal || !validateMobile(mobileVal)) {
        setFieldError('mobileGroup', 'userMobile', true);
        isValid = false;
    } else {
        setFieldError('mobileGroup', 'userMobile', false);
    }

    if (!isValid) return false;

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 접수 중...';
    }

    sendAjax(
        '/api/login/register-inquiry',
        'POST',
        { name: nameVal, email: emailVal, mobile: mobileVal, organization: orgVal, message: msgVal },
        function() {
            showSuccessPanel();
        },
        function(errorMessage) {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> 계정 생성 문의 접수';
            }
            alert('오류: ' + errorMessage);
        }
    );

    return false;
}

function showSuccessPanel() {
    const form         = document.getElementById('registerInquiryForm');
    const infoBox      = document.querySelector('.info-box');
    const successPanel = document.getElementById('successPanel');

    if (form)    form.style.display    = 'none';
    if (infoBox) infoBox.style.display = 'none';

    if (successPanel) {
        successPanel.style.display = 'block';
        requestAnimationFrame(function() { successPanel.style.opacity = '1'; });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const emailInput  = document.getElementById('userEmail');
    const mobileInput = document.getElementById('userMobile');
    const nameInput   = document.getElementById('userName');
    const msgTextarea = document.getElementById('userMessage');
    const msgCount    = document.getElementById('msgCount');

    if (nameInput) {
        nameInput.addEventListener('input', function() {
            if (this.value.trim()) setFieldError('nameGroup', 'userName', false);
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', function() {
            if (validateEmail(this.value.trim())) setFieldError('emailGroup', 'userEmail', false);
        });
    }

    if (mobileInput) {
        mobileInput.addEventListener('input', function() {
            if (validateMobile(this.value.trim())) setFieldError('mobileGroup', 'userMobile', false);
        });
    }

    if (msgTextarea && msgCount) {
        msgTextarea.addEventListener('input', function() {
            msgCount.textContent = this.value.length;
        });
    }
});
