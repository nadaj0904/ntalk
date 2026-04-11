/**
 * ntalk 공통 AJAX 모듈
 */

// CSRF 토큰 전역 설정 (jQuery)
$(function() {
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    
    // 만약 보안 토큰이 메타 태그에 있다면 모든 AJAX 요청에 자동 포함
    if (token && header) {
        $(document).ajaxSend(function(e, xhr, options) {
            xhr.setRequestHeader(header, token);
        });
    }
});

// 공통 로딩 UI 표시
function showLoading() {
    if ($("#loading-overlay").length === 0) {
        $("body").append(`
            <div id="loading-overlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; justify-content: center; align-items: center; cursor: not-allowed;">
                <div style="background: white; padding: 20px; border-radius: 8px; font-weight: bold; color: #333;">
                    <i class="fa-solid fa-spinner fa-spin"></i> 로딩 중...
                </div>
            </div>
        `);
    } else {
        $("#loading-overlay").fadeIn(100);
    }
}

// 공통 로딩 UI 숨김
function hideLoading() {
    $("#loading-overlay").fadeOut(100);
}

/**
 * 공통 AJAX 전송 함수
 * @param {string} url - API URL
 * @param {string} method - GET, POST, PUT, DELETE 등
 * @param {object} data - 전송할 JSON 데이터
 * @param {function} successCallback - 성공 시 콜백 (data.success === true 일 때 실행)
 * @param {function} errorCallback - 에러 혹은 검증 실패 시 커스텀 콜백 (생략 시 기본 alert 처리)
 */
function sendAjax(url, method, data, successCallback, errorCallback) {
    showLoading();
    
    $.ajax({
        url: url,
        type: method,
        contentType: "application/json; charset=utf-8",
        data: data ? JSON.stringify(data) : null,
        dataType: "json",
        success: function(response) {
            hideLoading();
            if (response.success) {
                if (typeof successCallback === "function") {
                    successCallback(response);
                }
            } else {
                // 비즈니스 로직 에러
                if (typeof errorCallback === "function") {
                    errorCallback(response.message);
                } else {
                    alert("처리 실패: " + response.message);
                }
            }
        },
        error: function(xhr, status, error) {
            hideLoading();
            // Spring Validation (@Valid) 실패 등으로 넘어온 400 에러 처리
            if (xhr.status === 400 && xhr.responseJSON) {
                let errorMsg = xhr.responseJSON.message || "입력값이 올바르지 않습니다.";
                // 추가 필드 에러 데이터가 있다면 상세를 붙여줌
                if (xhr.responseJSON.data && typeof xhr.responseJSON.data === 'object') {
                    let details = Object.values(xhr.responseJSON.data).join("\n");
                    errorMsg += "\n" + details;
                }
                alert(errorMsg);
            } else {
                alert("서버와 통신 중 오류가 발생했습니다. (상태 코드: " + xhr.status + ")");
            }
        }
    });
}
