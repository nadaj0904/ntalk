/**
 * c:\Dev_ntalk_project\ntalk\src\main\resources\static\js\channelSend.js
 * 카카오 브랜드 메시지 (자유형) 실시간 제어 및 발송 JS
 */

$(document).ready(function() {
    
    // 글로벌 카운터
    let buttonCount = 0;
    const MAX_BUTTONS = 5;

    // ==========================================
    // 1. 실시간 시뮬레이터 연동 (입력값 변경 이벤트)
    // ==========================================

    // [1] 메시지 본문
    $("#sndMsg").on("input", function() {
        const text = $(this).val();
        
        // 글자 수 세기 및 제한
        $("#msg-char-count").text(text.length);
        if (text.length > 1300) {
            alert("메시지는 최대 1300자까지 작성할 수 있습니다.");
            $(this).val(text.substring(0, 1300));
            $("#msg-char-count").text(1300);
        }

        // 시뮬레이터 본문 업데이트 (줄바꿈 반영)
        if (text.trim() === "") {
            $("#sim-text").text("이곳에 메시지 내용을 작성하시면 실시간으로 반영됩니다.");
        } else {
            $("#sim-text").text(text);
        }
    });

    // [2] 메시지 타입 변경
    $("#msgType").on("change", function() {
        const type = $(this).val();
        const $phoneFrame = $(".phone-frame");
        const $imgUrlGroup = $("#image-url-group");
        const $imgLinkGroup = $("#image-link-group");
        const $simImageWrap = $("#sim-image-wrap");

        // 초기화
        $phoneFrame.removeClass("image-mode wide-mode");
        $imgUrlGroup.hide();
        $imgLinkGroup.hide();
        $simImageWrap.hide();

        $("#imgUrl").prop("required", false);

        if (type === "BI") {
            // 이미지형 (BI)
            $phoneFrame.addClass("image-mode");
            $imgUrlGroup.show();
            $imgLinkGroup.show();
            $("#imgUrl").prop("required", true);
            
            // 시뮬레이터에 이미지 노출
            const imgUrl = $("#imgUrl").val();
            if (imgUrl) {
                $("#sim-image").attr("src", imgUrl);
                $simImageWrap.show();
            }
        } else if (type === "BW") {
            // 와이드 이미지형 (BW)
            $phoneFrame.addClass("wide-mode");
            $imgUrlGroup.show();
            $imgLinkGroup.show();
            $("#imgUrl").prop("required", true);
            
            // 시뮬레이터에 이미지 노출
            const imgUrl = $("#imgUrl").val();
            if (imgUrl) {
                $("#sim-image").attr("src", imgUrl);
                $simImageWrap.show();
            }
        }
        
        // 버튼 개수 제한 조건 검증 (와이드형은 권장 2개 등)
        updateSimulatorButtons();
    });

    // [3] 이미지 URL 입력 시 미리보기 반영
    $("#imgUrl").on("input", function() {
        const url = $(this).val().trim();
        const type = $("#msgType").val();
        
        if ((type === "BI" || type === "BW") && url !== "") {
            $("#sim-image").attr("src", url).on("load", function() {
                $("#sim-image-wrap").show();
            }).on("error", function() {
                $("#sim-image-wrap").hide(); // 잘못된 이미지 주소인 경우 숨김
            });
        } else {
            $("#sim-image-wrap").hide();
        }
    });

    // ==========================================
    // 2. 동적 링크 버튼 빌더 구현
    // ==========================================

    // 버튼 추가 클릭
    $("#btn-add-button").on("click", function() {
        if (buttonCount >= MAX_BUTTONS) {
            alert(`링크 버튼은 최대 ${MAX_BUTTONS}개까지 추가할 수 있습니다.`);
            return;
        }

        buttonCount++;
        $("#empty-buttons-state").hide();

        const btnId = `btn-row-${buttonCount}`;
        const buttonHtml = `
            <div class="dynamic-item-row" id="${btnId}">
                <div class="form-group" style="flex: 1.2;">
                    <label>버튼 명칭 <span class="required">*</span></label>
                    <input type="text" class="btn-name" placeholder="예: 홈페이지 이동" max-length="14" required>
                </div>
                <div class="form-group" style="flex: 1;">
                    <label>버튼 타입</label>
                    <select class="btn-type">
                        <option value="WL" selected>웹 링크 (WL)</option>
                        <option value="AL">앱 링크 (AL)</option>
                    </select>
                </div>
                <div class="form-group" style="flex: 2;">
                    <label>모바일 링크 주소 <span class="required">*</span></label>
                    <input type="url" class="btn-url-mobile" placeholder="https://..." required>
                </div>
                <div class="form-group" style="flex: 2;">
                    <label>PC 링크 주소</label>
                    <input type="url" class="btn-url-pc" placeholder="https://... (옵션)">
                </div>
                <button type="button" class="btn-remove-item" onclick="removeButtonRow('${btnId}')">
                    <i class="ph ph-trash"></i>
                </button>
            </div>
        `;

        $("#buttons-container").append(buttonHtml);
        
        // 동적 추가된 필드에 이벤트 바인딩
        $(`#${btnId} input, #${btnId} select`).on("input change", function() {
            updateSimulatorButtons();
        });

        updateSimulatorButtons();
    });

    // 버튼 삭제 글로벌 처리
    window.removeButtonRow = function(rowId) {
        $(`#${rowId}`).remove();
        buttonCount--;
        
        if (buttonCount === 0) {
            $("#empty-buttons-state").show();
        }
        
        updateSimulatorButtons();
    };

    // 버튼 입력값 모아 시뮬레이터 화면 업데이트
    function updateSimulatorButtons() {
        const $simWrap = $("#sim-buttons-wrap");
        $simWrap.empty().hide();

        const buttons = getButtonsData();
        if (buttons.length > 0) {
            buttons.forEach(btn => {
                const name = btn.name || "버튼명";
                $simWrap.append(`<a href="#" class="sim-btn" onclick="return false;">${name}</a>`);
            });
            $simWrap.show();
        }
    }

    // 작성한 버튼 리스트 수집 함수
    function getButtonsData() {
        const buttons = [];
        $(".dynamic-item-row").each(function() {
            const name = $(this).find(".btn-name").val().trim();
            const type = $(this).find(".btn-type").val();
            const urlMobile = $(this).find(".btn-url-mobile").val().trim();
            const urlPc = $(this).find(".btn-url-pc").val().trim();

            if (name !== "") {
                const btnObj = {
                    name: name,
                    type: type,
                    url_mobile: urlMobile
                };
                if (urlPc !== "") {
                    btnObj.url_pc = urlPc;
                }
                buttons.push(btnObj);
            }
        });
        return buttons;
    }

    // ==========================================
    // 3. 쿠폰 첨부 기능 활성화
    // ==========================================
    $("#use-coupon").on("change", function() {
        const isChecked = $(this).is(":checked");
        const $couponFields = $("#coupon-fields-container");
        const $simCoupon = $("#sim-coupon-wrap");

        if (isChecked) {
            $couponFields.slideDown(200);
            $("#couponTitle").prop("required", true);
            $("#couponDesc").prop("required", true);
            $("#couponUrl").prop("required", true);
            
            // 시뮬레이터에 노출
            updateSimulatorCoupon();
            $simCoupon.show();
        } else {
            $couponFields.slideUp(200);
            $("#couponTitle").prop("required", false);
            $("#couponDesc").prop("required", false);
            $("#couponUrl").prop("required", false);
            
            $simCoupon.hide();
        }
    });

    // 쿠폰 입력 내용 실시간 동기화
    $("#couponTitle, #couponDesc").on("input", function() {
        updateSimulatorCoupon();
    });

    function updateSimulatorCoupon() {
        const title = $("#couponTitle").val().trim() || "쿠폰 명칭";
        const desc = $("#couponDesc").val().trim() || "쿠폰 상세 설명";

        $("#sim-coupon-title").text(title);
        $("#sim-coupon-desc").text(desc);
    }

    // ==========================================
    // 4. 최종 데이터 발송 처리
    // ==========================================
    $("#btn-submit-send").on("click", function() {
        const $form = $("#brand-send-form");

        // 1. 유효성 검증
        if (!$form[0].checkValidity()) {
            $form[0].reportValidity();
            return;
        }

        // 수신번호 포맷 가공 (대시 제거)
        const rawPhone = $("#phoneNum").val().trim();
        const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
        if (cleanPhone === "") {
            alert("올바른 수신 번호를 입력해 주세요.");
            $("#phoneNum").focus();
            return;
        }

        // 2. ATTACHMENT JSON 구성
        const msgType = $("#msgType").val();
        const imgUrl = $("#imgUrl").val().trim();
        const imgLink = $("#imgLink").val().trim();
        
        let attachmentObj = {};

        // [이미지 포함 시]
        if ((msgType === "BI" || msgType === "BW") && imgUrl !== "") {
            attachmentObj.image = {
                img_url: imgUrl
            };
            if (imgLink !== "") {
                attachmentObj.image.img_link = imgLink;
            }
        }

        // [버튼 포함 시]
        const buttons = getButtonsData();
        if (buttons.length > 0) {
            attachmentObj.button = buttons;
        }

        // [쿠폰 포함 시]
        const useCoupon = $("#use-coupon").is(":checked");
        if (useCoupon) {
            const cTitle = $("#couponTitle").val().trim();
            const cDesc = $("#couponDesc").val().trim();
            const cUrl = $("#couponUrl").val().trim();

            attachmentObj.coupon = {
                title: cTitle,
                description: cDesc,
                url_mobile: cUrl
            };
        }

        // 3. 서버 전송용 DTO 구성
        const sendData = {
            phoneNum: cleanPhone,
            senderKey: $("#senderKey").val().trim(),
            targetType: $("#targetType").val(),
            msgType: msgType,
            sndMsg: $("#sndMsg").val().trim(),
            attachment: Object.keys(attachmentObj).length > 0 ? JSON.stringify(attachmentObj) : null
        };

        // 4. AJAX 발송 요청
        if (confirm(`${cleanPhone} 번호로 브랜드 메시지를 발송하시겠습니까?`)) {
            sendAjax("/api/v1/channel/send", "POST", sendData, function(response) {
                alert(response.message || "발송 큐에 정상 적재되었습니다!");
                location.href = "/index"; // 완료 시 대시보드로 이동
            }, function(errorMessage) {
                alert("발송 실패: " + errorMessage);
            });
        }
    });
});
