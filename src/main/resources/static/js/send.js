/**
 * send.js - 바로 발송 위자드 로직
 * Step 1: 설계사/고객 선택
 * Step 2: 메시지 편집 + 카톡 시뮬레이터
 * Step 3: 최종 검수 + 발송
 */
$(function () {
    // ================================================
    // 전역 상태
    // ================================================
    let currentStep = 1;
    const totalSteps = 3;

    let allPlanners = [];            // 전체 설계사 목록
    let selectedPlannerIds = [];     // 선택된 설계사 ID 배열
    let customerList = [];           // 현재 로드된 고객 목록
    let templateList = [];           // 템플릿 목록

    // ================================================
    // 초기화
    // ================================================
    loadPlanners();

    // ================================================
    // 위자드 네비게이션
    // ================================================
    $('#btn-wizard-next').on('click', function () {
        if (currentStep === 1 && selectedPlannerIds.length === 0) {
            alert('설계사를 1명 이상 선택해주세요.');
            return;
        }
        if (currentStep === 1 && customerList.length === 0) {
            alert('발송 대상 고객이 없습니다.');
            return;
        }
        if (currentStep === 2) {
            var msg = $('#message-text').val().trim();
            if (!msg) {
                alert('메시지를 입력해주세요.');
                return;
            }
        }

        if (currentStep < totalSteps) {
            goToStep(currentStep + 1);
        }
    });

    $('#btn-wizard-prev').on('click', function () {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        }
    });

    function goToStep(step) {
        // 이전 스텝 done 처리
        if (step > currentStep) {
            for (var i = 1; i < step; i++) {
                $('[data-step="' + i + '"]').removeClass('active').addClass('done');
                if (i < totalSteps) $('#conn-' + i + '-' + (i + 1)).addClass('done');
            }
        } else {
            for (var i = step + 1; i <= totalSteps; i++) {
                $('[data-step="' + i + '"]').removeClass('active done');
                if (i > 1) $('#conn-' + (i - 1) + '-' + i).removeClass('done');
            }
        }

        $('[data-step="' + step + '"]').removeClass('done').addClass('active');
        currentStep = step;

        // 패널 전환
        $('.wizard-panel').removeClass('active');
        $('#panel-' + step).addClass('active');

        // 버튼 상태
        $('#btn-wizard-prev').css('visibility', step === 1 ? 'hidden' : 'visible');
        if (step === totalSteps) {
            $('#btn-wizard-next').hide();
        } else {
            $('#btn-wizard-next').show();
        }

        // Step 3 진입 시 프리뷰 갱신
        if (step === 3) {
            renderReviewPreview();
        }
    }

    // ================================================
    // Step 1: 설계사 로드 및 멀티셀렉트
    // ================================================
    function loadPlanners() {
        $.ajax({
            url: '/api/v1/send/planners',
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.success) {
                    allPlanners = res.data;
                    renderPlannerDropdown(allPlanners);
                }
            }
        });
    }

    function renderPlannerDropdown(list) {
        var html = '';
        list.forEach(function (p) {
            var isSelected = selectedPlannerIds.indexOf(p.plannerId) !== -1;
            html += '<div class="planner-option' + (isSelected ? ' selected' : '') + '" data-id="' + p.plannerId + '">'
                + '<div class="planner-check"><i class="ph-bold ph-check"></i></div>'
                + '<span>' + p.plannerName + (p.plannerCode ? ' (' + p.plannerCode + ')' : '') + '</span>'
                + '</div>';
        });
        $('#planner-dropdown').html(html);
    }

    // 설계사 검색
    $('#planner-search').on('input', function () {
        var keyword = $(this).val().toLowerCase();
        var filtered = allPlanners.filter(function (p) {
            return (p.plannerName && p.plannerName.toLowerCase().indexOf(keyword) !== -1)
                || (p.plannerCode && p.plannerCode.toLowerCase().indexOf(keyword) !== -1);
        });
        renderPlannerDropdown(filtered);
    });

    // 설계사 클릭 선택/해제
    $(document).on('click', '.planner-option', function () {
        var id = parseInt($(this).data('id'));
        var idx = selectedPlannerIds.indexOf(id);
        if (idx === -1) {
            selectedPlannerIds.push(id);
        } else {
            selectedPlannerIds.splice(idx, 1);
        }
        syncPlannerUI();
        loadCustomers();
    });

    // 전체 선택 토글
    $('#toggle-all-planners').on('change', function () {
        if ($(this).is(':checked')) {
            selectedPlannerIds = allPlanners.map(function (p) { return p.plannerId; });
        } else {
            selectedPlannerIds = [];
        }
        syncPlannerUI();
        loadCustomers();
    });

    // 태그 제거
    $(document).on('click', '.remove-tag', function () {
        var id = parseInt($(this).data('id'));
        selectedPlannerIds = selectedPlannerIds.filter(function (v) { return v !== id; });
        syncPlannerUI();
        loadCustomers();
    });

    function syncPlannerUI() {
        // 태그 렌더링
        var tagsHtml = '';
        selectedPlannerIds.forEach(function (id) {
            var p = allPlanners.find(function (x) { return x.plannerId === id; });
            if (p) {
                tagsHtml += '<span class="tag-chip">'
                    + p.plannerName
                    + '<span class="remove-tag" data-id="' + id + '">&times;</span>'
                    + '</span>';
            }
        });
        $('#selected-planner-tags').html(tagsHtml);

        // 드롭다운 선택 상태 동기화
        $('#planner-dropdown .planner-option').each(function () {
            var id = parseInt($(this).data('id'));
            $(this).toggleClass('selected', selectedPlannerIds.indexOf(id) !== -1);
        });

        // 전체 토글 동기화
        $('#toggle-all-planners').prop('checked', allPlanners.length > 0 && selectedPlannerIds.length === allPlanners.length);

        // 서머리 업데이트
        updateSummary();
    }

    // ================================================
    // Step 1: 고객 로드
    // ================================================
    function loadCustomers() {
        if (selectedPlannerIds.length === 0) {
            customerList = [];
            $('#customer-grid').hide();
            $('#empty-customer').show();
            updateSummary();
            return;
        }

        $.ajax({
            url: '/api/v1/send/customers',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ plannerIds: selectedPlannerIds }),
            dataType: 'json',
            success: function (res) {
                if (res.success) {
                    customerList = res.data.list || [];
                    renderCustomerGrid(customerList);
                    updateSummary();
                }
            }
        });
    }

    function renderCustomerGrid(list) {
        if (!list || list.length === 0) {
            $('#customer-grid').hide();
            $('#empty-customer').show().find('p').text('선택한 설계사에 배정된 고객이 없습니다.');
            return;
        }

        $('#empty-customer').hide();
        var html = '';
        list.forEach(function (c) {
            html += '<div class="customer-card">'
                + '<div class="avatar-sm">' + (c.name ? c.name.charAt(0) : '?') + '</div>'
                + '<div class="cust-info">'
                + '<div class="cust-name">' + c.name + '</div>'
                + '<div class="cust-planner">' + (c.plannerName || '') + '</div>'
                + '</div>'
                + '</div>';
        });
        $('#customer-grid').html(html).show();
    }

    function updateSummary() {
        var pc = selectedPlannerIds.length;
        var cc = customerList.length;
        if (pc > 0) {
            $('#selection-summary').show();
            $('#summary-planner-count').text(pc);
            $('#summary-customer-count').text(cc);
        } else {
            $('#selection-summary').hide();
        }
    }

    // ================================================
    // Step 2: 메시지 편집기 + 카톡 시뮬레이터
    // ================================================

    // 치환 변수 삽입
    $('.var-btn').on('click', function () {
        var varText = $(this).data('var');
        var ta = document.getElementById('message-text');
        var start = ta.selectionStart;
        var end = ta.selectionEnd;
        var val = ta.value;
        ta.value = val.substring(0, start) + varText + val.substring(end);
        ta.selectionStart = ta.selectionEnd = start + varText.length;
        ta.focus();
        syncKakaoPreview();
    });

    // 실시간 카톡 동기화
    $('#message-text').on('input', function () {
        syncKakaoPreview();
    });

    function syncKakaoPreview() {
        var msg = $('#message-text').val();
        var len = msg.length;
        $('#char-count-val').text(len);

        if (msg.trim()) {
            // 치환 변수를 파란 배지로 렌더링
            var display = escapeHtml(msg);
            display = display.replace(/\{고객명\}/g, '<span style="background:#E3F2FD;color:#1565C0;padding:1px 6px;border-radius:10px;font-weight:600;font-size:12px;">고객명</span>');
            display = display.replace(/\{설계사명\}/g, '<span style="background:#E3F2FD;color:#1565C0;padding:1px 6px;border-radius:10px;font-weight:600;font-size:12px;">설계사명</span>');
            display = display.replace(/\{설계사연락처\}/g, '<span style="background:#E3F2FD;color:#1565C0;padding:1px 6px;border-radius:10px;font-weight:600;font-size:12px;">설계사연락처</span>');

            $('#preview-text').html(display);
            $('#preview-time').text(getCurrentTime());
            $('#preview-bubble').show();
        } else {
            $('#preview-bubble').hide();
        }
    }

    function getCurrentTime() {
        var now = new Date();
        var h = now.getHours();
        var m = now.getMinutes();
        var ampm = h >= 12 ? '오후' : '오전';
        h = h % 12 || 12;
        return ampm + ' ' + h + ':' + (m < 10 ? '0' + m : m);
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(text));
        return div.innerHTML.replace(/\n/g, '<br>');
    }

    // ================================================
    // Step 2: 템플릿 모달
    // ================================================
    $('#btn-open-template').on('click', function () {
        loadTemplates();
        $('#template-modal').fadeIn(200);
    });

    $('#btn-template-close').on('click', function () {
        $('#template-modal').fadeOut(200);
    });

    // 모달 외부 클릭 닫기
    $('#template-modal').on('click', function (e) {
        if ($(e.target).hasClass('modal-overlay')) {
            $(this).fadeOut(200);
        }
    });

    function loadTemplates() {
        $.ajax({
            url: '/api/v1/send/templates',
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                if (res.success) {
                    templateList = res.data;
                    renderTemplateList(templateList);
                }
            }
        });
    }

    var categoryMap = {
        'GENERAL': '일반',
        'BIRTHDAY': '생일',
        'CONTRACT': '계약',
        'PROMOTION': '프로모션'
    };

    function renderTemplateList(list) {
        var html = '';
        list.forEach(function (t) {
            html += '<div class="template-item" data-id="' + t.templateId + '">'
                + '<div class="tpl-title">' + t.title + '</div>'
                + '<div class="tpl-category">' + (categoryMap[t.category] || t.category) + '</div>'
                + '<div class="tpl-preview">' + (t.contentText ? t.contentText.substring(0, 80) + '...' : '') + '</div>'
                + '</div>';
        });
        $('#template-list').html(html);
    }

    $(document).on('click', '.template-item', function () {
        var id = parseInt($(this).data('id'));
        var t = templateList.find(function (x) { return x.templateId === id; });
        if (t) {
            $('#message-text').val(t.contentText || '');
            syncKakaoPreview();
        }
        $('#template-modal').fadeOut(200);
    });

    // ================================================
    // Step 3: 최종 검수
    // ================================================
    function renderReviewPreview() {
        var msg = $('#message-text').val();
        var previewMsg = msg;

        // 샘플 데이터로 치환
        if (customerList.length > 0) {
            var sample = customerList[0];
            var planner = allPlanners.find(function (p) { return p.plannerId === sample.plannerId; });
            previewMsg = previewMsg.replace(/\{고객명\}/g, sample.name || '홍길동');
            previewMsg = previewMsg.replace(/\{설계사명\}/g, (planner ? planner.plannerName : sample.plannerName) || '김설계');
            previewMsg = previewMsg.replace(/\{설계사연락처\}/g, '010-1234-5678');
        } else {
            previewMsg = previewMsg.replace(/\{고객명\}/g, '홍길동');
            previewMsg = previewMsg.replace(/\{설계사명\}/g, '김설계');
            previewMsg = previewMsg.replace(/\{설계사연락처\}/g, '010-1234-5678');
        }

        $('#preview-real-message').text(previewMsg);
        $('#review-total-count').text(customerList.length);
        $('#review-planner-count').text(selectedPlannerIds.length);
    }

    // 발송 옵션 라디오
    $('.option-radio').on('click', function () {
        $('.option-radio').removeClass('selected');
        $(this).addClass('selected');
        $(this).find('input[type="radio"]').prop('checked', true);

        if ($(this).find('input').val() === 'SCHEDULED') {
            $('#datetime-picker').addClass('show');
        } else {
            $('#datetime-picker').removeClass('show');
        }
    });

    // ================================================
    // 테스트 전송
    // ================================================
    $('#btn-test-send').on('click', function () {
        alert('테스트 전송 기능은 추후 카카오톡 Agent API 연동 시 활성화됩니다.');
    });

    // ================================================
    // 대량 발송 요청
    // ================================================
    $('#btn-bulk-send').on('click', function () {
        if (customerList.length === 0) {
            alert('발송 대상 고객이 없습니다.');
            return;
        }
        var msg = $('#message-text').val().trim();
        if (!msg) {
            alert('메시지를 입력해주세요.');
            return;
        }

        var sendType = $('input[name="send-type"]:checked').val();
        if (sendType === 'SCHEDULED') {
            var dt = $('#scheduled-datetime').val();
            if (!dt) {
                alert('예약 발송 일시를 선택해주세요.');
                return;
            }
        }

        $('#confirm-count').text(customerList.length);
        $('#confirm-modal').fadeIn(200);
    });

    $('#btn-confirm-cancel').on('click', function () {
        $('#confirm-modal').fadeOut(200);
    });

    $('#confirm-modal').on('click', function (e) {
        if ($(e.target).hasClass('confirm-overlay')) {
            $(this).fadeOut(200);
        }
    });

    $('#btn-confirm-send').on('click', function () {
        executeBulkSend();
    });

    function executeBulkSend() {
        var msg = $('#message-text').val();
        var sendType = $('input[name="send-type"]:checked').val();
        var scheduledAt = sendType === 'SCHEDULED' ? $('#scheduled-datetime').val() : null;

        // 고객별로 치환된 메시지를 포함한 큐 데이터 생성
        var queueList = customerList.map(function (c) {
            var planner = allPlanners.find(function (p) { return p.plannerId === c.plannerId; });
            var replaced = msg
                .replace(/\{고객명\}/g, c.name || '')
                .replace(/\{설계사명\}/g, (planner ? planner.plannerName : c.plannerName) || '')
                .replace(/\{설계사연락처\}/g, '010-0000-0000'); // 실제 연동 시 설계사 연락처 사용

            return {
                customerId: c.customerId,
                plannerId: c.plannerId,
                messageText: replaced,
                sendType: sendType,
                scheduledAt: scheduledAt
            };
        });

        $('#confirm-modal').fadeOut(200);
        showLoading();

        $.ajax({
            url: '/api/v1/send/request',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(queueList),
            dataType: 'json',
            success: function (res) {
                hideLoading();
                if (res.success) {
                    alert(res.message);
                    // 초기화 후 Step 1로
                    resetWizard();
                } else {
                    alert('발송 요청 실패: ' + res.message);
                }
            },
            error: function (xhr) {
                hideLoading();
                alert('서버 오류가 발생했습니다. (코드: ' + xhr.status + ')');
            }
        });
    }

    function resetWizard() {
        currentStep = 1;
        selectedPlannerIds = [];
        customerList = [];
        $('#message-text').val('');
        syncKakaoPreview();
        syncPlannerUI();
        loadCustomers();
        goToStep(1);

        // 스텝 인디케이터 초기화
        $('.wizard-step').removeClass('active done');
        $('[data-step="1"]').addClass('active');
        $('.step-connector').removeClass('done');
    }
});
