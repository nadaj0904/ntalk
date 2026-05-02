/**
 * plannerAdmin.js - 플래너 관리 스크립트
 */
$(function () {
    let grid = null;
    let currentPage = 1;
    let pageSize = 20;

    initGrid();
    loadPlannerData();

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
                { header: 'No', name: 'plannerId', width: 60, align: 'center', sortable: true },
                { header: '플래너명', name: 'name', width: 100, editor: 'text' },
                { header: '사번', name: 'plannerCode', width: 100, editor: 'text' },
                { header: '소속회사', name: 'companyName', width: 120 },
                { header: '회사코드', name: 'companyCd', width: 80, editor: 'text' },
                { header: '소속지점', name: 'branchName', width: 120, editor: 'text' },
                { header: '이메일', name: 'email', width: 150, editor: 'text' },
                {
                    header: '휴대폰 번호', name: 'mobile', width: 130, align: 'center',
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
                    header: '관리', name: '_actions', width: 80, align: 'center',
                    formatter: function (obj) {
                        return '<button class="btn btn-sm btn-outline btn-grid-del" data-id="' + obj.row.plannerId + '">' +
                               '<i class="ph ph-trash"></i> 삭제</button>';
                    }
                }
            ]
        });

        // 인라인 에디팅 저장
        grid.on('afterChange', function (ev) {
            ev.changes.forEach(function (change) {
                var rowData = grid.getRow(change.rowKey);
                if (rowData && rowData.plannerId) {
                    var updateData = {
                        name: rowData.name,
                        plannerCode: rowData.plannerCode,
                        companyCd: rowData.companyCd,
                        branchName: rowData.branchName,
                        email: rowData.email,
                        mobile: (rowData.mobile || '').replace(/[^0-9]/g, '')
                    };
                    sendAjax('/api/v1/admin/planners/' + rowData.plannerId, 'PUT', updateData,
                        function () { loadPlannerData(); },
                        function (msg) { alert('수정 실패: ' + msg); loadPlannerData(); }
                    );
                }
            });
        });

        grid.on('check', toggleDeleteBtn);
        grid.on('uncheck', toggleDeleteBtn);
        grid.on('checkAll', toggleDeleteBtn);
        grid.on('uncheckAll', toggleDeleteBtn);

        $('#grid').on('click', '.btn-grid-del', function () {
            var pId = $(this).data('id');
            if (confirm('해당 플래너를 삭제하시겠습니까?')) {
                sendAjax('/api/v1/admin/planners', 'DELETE', { ids: [pId] },
                    function (res) { alert(res.message); loadPlannerData(); }
                );
            }
        });
    }

    function toggleDeleteBtn() {
        var checked = grid.getCheckedRows();
        $('#btn-delete').prop('disabled', checked.length === 0);
    }

    function loadPlannerData() {
        var keyword = $('#search-keyword').val() || '';
        var params = '?page=' + currentPage + '&size=' + pageSize;
        if (keyword) params += '&keyword=' + encodeURIComponent(keyword);

        sendAjax('/api/v1/admin/planners/list' + params, 'GET', null,
            function (res) {
                var data = res.data;
                grid.resetData(data.list || []);
                $('#total-count').text(numberFormat(data.totalCount || 0));
                renderPaging(data.totalCount, data.page, data.totalPages);
            }
        );
    }

    function renderPaging(totalCount, page, totalPages) {
        var $paging = $('#paging');
        $paging.empty();
        if (totalPages <= 1) return;

        $paging.append('<button ' + (page <= 1 ? 'disabled' : '') + ' data-page="' + (page - 1) + '">&laquo;</button>');
        var start = Math.max(1, page - 4);
        var end = Math.min(totalPages, start + 9);
        for (var i = start; i <= end; i++) {
            $paging.append('<button class="' + (i === page ? 'active' : '') + '" data-page="' + i + '">' + i + '</button>');
        }
        $paging.append('<button ' + (page >= totalPages ? 'disabled' : '') + ' data-page="' + (page + 1) + '">&raquo;</button>');
    }

    $('#paging').on('click', 'button:not(:disabled)', function () {
        currentPage = parseInt($(this).data('page'));
        loadPlannerData();
    });

    $('#btn-search').on('click', function () {
        currentPage = 1; loadPlannerData();
    });

    $('#search-keyword').on('keyup', function (e) {
        if (e.keyCode === 13) { currentPage = 1; loadPlannerData(); }
    });

    $('#btn-delete').on('click', function () {
        var checked = grid.getCheckedRows();
        if (checked.length === 0) return;
        if (!confirm(checked.length + '건을 삭제하시겠습니까?')) return;

        var ids = checked.map(function (r) { return r.plannerId; });
        sendAjax('/api/v1/admin/planners', 'DELETE', { ids: ids },
            function (res) {
                alert(res.message);
                loadPlannerData();
            }
        );
    });

    $('#btn-add').on('click', function () {
        $('#add-name').val('');
        $('#add-code').val('');
        $('#add-company').val('');
        $('#add-branch').val('');
        $('#add-email').val('');
        $('#add-mobile').val('');
        $('#add-modal').fadeIn(200);
    });

    $('#btn-add-close, #btn-add-cancel').on('click', function () {
        $('#add-modal').fadeOut(200);
    });

    $('#btn-add-save').on('click', function () {
        var name = $('#add-name').val().trim();
        var code = $('#add-code').val().trim();
        var company = $('#add-company').val().trim();
        var branch = $('#add-branch').val().trim();
        var email = $('#add-email').val().trim();
        var mobile = $('#add-mobile').val().trim().replace(/[^0-9]/g, '');

        if (!name) { alert('플래너명을 입력해주세요.'); return; }
        if (!code) { alert('사번을 입력해주세요.'); return; }

        sendAjax('/api/v1/admin/planners', 'POST', {
            name: name,
            plannerCode: code,
            companyCd: company,
            branchName: branch,
            email: email,
            mobile: mobile
        }, function (res) {
            alert(res.message);
            $('#add-modal').fadeOut(200);
            loadPlannerData();
        });
    });

    $('#btn-download').on('click', function () {
        grid.export('xlsx', { fileName: '플래너목록_' + new Date().toISOString().slice(0, 10) });
    });

    function numberFormat(n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
});
