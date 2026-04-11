/**
 * custAdmin.js - 데이터 관리 (설계사/고객 매핑 그리드) 스크립트
 */
$(function () {

    // =============================================
    // 전역 변수
    // =============================================
    let grid = null;           // Toast UI Grid 인스턴스
    let previewGrid = null;    // 프리뷰 그리드
    let currentPage = 1;
    let pageSize = 20;
    let parsedValidData = [];  // 엑셀 파싱 후 정상 데이터

    // =============================================
    // 1. 초기화
    // =============================================
    initGrid();
    loadPlannerFilter();
    loadCustomerData();

    // =============================================
    // 2. Toast UI Grid 초기화
    // =============================================
    function initGrid() {
        grid = new tui.Grid({
            el: document.getElementById('grid'),
            scrollX: true,
            scrollY: true,
            bodyHeight: 'fitToParent',
            rowHeight: 38,
            minBodyHeight: 300,
            rowHeaders: ['checkbox'],
            columns: [
                {
                    header: 'No',
                    name: 'customerId',
                    width: 60,
                    align: 'center',
                    sortable: true
                },
                {
                    header: '담당 설계사',
                    name: 'plannerName',
                    width: 120,
                    align: 'center',
                    formatter: function (obj) {
                        var code = obj.row.plannerCode || '';
                        return obj.value + (code ? ' (' + code + ')' : '');
                    }
                },
                {
                    header: '고객명',
                    name: 'name',
                    width: 120,
                    editor: 'text'
                },
                {
                    header: '휴대폰 번호',
                    name: 'mobile',
                    width: 140,
                    align: 'center',
                    formatter: function (obj) {
                        var v = (obj.value || '').replace(/[^0-9]/g, '');
                        if (v.length === 11) {
                            return v.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
                        }
                        return obj.value || '';
                    },
                    editor: 'text'
                },
                {
                    header: '상태',
                    name: 'isActive',
                    width: 80,
                    align: 'center',
                    formatter: function (obj) {
                        if (obj.value === true || obj.value === 'true') {
                            return '<span class="badge badge-active">활성</span>';
                        }
                        return '<span class="badge badge-inactive">비활성</span>';
                    }
                },
                {
                    header: '등록일',
                    name: 'createdAt',
                    width: 130,
                    align: 'center',
                    formatter: function (obj) {
                        if (!obj.value) return '-';
                        return obj.value.substring(0, 10);
                    }
                },
                {
                    header: '관리',
                    name: '_actions',
                    width: 100,
                    align: 'center',
                    formatter: function (obj) {
                        return '<button class="btn btn-sm btn-outline btn-grid-del" data-id="' + obj.row.customerId + '">' +
                               '<i class="ph ph-trash"></i> 삭제</button>';
                    }
                }
            ]
        });

        // 인라인 에디팅 완료 시 자동 저장
        grid.on('afterChange', function (ev) {
            ev.changes.forEach(function (change) {
                var rowData = grid.getRow(change.rowKey);
                if (rowData && rowData.customerId) {
                    var updateData = {
                        name: rowData.name,
                        mobile: (rowData.mobile || '').replace(/[^0-9]/g, ''),
                        plannerId: rowData.plannerId,
                        isActive: rowData.isActive
                    };
                    sendAjax('/api/v1/admin/customers/' + rowData.customerId, 'PUT', updateData,
                        function () { /* 성공 시 조용히 처리 */ },
                        function (msg) { alert('수정 실패: ' + msg); loadCustomerData(); }
                    );
                }
            });
        });

        // 체크박스 선택 시 삭제 버튼 활성화 제어
        grid.on('check', toggleDeleteBtn);
        grid.on('uncheck', toggleDeleteBtn);
        grid.on('checkAll', toggleDeleteBtn);
        grid.on('uncheckAll', toggleDeleteBtn);

        // 그리드 내 삭제 버튼 클릭 이벤트
        $('#grid').on('click', '.btn-grid-del', function () {
            var customerId = $(this).data('id');
            if (confirm('해당 고객을 삭제하시겠습니까?')) {
                sendAjax('/api/v1/admin/customers', 'DELETE', { ids: [customerId] },
                    function (res) { alert(res.message); loadCustomerData(); }
                );
            }
        });
    }

    function toggleDeleteBtn() {
        var checked = grid.getCheckedRows();
        $('#btn-delete').prop('disabled', checked.length === 0);
    }

    // =============================================
    // 3. 데이터 로드
    // =============================================
    function loadCustomerData() {
        var keyword = $('#search-keyword').val() || '';
        var plannerId = $('#filter-planner').val() || '';
        var status = $('#filter-status').val() || '';

        var params = '?page=' + currentPage + '&size=' + pageSize;
        if (keyword) params += '&keyword=' + encodeURIComponent(keyword);
        if (plannerId) params += '&plannerId=' + plannerId;
        if (status) params += '&status=' + status;

        sendAjax('/api/v1/admin/customers' + params, 'GET', null,
            function (res) {
                var data = res.data;
                grid.resetData(data.list || []);
                $('#total-count').text(numberFormat(data.totalCount || 0));
                renderPaging(data.totalCount, data.page, data.totalPages);
            }
        );
    }

    // =============================================
    // 4. 설계사 필터 로드
    // =============================================
    function loadPlannerFilter() {
        sendAjax('/api/v1/admin/planners', 'GET', null,
            function (res) {
                var $select = $('#filter-planner');
                var $addSelect = $('#add-planner');
                (res.data || []).forEach(function (p) {
                    var text = p.plannerName + (p.plannerCode ? ' (' + p.plannerCode + ')' : '');
                    $select.append('<option value="' + p.plannerId + '">' + text + '</option>');
                    $addSelect.append('<option value="' + p.plannerId + '">' + text + '</option>');
                });
            }
        );
    }

    // =============================================
    // 5. 페이징 렌더링
    // =============================================
    function renderPaging(totalCount, page, totalPages) {
        var $paging = $('#paging');
        $paging.empty();

        if (totalPages <= 1) return;

        // 이전
        $paging.append('<button ' + (page <= 1 ? 'disabled' : '') + ' data-page="' + (page - 1) + '">&laquo;</button>');

        // 페이지 번호
        var start = Math.max(1, page - 4);
        var end = Math.min(totalPages, start + 9);
        for (var i = start; i <= end; i++) {
            $paging.append('<button class="' + (i === page ? 'active' : '') + '" data-page="' + i + '">' + i + '</button>');
        }

        // 다음
        $paging.append('<button ' + (page >= totalPages ? 'disabled' : '') + ' data-page="' + (page + 1) + '">&raquo;</button>');
    }

    // 페이징 버튼 클릭
    $('#paging').on('click', 'button:not(:disabled)', function () {
        currentPage = parseInt($(this).data('page'));
        loadCustomerData();
    });

    // =============================================
    // 6. 이벤트 바인딩
    // =============================================

    // 검색 버튼
    $('#btn-search').on('click', function () {
        currentPage = 1;
        loadCustomerData();
    });

    // Enter 키 검색
    $('#search-keyword').on('keyup', function (e) {
        if (e.keyCode === 13) {
            currentPage = 1;
            loadCustomerData();
        }
    });

    // 선택 삭제
    $('#btn-delete').on('click', function () {
        var checked = grid.getCheckedRows();
        if (checked.length === 0) return;
        if (!confirm(checked.length + '건을 삭제하시겠습니까?')) return;

        var ids = checked.map(function (r) { return r.customerId; });
        sendAjax('/api/v1/admin/customers', 'DELETE', { ids: ids },
            function (res) {
                alert(res.message);
                loadCustomerData();
            }
        );
    });

    // =============================================
    // 7. 개별 추가 모달
    // =============================================
    $('#btn-add').on('click', function () {
        $('#add-name').val('');
        $('#add-mobile').val('');
        $('#add-planner').val('');
        $('#add-modal').fadeIn(200);
    });

    $('#btn-add-close, #btn-add-cancel').on('click', function () {
        $('#add-modal').fadeOut(200);
    });

    $('#btn-add-save').on('click', function () {
        var plannerId = $('#add-planner').val();
        var name = $('#add-name').val().trim();
        var mobile = $('#add-mobile').val().trim().replace(/[^0-9]/g, '');

        if (!plannerId) { alert('담당 설계사를 선택해주세요.'); return; }
        if (!name) { alert('고객명을 입력해주세요.'); return; }
        if (!mobile) { alert('휴대폰 번호를 입력해주세요.'); return; }

        sendAjax('/api/v1/admin/customers', 'POST', {
            plannerId: parseInt(plannerId),
            name: name,
            mobile: mobile,
            isActive: true
        }, function (res) {
            alert(res.message);
            $('#add-modal').fadeOut(200);
            loadCustomerData();
        });
    });

    // =============================================
    // 8. 엑셀 업로드 모달
    // =============================================
    var selectedFile = null;

    $('#btn-upload').on('click', function () {
        resetUploadModal();
        $('#upload-modal').fadeIn(200);
    });

    $('#btn-modal-close, #btn-modal-cancel').on('click', function () {
        $('#upload-modal').fadeOut(200);
    });

    function resetUploadModal() {
        selectedFile = null;
        parsedValidData = [];
        $('#file-name').text('');
        $('#step-3').hide();
        $('#btn-parse').hide();
        $('#btn-import').hide();
        if (previewGrid) {
            previewGrid.destroy();
            previewGrid = null;
        }
    }

    // 드래그 앤 드롭
    var $dropZone = $('#drop-zone');

    $dropZone.on('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass('drag-over');
    });

    $dropZone.on('dragleave', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('drag-over');
    });

    $dropZone.on('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('drag-over');
        var files = e.originalEvent.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });

    $dropZone.on('click', function () {
        $('#file-input').click();
    });

    $('#file-input').on('change', function () {
        if (this.files.length > 0) {
            handleFileSelect(this.files[0]);
        }
    });

    function handleFileSelect(file) {
        var ext = file.name.split('.').pop().toLowerCase();
        if (ext !== 'xlsx' && ext !== 'xls') {
            alert('엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.');
            return;
        }
        selectedFile = file;
        $('#file-name').text(file.name + ' (' + formatFileSize(file.size) + ')');
        $('#btn-parse').show();
    }

    // 데이터 검증 (프리뷰)
    $('#btn-parse').on('click', function () {
        if (!selectedFile) return;

        var formData = new FormData();
        formData.append('file', selectedFile);

        showLoading();
        $.ajax({
            url: '/api/v1/admin/customers/upload-preview',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function (xhr) {
                var token = $("meta[name='_csrf']").attr("content");
                var header = $("meta[name='_csrf_header']").attr("content");
                if (token && header) xhr.setRequestHeader(header, token);
            },
            success: function (res) {
                hideLoading();
                if (res.success) {
                    showPreview(res.data);
                } else {
                    alert('파싱 실패: ' + res.message);
                }
            },
            error: function () {
                hideLoading();
                alert('서버 통신 오류가 발생했습니다.');
            }
        });
    });

    function showPreview(data) {
        parsedValidData = data.validList || [];
        $('#preview-valid').text(data.validCount || 0);
        $('#preview-error').text(data.errorCount || 0);
        $('#step-3').show();
        $('#btn-parse').hide();

        // 프리뷰 그리드 생성
        if (previewGrid) previewGrid.destroy();

        var previewData = parsedValidData.map(function (item, idx) {
            return { no: idx + 1, plannerCode: item.plannerCode, name: item.name, mobile: item.mobile };
        });

        previewGrid = new tui.Grid({
            el: document.getElementById('preview-grid'),
            scrollX: false,
            scrollY: true,
            bodyHeight: 200,
            rowHeight: 32,
            data: previewData,
            columns: [
                { header: 'No', name: 'no', width: 50, align: 'center' },
                { header: '설계사 사번', name: 'plannerCode', width: 120 },
                { header: '고객명', name: 'name', width: 120 },
                { header: '휴대폰 번호', name: 'mobile', width: 140 }
            ]
        });

        if (parsedValidData.length > 0) {
            $('#btn-import').show();
        }
    }

    // 최종 등록
    $('#btn-import').on('click', function () {
        if (parsedValidData.length === 0) return;
        if (!confirm(parsedValidData.length + '건을 덮어쓰기 정책으로 등록하시겠습니까?')) return;

        sendAjax('/api/v1/admin/customers/import', 'POST', parsedValidData,
            function (res) {
                alert(res.message);
                $('#upload-modal').fadeOut(200);
                loadCustomerData();
            }
        );
    });

    // 엑셀 양식 다운로드
    $('#btn-template-download').on('click', function () {
        // 간단한 CSV 양식 다운로드 (실제로는 서버에서 .xlsx를 생성하는 것을 권장)
        var csv = '설계사사번,고객명,휴대폰번호\nP1001,홍길동,01012345678\n';
        var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = '고객_업로드_양식.csv';
        link.click();
    });

    // 엑셀 다운로드 (현재 그리드 데이터)
    $('#btn-download').on('click', function () {
        grid.export('xlsx', { fileName: '고객목록_' + new Date().toISOString().slice(0, 10) });
    });

    // =============================================
    // 9. 유틸리티
    // =============================================
    function numberFormat(n) {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    }

    // =============================================
    // 10. 세션 타이머 (index.js 와 동일 로직)
    // =============================================
    var totalSeconds = 60 * 60;
    var timerInterval = setInterval(function () {
        totalSeconds--;
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            alert('세션이 만료되었습니다. 다시 로그인해주세요.');
            location.href = '/logout';
            return;
        }
        var mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        var ss = String(totalSeconds % 60).padStart(2, '0');
        $('#session-timer').text(mm + ':' + ss);
    }, 1000);

    $('#btn-extend').on('click', function () {
        totalSeconds = 60 * 60;
        alert('세션이 60분 연장되었습니다.');
    });

});
