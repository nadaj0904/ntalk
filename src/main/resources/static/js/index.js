// c:\Dev_ntalk_project\ntalk\src\main\resources\static\js\index.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. 네비게이션 메뉴 액티브 상태 처리
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 실제 페이지 이동 시엔 필요 없지만 화면 데모를 위해 기본 동작 방지 혹은 액티브 클래스 이관
            // e.preventDefault(); 
            
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 2. 세션 타이머 기능 (60:00) 구현
    const timerDisplay = document.getElementById('session-timer');
    const extendBtn = document.getElementById('btn-extend');
    
    let defaultTime = 60 * 60; // 60분 (초 단위)
    let timeRemaining = defaultTime;
    let timerInterval;

    // 초를 mm:ss 형식의 문자열로 반환
    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    // 타이머 화면 업데이트 로직
    function updateTimerDisplay() {
        if (!timerDisplay) return;
        
        timerDisplay.textContent = formatTime(timeRemaining);
        
        // 5분(300초) 미만일 때 텍스트 색상을 좀 더 강하게 렌더링
        if (timeRemaining <= 300) {
            timerDisplay.style.color = '#ef4444'; // Tailwind text-red-500
            timerDisplay.style.fontWeight = '700';
            
            // 깜빡임 효과 (초 단위 변경시)
            if(timeRemaining % 2 === 0) {
                timerDisplay.style.opacity = '1';
            } else {
                timerDisplay.style.opacity = '0.7';
            }
        } else {
            timerDisplay.style.color = 'var(--text-main)';
            timerDisplay.style.fontWeight = '600';
            timerDisplay.style.opacity = '1';
        }
    }

    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                updateTimerDisplay();
                alert("보안을 위해 세션이 만료되어 자동으로 로그아웃 됩니다.");
                window.location.href = "/logout";
            }
        }, 1000);
    }

    // 연장 버튼 클릭 이벤트
    if (extendBtn) {
        extendBtn.addEventListener('click', () => {
            timeRemaining = defaultTime;
            updateTimerDisplay();
            startTimer();
            alert("로그인 세션이 60분으로 연장되었습니다.");
        });
    }

    // 문서 로드 완료 시 타이머 렌더 및 시작
    updateTimerDisplay();
    startTimer();
});
