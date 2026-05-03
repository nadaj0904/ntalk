/**
 * templateAdmin.js - 메세지 템플릿 관리 스크립트
 */
$(function () {
    let grid = null;
    let currentPage = 1;
    let pageSize = 20;

    initGrid();
    loadTemplateData();

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
                { header: 'No', name: 'templateId', width: 60, align: 'center', sortable: true },
                { header: '카테고리', name: 'category', width: 100 },
                { header: '템플릿 제목', name: 'title', width: 200 },
                { header: '내용', name: 'contentText', minWidth: 300 },
                { header: '이미지 URL', name: 'imageUrl', width: 150 },
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
                    header: '관리', name: '_actions', width: 140, align: 'center',
                    formatter: function (obj) {
                        return '<button class="btn btn-sm btn-outline btn-grid-edit" data-id="' + obj.row.templateId + '" style="margin-right:4px;">' +
                               '<i class="ph ph-pencil-simple"></i> 수정</button>' +
                               '<button class="btn btn-sm btn-outline btn-grid-del" data-id="' + obj.row.templateId + '">' +
                               '<i class="ph ph-trash"></i> 삭제</button>';
                    }
                }
            ]
        });

        // (인라인 에디팅 저장 로직 제거)

        grid.on('check', toggleDeleteBtn);
        grid.on('uncheck', toggleDeleteBtn);
        grid.on('checkAll', toggleDeleteBtn);
        grid.on('uncheckAll', toggleDeleteBtn);

        // 그리드 내 수정 버튼
        $('#grid').on('click', '.btn-grid-edit', function () {
            var tId = $(this).data('id');
            var rowData = grid.getRow(grid.getIndexOfRow(tId)); // templateId is used as rowKey or we need to find it
            
            // grid.getRow() requires rowKey. If templateId != rowKey, we must search:
            var allData = grid.getData();
            var target = allData.find(function(r) { return r.templateId === tId; });
            
            if(target) {
                $('#form-template-id').val(target.templateId);
                $('#form-category').val(target.category || '');
                $('#form-title').val(target.title || '');
                $('#form-content').val(target.contentText || '');
                $('#form-image').val(target.imageUrl || '');
                $('#form-active').prop('checked', target.isActive === true || target.isActive === 'true');
                
                $('#modal-title').html('<i class="ph ph-pencil-simple"></i> 템플릿 수정');
                $('#btn-save-text').text('수정');
                $('#form-modal').fadeIn(200);
            }
        });

        $('#grid').on('click', '.btn-grid-del', function () {
            var tId = $(this).data('id');
            if (confirm('해당 템플릿을 삭제하시겠습니까?')) {
                sendAjax('/api/v1/admin/templates', 'DELETE', { ids: [tId] },
                    function (res) { alert(res.message); loadTemplateData(); }
                );
            }
        });
    }

    function toggleDeleteBtn() {
        var checked = grid.getCheckedRows();
        $('#btn-delete').prop('disabled', checked.length === 0);
    }

    function loadTemplateData() {
        var keyword = $('#search-keyword').val() || '';
        var params = '?page=' + currentPage + '&size=' + pageSize;
        if (keyword) params += '&keyword=' + encodeURIComponent(keyword);

        sendAjax('/api/v1/admin/templates/list' + params, 'GET', null,
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
        loadTemplateData();
    });

    $('#btn-search').on('click', function () {
        currentPage = 1; loadTemplateData();
    });

    $('#search-keyword').on('keyup', function (e) {
        if (e.keyCode === 13) { currentPage = 1; loadTemplateData(); }
    });

    $('#btn-delete').on('click', function () {
        var checked = grid.getCheckedRows();
        if (checked.length === 0) return;
        if (!confirm(checked.length + '건을 삭제하시겠습니까?')) return;

        var ids = checked.map(function (r) { return r.templateId; });
        sendAjax('/api/v1/admin/templates', 'DELETE', { ids: ids },
            function (res) {
                alert(res.message);
                loadTemplateData();
            }
        );
    });

    $('#btn-add').on('click', function () {
        $('#form-template-id').val('');
        $('#form-title').val('');
        $('#form-category').val('');
        $('#form-content').val('');
        $('#form-image').val('');
        $('#form-active').prop('checked', true);
        
        $('#modal-title').html('<i class="ph ph-plus-circle"></i> 템플릿 추가');
        $('#btn-save-text').text('등록');
        $('#form-modal').fadeIn(200);
    });

    $('#btn-form-close, #btn-form-cancel').on('click', function () {
        $('#form-modal').fadeOut(200);
    });

    $('#btn-form-save').on('click', function () {
        var tId = $('#form-template-id').val();
        var title = $('#form-title').val().trim();
        var category = $('#form-category').val().trim();
        var content = $('#form-content').val().trim();
        var image = $('#form-image').val().trim();
        var isActive = $('#form-active').is(':checked');

        if (!title) { alert('템플릿 제목을 입력해주세요.'); return; }
        if (!content) { alert('내용을 입력해주세요.'); return; }

        var payload = {
            title: title,
            category: category,
            contentText: content,
            imageUrl: image,
            isActive: isActive
        };

        if (tId) {
            // 수정
            sendAjax('/api/v1/admin/templates/' + tId, 'PUT', payload, function (res) {
                alert(res.message);
                $('#form-modal').fadeOut(200);
                loadTemplateData();
            });
        } else {
            // 등록
            sendAjax('/api/v1/admin/templates', 'POST', payload, function (res) {
                alert(res.message);
                $('#form-modal').fadeOut(200);
                loadTemplateData();
            });
        }
    });

    $('#btn-download').on('click', function () {
        grid.export('xlsx', { fileName: '템플릿목록_' + new Date().toISOString().slice(0, 10) });
    });

    function numberFormat(n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
});
