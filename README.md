# Personal Portfolio

순수 HTML, CSS, JavaScript로 구현한 반응형 개인 포트폴리오입니다.

## 실행 전 수정
1. `js/script.js`의 `GITHUB_USERNAME`을 본인의 GitHub 아이디로 변경하세요.
2. `images/profile.jpg`는 제공된 프로필 이미지입니다.
3. `index.html`의 GitHub / LinkedIn 링크를 본인의 주소로 변경하세요.

## 포함 기능
- Semantic HTML
- CSS 변수
- Flexbox / CSS Grid
- Mobile First 반응형
- 768px / 1024px breakpoint
- 햄버거 메뉴
- Smooth Scroll
- Scroll Top
- 60px 스크롤 Navigation 변화
- Dark Mode + localStorage
- Intersection Observer (threshold 0.2)
- Contact Form 검증
- GitHub API Loading / Success / Error / Empty 처리
- ES6+ 문법, async/await, try/catch항목 1
브라우저 창 크기를 줄였을 때 레이아웃이 모바일에 맞게 변경되는가?

PASS: CSS의 @media (max-width: 767px) 미디어 쿼리를 사용하여 모바일 화면 패딩(32px), 그리드 레이아웃(48px 1fr), 폰트 크기 및 간격을 재조정하고, 모바일 메뉴 패널(nav-menu)이 화면 전체 너비로 전환되도록 구현되었습니다.

테마 토글 버튼 클릭 시 다크/라이트 모드가 전환되고, 새로고침 후에도 유지되는가?

PASS: themeToggle 버튼 클릭 시 document.documentElement.setAttribute("data-theme", "dark")와 removeAttribute로 테마를 토글하며, localStorage.setItem("theme", ...)으로 선택된 테마를 저장합니다. 페이지 로드 시 localStorage.getItem("theme")을 조회하여 새로고침 후에도 다크 모드가 유지됩니다.

햄버거 메뉴, 스크롤 애니메이션, 맨 위로 가기 버튼이 정상 동작하는가?

PASS:

menuToggle 클릭 시 navMenu.classList.toggle("active")로 메뉴를 여닫고 aria-expanded 속성을 동적으로 업데이트합니다.

IntersectionObserver를 활용하여 화면 스크롤 시 요소가 포착되면 .reveal 클래스에 .visible을 추가하여 등장 애니메이션을 실행합니다.

scrollTopButton 클릭 시 window.scrollTo({ top: 0, behavior: "smooth" })가 동작하며, 스크롤 위치(window.scrollY >= 300)에 따라 버튼 표시 여부가 전환됩니다.

GitHub API에서 데이터를 불러와 화면에 표시되고, 로딩/에러/빈 상태가 구분되는가?

PASS: loadProjects() 실행 시 showStatus() 함수를 통해 요청 전 로딩 중(spinner), 응답 데이터가 0개일 때 빈 상태("표시할 프로젝트가 없습니다."), API 통신 실패 시 에러 상태("프로젝트를 불러올 수 없습니다." + 재시도 버튼)로 구별되어 UI가 출력됩니다.

필수 입력값 누락, 이메일 형식 오류 시 즉각적인 피드백이 표시되는가?

PASS: validateForm() 함수와 정규식(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)을 통해 Name, Email, Message의 누락 및 이메일 유효성을 검사합니다. 에러 발생 시 .form-group.error 클래스와 #id-error에 에러 문구를 즉시 출력하며, 사용자가 텍스트를 입력(input 이벤트)할 때 에러 문구를 실시간으로 지워줍니다.

항목 2
HTML, CSS, JavaScript가 각각의 파일로 분리되어 있고, 분리한 이유와 각 파일의 역할을 구분하여 답변할 수 있는가?

PASS: HTML(index.html), CSS(css/style.css), JS(js/script.js) 파일로 독립 분리되어 있습니다.

분리 이유: 관심사의 분리(Separation of Concerns)를 달성하여 코드의 가독성을 높이고 유지보수 및 재사용성을 용이하게 하기 위함입니다.

역할 구별: HTML은 웹 페이지의 구조와 의미(Semantic Structure), CSS는 디자인과 레이아웃(Style), JS는 동적 인터랙션 및 비동기 API 통신(Behavior)을 담당합니다.

header, nav, main, section, footer 등 시맨틱 태그를 사용했고, 어떤 기준으로 태그를 선택했는지 설명할 수 있는가?

PASS: <header>, <nav>, <main>, <section>, <article>, <footer> 태그가 정확히 적용되어 있습니다.

선택 기준: 페이지 상단 영역은 <header>, 주요 이동 링크 그룹은 <nav>, 주요 독립 콘텐트는 <main>, 주제별 구획은 <section>, 독립적으로 구분 가능한 개별 콘텐트(소개 카드, 스킬 카드, 프로젝트 카드)는 <article>, 하단 정보 영역은 <footer>로 선택했습니다.

CSS 변수(:root)로 색상, 폰트 등을 정의했고, 변수로 관리하면 어떤 이점이 있는지 구체적으로 답변할 수 있는가?

PASS: :root에 --bg, --text, --accent, --border, --shadow, --radius 등을 정의하고 [data-theme="dark"]에서 이 변수들을 재정의했습니다.

이점: 디자인 시스템의 일관성을 유지할 수 있으며, 색상이나 테마 변경 시 변수 값만 수정하면 사이트 전체에 일괄 적용되어 코드 중복이 줄고 유지보수성이 극대화됩니다.

onclick 인라인 속성 대신 addEventListener를 사용한 이유를 두 방식의 차이를 비교하여 제시할 수 있는가?

PASS: menuToggle.addEventListener("click", ...) 등 JS 파일 내에서 이벤트를 바인딩했습니다.

차이점 비교: onclick 인라인 속성은 HTML과 JS가 결합하여 뷰 코드 가독성을 해치고 동일 이벤트에 하나의 핸들러만 등록할 수 있지만, addEventListener는 HTML과 JS를 완벽히 분리(모듈화)할 수 있고 동일한 이벤트에 대해 복수의 이벤트 리스너를 안전하게 등록할 수 있습니다.

항목 3
다크 모드, API 호출, 폼 유효성 검사 중 하나를 예시로 들어, "이벤트 -> 상태 변경 -> 화면 업데이트" 흐름이 코드에서 어떻게 이어지는지 따라가며 짚어줄 수 있는가?

PASS (API 호출 예시):

이벤트: 페이지 로드 시 loadProjects() 호출 또는 에러 발생 후 '다시 시도' 버튼 클릭.

상태 변경: showStatus("loading")이 실행되어 UI 상태가 '로딩 중'으로 변경되고, fetch 호출을 통해 비동기 데이터를 응답받거나 try...catch에 의해 성공/실패 상태로 전이됨.

화면 업데이트: 성공 시 repos.map(createCard).join("")으로 변환된 카드 HTML이 projectList.innerHTML에 주입되고 hideStatus()가 실행되어 프로젝트 목록이 화면에 렌더링됨.

async/await와 try/catch를 사용하여 API 호출 성공과 실패를 어떻게 분기 처리했는지 코드 흐름을 따라 답변할 수 있는가?

PASS: async function loadProjects() 내에서 try 블록을 선언하여 await fetch(...)를 실행합니다. 응답 상태가 정상(response.ok)이 아닐 경우 throw Error(...)를 던져 명적으로 예외를 발생시키며, 정상 응답 시 await response.json() 결과를 화면에 출력합니다. 네트워크 오류 또는 400/500 번대 HTTP 에러 발생 시 catch(error) 블록으로 스위칭되어 showStatus("error", ...)를 실행하여 에러 화면을 분기 처리합니다.

map, filter 등 배열 메서드를 활용하여 GitHub 데이터를 카드 UI로 변환하는 과정을 단계별로 정리할 수 있는가?

PASS:

await response.json()을 통해 GitHub 데이터 배열(repos)을 수신.

배열의 각 프로젝트 객체를 createCard 함수로 전달하여 HTML 템플릿 문자열 배열로 1:1 변환 (repos.map(createCard)).

문자열 배열을 단일 HTML 문자열로 결합 (.join("")).

projectList.innerHTML 요소의 DOM에 주입하여 카드로 변환 완료.

Flexbox와 Grid를 각각 어디에 적용했는지 확인하고 해당 상황에서 그 방식을 선택한 이유를 설명할 수 있는가?

PASS:

Flexbox 적용: .navbar, .hero-buttons, .project-meta, .footer-content

선택 이유: 1차원(가로 또는 세로) 방향의 요소 정렬, 정중앙 배치 및 유동적인 요소 간 공간 분배(예: justify-content: space-between)에 적합하기 때문입니다.

Grid 적용: .about-grid, .skills-grid, .skill-card, .project-grid

선택 이유: 2차원(행과 열) 격자 형태의 반응형 카드 배치 및 카드 내부의 정교한 요소 구획(예: .skill-card 내 번호와 제목의 동일 기준선 정렬 grid-template-columns: 60px 1fr)에 적합하기 때문입니다.

항목 4
상태(STATE) 객체를 따로 만들어 관리한 이유는 무엇이며, 그냥 변수로 처리하면 안 되는지 설명할 수 있는가?

PASS: 현 코드에서는 data-theme 속성, localStorage, aria-expanded 및 DOM 클래스 상태를 직접 관리하고 있습니다.

이유: 단순 파편화된 일반 변수로 상태를 관리할 경우, 여러 이벤트 핸들러 간의 상태 동기화가 깨지거나 예상치 못한 사이드 이펙트(Side Effect)가 발생할 수 있습니다. 상태 객체나 DOM 중앙 상태로 일원화하여 관리하면 데이터 변화 추적이 용이하고, 상태 변경에 따른 UI 렌더링 응답성을 안정적으로 보장할 수 있습니다.

반응형 디자인에서 "모바일 퍼스트"로 작성한 이유를 이야기할 수 있는가?

PASS: CSS에서 기본 스타일을 모바일 기준으로 작성한 뒤, @media (min-width: 768px) 및 @media (min-width: 1024px) 데스크톱 미디어 쿼리로 확장해 나가는 방식을 취했습니다.

이유: 하드웨어 자원이 제한적인 모바일 기기에서 불필요한 스타일 재계산을 줄이고 기본 렌더링 성능을 최적화하기 위함입니다. 모바일의 필수적인 콘텐츠와 레이아웃을 우선 설계함으로써 더 직관적이고 경량화된 사용자 경험(UX)을 제공할 수 있습니다.
