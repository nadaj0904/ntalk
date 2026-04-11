당신은 10년차 프론트엔드 시니어 개발자입니다.

보험설계사 대상 마케팅 자료 서비스 웹사이트의 템플릿 목록 페이지를 구현해주세요.


- 다양한 디자인 템플릿을 **슬라이드 Grid UI** 로 보여주는 화면 구현
- 사용자가 템플릿을 탐색하고 선택할 수 있도록 한다.

- 템플릿 자료는 3개씩 5줄로 보여주고 그 이상은 페이지네이션 적용
UI 예시
<  1  2  3  4  >

- 검색조건은 고정 슬라이드 grid ui는 스크롤 적용
- 템플릿 자료는 다음 폴더에서 가져옵니다
- 약관은 static/img/product/kyobo/methods
- 상품요약서는 static/img/product/kyobo/summary/
- 사업방법서는 static/img/product/kyobo/terms/

- 템플릿 자료 썸네일 사이즈 368 x 350

- gamk_product_list.html 파일만 수정하고 다른 페이지들은 수정하지 않습니다.
- gamk_product_list.js 파일만 수정하고 다른 페이지들은 수정하지 않습니다.

보험 마케팅 자료 템플릿 목록에 대한 구현 계획을 작성했습니다. 주요 변경 사항:

검색 영역 상단 고정 (스크롤 시 위치 고정).
CSS Grid를 활용하여 1페이지당 3개씩 5줄(총 15개) 이미지를 표시하도록 구현.
15개를 초과하는 이미지를 위한 하단 페이지네이션 구현.
CSS 파일 수정 없이 gamk_product_list.html과 gamk_product_list.js 두 파일 내에서 인라인 스타일과 JS를 활용해 모든 요구사항 반영.



<!-- 검색조건 고정 스타일 -->
<!-- <section class="search-section" style="position: sticky; top: 60px; z-index: 40; background-color: #0b1120; padding: 12px 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 24px; margin-top: 8px;"> -->



슬라이드 자료를 아래폴더 경로에서 가져오는 것으로 수정해줘 
/static/img/product/kyobo/methods_thum
/static/img/product/kyobo/summary_thum
/static/img/product/kyobo/terms_thum  

- gamk_product_list.html 파일만 수정하고 다른 페이지들은 수정하지 않습니다.
- gamk_product_list.js 파일만 수정하고 다른 페이지들은 수정하지 않습니다.
