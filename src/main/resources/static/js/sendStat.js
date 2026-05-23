$(document).ready(function() {
    
    let statGrid;

    // 통계 그리드 초기화
    function initGrid() {
        statGrid = new tui.Grid({
            el: document.getElementById('stat-grid'),
            data: [],
            scrollX: false,
            scrollY: false,
            columns: [
                {
                    header: '메시지 타입',
                    name: 'msgType',
                    align: 'center'
                },
                {
                    header: '요청 부서',
                    name: 'reqDeptCd',
                    align: 'center'
                },
                {
                    header: '전체 요청',
                    name: 'totalCount',
                    align: 'right',
                    formatter: function(props) {
                        return props.value.toLocaleString();
                    }
                },
                {
                    header: '발송 성공',
                    name: 'successCount',
                    align: 'right',
                    formatter: function(props) {
                        return props.value.toLocaleString();
                    }
                },
                {
                    header: '발송 실패',
                    name: 'failedCount',
                    align: 'right',
                    formatter: function(props) {
                        return props.value.toLocaleString();
                    }
                },
                {
                    header: '발송 대기',
                    name: 'waitingCount',
                    align: 'right',
                    formatter: function(props) {
                        return props.value.toLocaleString();
                    }
                }
            ],
            summary: {
                height: 40,
                position: 'bottom', // or 'top'
                columnContent: {
                    reqDeptCd: {
                        template: function() {
                            return '합계:';
                        }
                    },
                    totalCount: {
                        template: function(valueMap) {
                            return valueMap.sum.toLocaleString();
                        }
                    },
                    successCount: {
                        template: function(valueMap) {
                            return valueMap.sum.toLocaleString();
                        }
                    },
                    failedCount: {
                        template: function(valueMap) {
                            return valueMap.sum.toLocaleString();
                        }
                    },
                    waitingCount: {
                        template: function(valueMap) {
                            return valueMap.sum.toLocaleString();
                        }
                    }
                }
            }
        });
        
        tui.Grid.applyTheme('striped');
    }

    // 데이터 로드 함수
    function loadStats() {
        $.ajax({
            url: '/admin/api/send-stat/today',
            type: 'GET',
            success: function(response) {
                // 요약 데이터 바인딩
                const summary = response.summary || { totalCount:0, successCount:0, failedCount:0, waitingCount:0 };
                
                $('#summary-total').text(summary.totalCount.toLocaleString());
                $('#summary-success').text(summary.successCount.toLocaleString());
                $('#summary-failed').text(summary.failedCount.toLocaleString());
                $('#summary-waiting').text(summary.waitingCount.toLocaleString());

                // 그리드 데이터 바인딩
                const details = response.details || [];
                statGrid.resetData(details);
            },
            error: function(err) {
                console.error("통계 데이터 로드 실패", err);
                alert("통계 데이터를 불러오는데 실패했습니다.");
            }
        });
    }

    // 초기화 및 로드 실행
    initGrid();
    loadStats();

    // 새로고침 버튼 이벤트
    $('#btn-refresh').on('click', function() {
        loadStats();
    });

});
