# Role
너는 Spring Boot 전문가이자 프론트엔드 아키텍트야.

# Task
Thymeleaf 프론트엔드와 Spring Boot 백엔드 간의 효율적이고 보안성이 높은 'AJAX 통신 표준 아키텍처'를 설계하고 가이드를 작성해줘.

# Requirements
1. **Frontend**: Thymeleaf 상단에 CSRF 토큰을 배치하고, jQuery를 사용하여 모든 AJAX 요청 헤더에 CSRF 토큰을 자동으로 주입하는 전역 설정을 작성해줘.
2. **Backend**: 공통 응답 객체인 `ApiResponse<T>` 클래스를 설계해줘 (success 여부, 메시지, 데이터 포함).
3. **Common JS**: `sendAjax(url, method, data, successCallback, errorCallback)` 형태의 공통 함수를 만들어줘.
4. **Validation**: 백엔드에서 `@Valid`로 검증 실패 시 400 에러와 함께 에러 메시지를 JSON으로 리턴하고, 프론트에서 이를 alert으로 띄우는 흐름을 보여줘.
5. **Loading UI**: AJAX 요청 중에는 화면 클릭을 방지하는 투명 레이어와 로딩 바를 보여주는 로직을 포함해줘.

# Output Format
- CSRF 관련 HTML/JS 코드
- 공통 AJAX 공통 모듈 (JavaScript)
- Java 공통 응답 DTO 및 Controller 샘플 코드
- 설계사 UX를 고려한 에러 핸들링 가이드