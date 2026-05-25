

# [AI 개발 지침서] 시스템 복제 및 개발 가이드

본 문서는 `Dev_nc_spring_project` 프로젝트의 기술 아키텍처, UI/UX 디자인 시스템, 백엔드 및 프론트엔드 개발 표준을 기반으로 작성되었습니다. 새로운 프로젝트를 본 프로젝트와 **동일한 기술 스택 및 개발 방식**으로 개발할 때, AI 코딩 어시스턴트가 반드시 준수해야 하는 지침을 정의합니다.

---

## 1. 기술 아키텍처 개요 (Technology Stack)

새로운 프로젝트를 구현할 때는 반드시 다음 스택 및 버전을 유지해야 합니다.

### 백엔드 (Backend)
<!-- - **Language**: Java 17 사람이 설정-->
<!-- - **Framework**: Spring Boot 4.0.5 (또는 3.x 호환 버전) 사람이 설정-->
<!-- - **Build Tool**: Maven (WAR 패키징 구성, `pom.xml` 빌드 이름 `ntalk` 지정) 사람이 설정-->
- **Database**: PostgreSQL (AWS Lightsail 또는 로컬 환경)
<!-- - **ORM / SQL Mapper**: MyBatis (`mybatis-spring-boot-starter` 4.0.1) 사람이 설정-->
- **Libraries**:
  - `spring-boot-starter-thymeleaf`: 서버 사이드 렌더링용 템플릿 엔진
  - `spring-boot-starter-webmvc`: 웹 MVC 및 REST API 구축
  - `spring-cloud-starter-loadbalancer`: 로드밸런싱 지원
  - `poi-ooxml` (Apache POI 5.2.3): 엑셀 파싱 및 프리뷰/임포트 기능
  - `spring-security-crypto`: 비밀번호 암호화 (`BCryptPasswordEncoder` 단독 사용)


### 프론트엔드 (Frontend)
- **Architecture**: Thymeleaf 기반 서버 사이드 렌더링 (SSR) + Vanilla CSS / Vanilla JS (jQuery 보조)
- **Font**: Pretendard (`https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard.css`)
- **Icons**: Phosphor Icons (`https://unpkg.com/@phosphor-icons/web`)
- **Communication**: jQuery AJAX 기반 통신 (공통 래퍼 사용)

---

## 2. 프로젝트 디렉터리 구조 표준

아래 디렉터리 구조를 엄격히 준수하여 파일을 배치해야 합니다.

```text
ntalk/
├── pom.xml                               # Maven 의존성 및 빌드 설정 파일
├── mvnw / mvnw.cmd                       # Maven 래퍼 스크립트
├── package.json                          # Node.js 부가 유틸리티 설정 (pdf-parse, pg 등)
└── src/
    ├── main/
    │   ├── java/com/ntalk/choi/          # 백엔드 자바 패키지 루트
    │   │   ├── NtalkApplication.java     # 스프링 부트 메인 실행 클래스
    │   │   ├── ServletInitializer.java   # WAR 구동 서블릿 초기화 설정
    │   │   ├── config/                   # 설정 영역 (예: SecurityConfig.java)
    │   │   ├── controller/               # 컨트롤러 레이어
    │   │   │   └── common/               # 공통 예외 처리 (GlobalExceptionHandler.java)
    │   │   ├── domain/                   # DTO 및 VO 레이어
    │   │   │   └── common/               # 공통 응답 객체 (ApiResponse.java)
    │   │   ├── repository/               # MyBatis Mapper 인터페이스 레이어
    │   │   └── service/                  # 비즈니스 로직 서비스 레이어
    │   │
    │   ├── resources/                    # 정적 자원 및 템플릿
    │   │   ├── application.properties     # DB 커넥션 풀 및 MyBatis 설정 파일
    │   │   ├── logback-spring.xml        # 시스템 로그 설정
    │   │   ├── mapper/                   # MyBatis SQL XML 매퍼 파일들 (*Mapper.xml)
    │   │   ├── static/                   # 정적 웹 리소스
    │   │   │   ├── css/                  # 페이지별 CSS 스타일시트 (index.css, custAdmin.css 등)
    │   │   │   └── js/                   # 페이지별 JS 스크립트 (common.js, index.js 등)
    │   │   └── templates/                # Thymeleaf HTML 템플릿 파일들
    │   │       ├── admin/                # 관리자 영역 템플릿 (custAdmin.html 등)
    │   │       ├── index.html            # 메인 대시보드 레이어 뼈대
    │   │       ├── login.html            # 로그인 페이지
    │   └── webapp/                       # 서블릿 컨텍스트 정적 경로 (필요 시)
```

---

## 3. 백엔드 개발 및 코딩 규칙

### 1) 3-Tier Layered Architecture 준수
- **Domain**: 데이터 전송용 DTO 객체를 정의합니다. (카멜 케이스 필드 준수)
- **Repository (Mapper Interface)**: 데이터베이스 쿼리와 매핑되는 자바 인터페이스를 정의합니다.
- **Service**: 비즈니스 트랜잭션 단위 및 규칙을 정의하고 구현합니다.
- **Controller**: HTTP 요청 처리 및 응답 반환을 담당합니다.

### 2) 컨트롤러(Controller) 구분 및 API 표준
- **HTML View 반환**:
  - `@Controller` 어노테이션을 사용하여 Thymeleaf 템플릿의 경로(String)를 반환합니다.
  - 로그인 세션 검증이 필요할 경우, `HttpSession`에서 `loginUser` 세션 속성을 검사하여 없으면 `redirect:/login` 처리합니다.
- **REST API 엔드포인트**:
  - `@ResponseBody`를 사용하여 JSON 응답을 반환합니다.
  - URI 명명 규칙: `/api/v1/admin/[resource]` 형태의 RESTful 명명법을 따릅니다.
  - HTTP Method 매핑: 조회(`GET`), 생성(`POST`), 수정(`PUT`), 삭제(`DELETE`)를 구분하여 적용합니다.

### 3) 공통 API 응답 구조 (`ApiResponse.java`)
모든 AJAX REST API는 프론트엔드 표준 통신에 대응하도록 반드시 `ApiResponse<T>` 포맷으로 래핑하여 응답해야 합니다.

```java
public class ApiResponse<T> {
    private boolean success; // 성공 여부 (true / false)
    private String message;  // 응답 메시지 (성공/에러 알림)
    private T data;          // 실제 응답 데이터 객체
    
    // ApiResponse.success("성공메시지", data) 또는 ApiResponse.error("에러메시지") 형태로 빌드
}
```

### 4) 데이터베이스 연동 및 MyBatis 매퍼(Mapper) 표준
- **Naming**: 테이블명은 `TB_설정_[비즈니스명]` 패턴을 따릅니다.
- **Soft Delete**: 데이터 제거 시 물리 삭제(`DELETE`)를 사용하지 않고, `deleted_at` (삭제 시간), `deleted_id` (삭제한 사용자 ID) 컬럼을 채우는 **소프트 삭제(논리 삭제)** 방식을 의무 적용합니다.
- **MyBatis 설정**:
  - 스네이크 케이스 테이블 컬럼명을 DTO의 카멜 케이스 필드명으로 자동 매핑합니다 (`map-underscore-to-camel-case=true`).
  - 매퍼 XML 파일에서는 `<sql id="searchCondition">` 등의 태그로 검색 및 필터 조건을 모듈화하여 `<include>`로 재사용합니다.
  - 대소문자 무관 검색 시 PostgreSQL 내장 함수인 `ILIKE`를 적극 활용합니다 (`AND c.name ILIKE '%' || #{keyword} || '%'`).
  - 페이징 쿼리는 반드시 `LIMIT #{size} OFFSET #{offset}` 구조를 따릅니다.

### 5) 사용자 세션 및 비밀번호 보안
- 비밀번호 암호화는 Spring Security의 `BCryptPasswordEncoder`를 빈으로 등록하여 단독 사용하며, 회원가입 또는 변경 시 암호화하여 저장합니다.
- 사용자가 로그인에 성공하면 `HttpSession` 내 `loginUser` 속성에 `AccountDTO` 형태의 세션 데이터를 저장하여 만료 시간을 관리합니다.

---

## 4. 프론트엔드 및 UI/UX 디자인 시스템 표준

### 1) UI 레이아웃 및 메뉴바 구조 (Sidebar-Main Layout)
페이지 전체 레이아웃은 **좌측 고정 사이드바(Sidebar)**와 **우측 유동 메인 래퍼(Main Content Area)** 구조를 일관되게 적용합니다.

#### **좌측 사이드바 (`aside` - 가로 240px 고정)**
1. **로고 영역 (`.logo-area` - 높이 60px)**:
   - 시스템명 및 로고 아이콘 표시. 하단에 미세한 보더 라인 추가 (`border-bottom: 1px solid rgba(255, 255, 255, 0.05);`).
2. **네비게이션 메뉴 (`nav.nav-menu`)**:
   - 수직 메뉴 아이템 리스트. 마우스 오버 시 미세한 밝기 변화 애니메이션 적용.
   - 활성화된 메뉴 아이템(`.nav-item.active`)은 파란색 액센트 배경(`rgba(59, 130, 246, 0.1)`)과 왼쪽에 `3px solid var(--primary-color)` 보더 및 강조 컬러 적용.
   - 메뉴바 메뉴 구성: 
     <!-- - **메인 대시보드** (Home, 아이콘: `ph-squares-four`, 경로: `/index`)
     - **바로 발송** (아이콘: `ph-paper-plane-tilt`, 경로: `/send`)
     - **데이터 관리** (아이콘: `ph-database`, 경로: `/admin/custAdmin`)
     - **플래너 관리** (아이콘: `ph-user-circle`, 경로: `/admin/plannerAdmin`)
     - **메세지 관리** (아이콘: `ph-chat-circle-text`, 경로: `/admin/templateAdmin`)
     - **오늘의 발송 현황** (아이콘: `ph-chart-bar`, 경로: `/admin/send-stat`) -->
3. **하단 설정 영역 (`.sidebar-footer`)**:
   - 관리자 설정 아이콘 메뉴 배치 (`/admin/settings`).

#### **우측 메인 래퍼 (`.main-wrapper` - 마진 레프트 240px)**
1. **상단 헤더 (`header` - 높이 60px 고정)**:
   - 좌측: 현재 페이지 성격 또는 간단한 인사말 출력.
   - 우측:
     - **세션 타이머 (`.timer-wrapper`)**: 60분(`60:00`)부터 시작하는 역카운트 타이머 표시 + 연장 버튼(`btn-extend`) 제공.
     - **사용자 정보 (`.user-info`)**: 사용자 성의 첫 글자를 딴 원형 아바타(`.avatar`)와 이름(`[이름] 님`) 표시.
     - **로그아웃 버튼 (`.btn-logout`)**: 오버 시 붉은색(`--danger-color`)으로 변하는 로그아웃 아이콘 배치.
2. **본문 콘텐츠 영역 (`main`)**:
   - 독립적인 스크롤바 활성화 (`overflow-y: auto`).
   - 대시보드의 경우 반응형 CSS Grid 구조(`.dashboard-grid`)를 적용하며, 개별 위젯 카드는 시맨틱 태그인 `<article>`을 활용하여 둥근 모서리(`border-radius: 12px`), 미세한 그림자(`box-shadow`), 호버 시 위로 뜨는 마이크로 애니메이션(`transform: translateY(-2px)`)을 구성합니다.
3. **하단 푸터 (`footer`)**:
   - 저작권(Copyright) 문구를 연한 회색 글씨로 배치.

### 2) 디자인 토큰 및 테마 색상 (CSS Variables)
`index.css`에 지정된 아래 CSS 변수를 전역 디자인 토큰으로 활용하여 완성도 높은 모던 테마를 유지합니다.

```css
:root {
  --primary-color: #3b82f6;      /* 메인 액센트 블루 */
  --primary-hover: #2563eb;      /* 마우스 오버 블루 */
  --bg-color: #f8fafc;           /* 부드러운 회색 배경 */
  --sidebar-bg: #1e293b;         /* 다크 네이비 사이드바 배경 */
  --sidebar-text: #e2e8f0;       /* 사이드바 기본 텍스트 */
  --sidebar-hover: #334155;      /* 사이드바 메뉴 호버 시 */
  --sidebar-active: #0f172a;     /* 사이드바 메뉴 활성 상태 */
  --header-bg: #ffffff;          /* 헤더 배경 백색 */
  --text-main: #0f172a;          /* 본문 주 텍스트 (다크 블루 그레이) */
  --text-muted: #64748b;         /* 보조 및 옅은 설명용 텍스트 */
  --border-color: #e2e8f0;       /* 경계선 컬러 */
  --danger-color: #ef4444;       /* 삭제/주의/로그아웃 강조용 레드 */
  --header-height: 60px;
  --sidebar-width: 240px;
}
```

### 3) 프론트엔드 자바스크립트 및 AJAX 통신 규격
- **독립성 유지**: HTML 마크업 내부에 인라인 스크립트를 최소화하고, 페이지명과 1:1로 대응되는 단독 JS 파일(예: `custAdmin.js`)에 리스너와 비즈니스 로직을 집약시킵니다.
- **CSRF 보안**: 모든 비GET 방식(POST, PUT, DELETE)의 AJAX 요청에는 메타 태그의 `_csrf` 및 `_csrf_header` 값을 자동으로 포함시키는 AJAX 인터셉터 로직을 가동합니다.
- **공통 AJAX 모듈 (`common.js`) 사용**:
  - 통신 시작 시 전역 로딩 창(`.loading-overlay`)을 노출하고, 완료 시 해제합니다.
  - REST API에 AJAX를 요청할 때는 반드시 공통 래퍼 함수인 `sendAjax()`를 사용해야 합니다.

```javascript
/**
 * 공통 AJAX 호출 래퍼
 * @param {string} url - API 경로
 * @param {string} method - HTTP 메서드 (GET, POST, PUT, DELETE 등)
 * @param {object} data - 전송할 JSON 데이터 payload
 * @param {function} successCallback - response.success 가 true일 때 실행할 콜백 함수
 * @param {function} errorCallback - 비즈니스 실패 시 처리할 커스텀 콜백 (생략 시 기본 얼럿)
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
                if (typeof successCallback === "function") successCallback(response);
            } else {
                if (typeof errorCallback === "function") errorCallback(response.message);
                else alert("처리 실패: " + response.message);
            }
        },
        error: function(xhr) {
            hideLoading();
            if (xhr.status === 400 && xhr.responseJSON) {
                // Spring Bean Validation 실패 메시지 상세 파싱 처리
                let errorMsg = xhr.responseJSON.message || "입력값이 올바르지 않습니다.";
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
```

---

## 5. 핵심 페이지 비즈니스 로직 가이드 (도메인 특화 구현)

새로운 프로젝트에서 데이터 관리나 비즈니스 기능을 재현할 때는 아래 설계 방식을 복제하십시오.

### 1) 엑셀 대용량 업로드 프리뷰 & 임포트 프로세스 (`custAdmin` 등)
- 사용자가 엑셀 파일을 업로드하면 즉시 디비에 반영하지 않고, 백엔드에서 `MultipartFile`을 받아 메모리상에서 Apache POI로 행 데이터를 읽습니다.
- 읽은 데이터를 기반으로 유효성 검증(필수값 누락, 중복 검증)을 수행한 뒤, 화면에 임시 **미리보기(Preview) 테이블**을 띄웁니다.
- 유효하지 않은 데이터 라인은 붉은색 표시와 에러 메시지를 띄우며, 사용자가 확인 후 '최종 등록' 버튼을 누르면 일괄 임포트 API가 수행됩니다.
- 임포트 시 기존 데이터와 매핑키(예: 휴대폰 번호)가 중복될 경우, 덮어쓰기(`update`) 또는 무시(`skip`) 전략을 제공합니다.

### 2) 인라인 그리드 에디팅 (Inline Grid Editing)
- 테이블 목록에서 행 데이터를 즉각 수정할 수 있도록 연필 모양 버튼 또는 더블클릭 액션을 통해 텍스트 노드를 `<input>` 또는 `<select>` 엘리먼트로 동적 변환합니다.
- 수정이 완료되면 `sendAjax`의 `PUT` 요청을 발생시켜 즉각 서버의 단건 수정 엔드포인트와 통신하여 부분 업데이트 처리합니다.

### 3) 세션 타이머 연장 및 실시간 대시보드
- 화면 로드와 동시에 60분의 세션 타이머가 작동하며, 1초마다 화면상의 타이머를 역카운트(Decrement)시킵니다.
- 연장(`btn-extend`) 버튼 클릭 시 세션 유효 시간 연장 API를 조용히 호출하고, 프론트의 시간을 다시 `60:00`으로 갱신시킵니다.
- 대시보드의 카드 영역은 주요 핵심 지표 건수(오늘 발송량, 미배정 고객 등)를 비동기적으로 조회해 채웁니다.

---

## 6. AI 준수 핵심 프롬프트 (System Guideline)

> **[IMPORTANT] AI는 코드를 작성할 때 다음 원칙을 절대적으로 따릅니다.**
> 1. 모든 HTML 구조는 시맨틱 엘리먼트(`<main>`, `<section>`, `<article>`, `<header>`, `<aside>`, `<footer>`)를 엄격히 사용해야 합니다.
> 2. TailwindCSS 같은 ad-hoc 유틸리티 CSS 프레임워크는 배제하고, `index.css`에 선언된 디자인 토큰(CSS variables)을 적극 활용한 Vanilla CSS 파일 디자인을 구현하십시오.
> 3. 신규 화면을 생성할 때는 좌측 사이드바 구조(Sidebar-Main Layout)를 유지하고, 네비게이션 액티브 상태(`.nav-item.active`) 보더 애니메이션을 반영해야 합니다.
> 4. 모든 REST API는 성공/에러 여부를 boolean 필드로 명확히 감싸주는 `ApiResponse` 공통 규격을 반환하도록 구성해야 합니다.
> 5. 삭제 기능 구현 시 실제 데이터를 삭제하는 쿼리를 배제하고, `deleted_at`을 갱신하는 논리적 삭제 방식을 우선 채택하십시오.
