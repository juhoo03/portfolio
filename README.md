# 📁 Portfolio Web Project


## 📋 평가 항목별 주요 코드 및 구현 방식

### 1. 웹사이트 기능 및 반응형 UX

* **모바일 반응형 레이아웃**
  * **설명**: 미디어 쿼리를 활용하여 화면 가로 폭이 767px 이하인 모바일 기기 접속 시 카드 여백, 그리드 레이아웃 비율, 폰트 크기 등을 자동으로 재조정합니다.
  * **코드 (`css/style.css`)**:
    ```css
    /* 모바일 기기(767px 이하) 레이아웃 재조정 */
    @media (max-width: 767px) {
        .skill-card {
            min-height: 250px;
            padding: 32px;
            grid-template-columns: 48px 1fr;
        }
        .skill-card h3 {
            font-size: 1.4rem;
        }
    }
    ```

* **다크/라이트 모드 전환 및 저장**
  * **설명**: 클릭 시 `data-theme="dark"` 속성을 토글하며, `localStorage`를 활용하여 테마 상태를 저장하므로 페이지 새로고침 시에도 테마가 그대로 유지됩니다.
  * **코드 (`js/script.js`)**:
    ```javascript
    // 저장된 테마 상태 불러오기 및 적용
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        themeToggle.textContent = "☀️";
    }

    // 테마 토글 버튼 이벤트 리스너
    themeToggle.addEventListener("click", () => {
        const dark = document.documentElement.getAttribute("data-theme") === "dark";
        if (dark) {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
            themeToggle.textContent = "🌙";
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
            themeToggle.textContent = "☀️️";
        }
    });
    ```

* **인터랙션 및 동적 사용자 경험**
  * **설명**: 햄버거 메뉴 토글 및 접근성 속성(`aria-expanded`) 업데이트, 부드러운 앵커 스크롤, `IntersectionObserver`를 활용한 화면 등장 애니메이션, 상단 이동 버튼을 구현했습니다.
  * **코드 (`js/script.js`)**:
    ```javascript
    // 모바일 메뉴 토글 및 접근성 속성 반영
    menuToggle.addEventListener("click", () => {
        const active = navMenu.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", String(active));
    });

    // 화면 진입 감지 및 등장 애니메이션 실행
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

    // 최상단 이동 버튼
    scrollTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    ```

* **GitHub API 상태 구분 (로딩 / 에러 / 빈 데이터)**
  * **설명**: 서로 다른 소프트웨어 애플리케이션 간에 데이터와 기능을 규격화된 방식으로 주고받기 위한 방식
  * API 요청 상태에 따라 스피너 UI(로딩), 데이터 미존재 안내(빈 데이터), 통신 실패 시 에러 메시지 및 재시도 버튼(에러)을 명확하게 분기 처리하여 출력합니다.
  * **코드 (`js/script.js`)**:
    ```javascript
    const showStatus = (type, message) => {
        projectStatus.classList.remove("hidden");
        if (type === "loading") {
            projectStatus.innerHTML = `<div class="spinner"></div><p>${message}</p>`;
        } else if (type === "error") {
            projectStatus.innerHTML = `
                <p>${message}</p>
                <button class="retry-button" type="button" id="retry-projects">다시 시도</button>
            `;
        } else {
            projectStatus.innerHTML = `<p>${message}</p>`;
        }
        
        const retry = document.querySelector("#retry-projects");
        if (retry) retry.addEventListener("click", loadProjects);
    };
    ```

* **폼 입력 검증 및 실시간 피드백**
  * **설명**: 이름/메시지 필수 입력 여부 및 이메일 정규식을 통한 형식 검증을 진행합니다. 예외 발생 시 에러 메시지를 표시하며, 입력 이벤트 발생 시 에러 문구를 실시간으로 지워줍니다.
  * **코드 (`js/script.js`)**:
    ```javascript
    const validateForm = () => {
        const name = document.querySelector("#name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const message = document.querySelector("#message").value.trim();
        let valid = true;

        if (!name) { setFieldError("name", "이름을 입력해주세요."); valid = false; }
        if (!email) {
            setFieldError("email", "이메일을 입력해주세요.");
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setFieldError("email", "올바른 이메일 형식을 입력해주세요.");
            valid = false;
        }
        if (!message) { setFieldError("message", "메시지를 입력해주세요."); valid = false; }

        return valid;
    };
    ```

---

### 2. 코드 구조 및 설계

* **파일 분리 및 독립성 확보 (Separation of Concerns)**
  * **구조 (`index.html`)**:
    ```html
    <link rel="stylesheet" href="css/style.css">
    <script src="js/script.js" defer></script>
    ```
  * **역할 분담**:
    * `index.html`: 페이지의 구조 및 시맨틱 레이아웃 정의 (마크업)
    * `css/style.css`: 테마, 반응형 레이아웃 및 스타일 시스템 구축 (색상, 폰트, 반응형 그리드, 애니메이션 등)
    * `js/script.js`: 동적 인터랙션, API 비동기 통신, 상태 관리 (동적 로직, 기능)

* **시맨틱 태그 (Semantic HTML)**
  * **설명**: 웹 접근성 향상 및 SEO 최적화를 위해 의미에 부합하는 시맨틱 태그를 명확히 구분하여 적용했습니다.
  * **`<header>` (도입부 및 머리말)**
  * **역할**: 사이트 상단 로고, 제목, 검색창, 주요 내비게이션 등 문서 전체의 서두 영역을 정의합니다.
  * **적용 위치**: 최상단 로고 및 내비게이션 바를 포함하는 영역 (`.site-header`).

* **`<nav>` (주요 탐색 메뉴)**
  * **역할**: 사이트 내부 또는 외부의 핵심 이동 링크들을 그룹화하는 영역입니다.
  * **적용 위치**: 상단 네비게이션 메뉴 목록 (`.navbar`).

* **`<main>` (독자적 주요 콘텐츠)**
  * **역할**: 문서 내에서 반복되지 않고 해당 페이지에서만 다루는 유일하고 핵심적인 본문 콘텐츠를 담습니다.
  * **적용 위치**: 문서 내 단 하나만 존재하며, 서브 섹션 전체를 감싸는 영역.

* **`<section>` (주제별 구획)**
  * **역할**: 논문의 장(Chapter)처럼 하나의 명확한 주제로 묶이는 독립적인 단락 구획을 정의합니다.
  * **적용 위치**: `#hero`, `#about`, `#skills`, `#projects`, `#contact` 등 주제별 구분 구획.

* **`<footer>` (최하단 및 꼬리말)**
  * **역할**: 저작권 정보(Copyright), 작성자 정보, SNS 링크 등 하단 부가 정보를 정의합니다.
  * **적용 위치**: 사이트 최하단 정보 영역 (`.site-footer`).

---
  * **코드 (`index.html`)**:
    ```html
    <header class="site-header">
        <nav class="navbar" aria-label="주요 메뉴">...</nav>
    </header>
    <main>
        <section id="hero" class="hero section">...</section>
        <section id="about" class="section">
            <article class="about-content">...</article>
        </section>
    </main>
    <footer class="site-footer">...</footer>
    ```

* **CSS 변수 (`:root`) 기반 디자인 시스템**
  * **설명**: 테마 컬러, 여백, 그림자 요소를 전역 변수로 관리하여 일관된 디자인 시스템을 유지하고 테마 전환 로직을 가볍게 유지합니다.
  * **코드 (`css/style.css`)**:
    ```css
    :root {
        --bg: #fff;
        --text: #171717;
        --accent: #111;
        --border: #ddd;
        --shadow: 0 15px 40px rgba(0, 0, 0, .08);
    }

    [data-theme="dark"] {
        --bg: #111;
        --text: #f5f5f5;
        --accent: #fff;
        --border: #333;
    }
    ```

* **`addEventListener` 이벤트 바인딩**
#### 1. `addEventListener` 선택 이유

1. **관심사의 분리 (Separation of Concerns)**
   * HTML 마크업은 문서의 시맨틱 구조만 담당하고, 동적 동작 및 이벤트 로직은 JavaScript 파일에 독립되도록 분리하여 코드의 가독성과 유지보수성을 극대화했습니다.
2. **이벤트 핸들러 중복 등록 보장**
   * 하나의 DOM 요소에 동일한 이벤트(예: `click`)가 발생하더라도 여러 개의 이벤트 리스너를 안전하게 개별 바인딩하여 동시 실행할 수 있습니다.
3. **정교한 이벤트 제어 및 메모리 관리**
   * 필요에 따라 `removeEventListener`를 통해 특정 리스너만 메모리에서 해제하거나, 이벤트 전파 단계(Capturing / Bubbling)를 제어할 수 있습니다.

---

#### 2. `onclick`과 `addEventListener` 상세 비교

| 비교 항목 | `onclick` 인라인 속성 | `addEventListener` 메서드 |
| :--- | :--- | :--- |
| **코드 구조** | HTML 태그 내에 스크립트 작성 (`<button onclick="...">`) | JavaScript 파일 내에서 DOM 선택 후 바인딩 |
| **관심사 분리** | ❌ HTML과 JS가 결합되어 유지보수 불리 | ⭕️ HTML(구조)과 JS(로직)의 완전한 분리 |
| **다중 이벤트 등록** | ❌ 마지막으로 할당된 함수로 덮어쓰기 발생 | ⭕️ 동일 이벤트에 대해 복수의 함수 독립 실행 가능 |
| **이벤트 해제** | `element.onclick = null`로 전체 초기화만 가능 | `removeEventListener`를 통한 선택적 해제 가능 |
| **이벤트 전파 제어** | 버블링(Bubbling) 단계에서만 작동 | 캡처링/버블링 단계 선택 및 제어 가능 (`options`) |

---
---

### 3. 비동기 처리 및 데이터 가공


### 🔄 "이벤트 ➔ 상태 변경 ➔ 화면 업데이트" 흐름 분석 (다크 모드 예시)

---

#### 1. 단계별 실행 흐름

1. **이벤트 (Event)**
   * 사용자가 상단 테마 토글 버튼(`themeToggle`)을 클릭하면 `addEventListener("click", ...)` 리스너가 작동합니다.
2. **상태 변경 (State Change)**
   * `document.documentElement` 요소의 `data-theme` 속성을 조회하여 라이트/다크 모드 상태를 스위칭합니다.
   * `localStorage.setItem("theme", ...)`을 호출하여 변경된 상태를 저장소에 저장, 새로고침 후에도 상태가 유지되도록 처리합니다.
3. **화면 업데이트 (UI Update)**
   * `themeToggle.textContent`를 변경하여 버튼의 아이콘(☀️ / 🌙)을 업데이트합니다.
   * 최상단 DOM에 부여된 `data-theme="dark"` 속성을 감지하여 CSS 선택자가 반응하고, `:root`에 선언된 전역 색상 변수가 교체되면서 사이트 전체 테마 컬러가 일괄 렌더링됩니다.

---

#### 2. 프로젝트 내 핵심 구현 코드

##### **A. 스크립트 로직 (`js/script.js`)**
```javascript
// [1. 이벤트] 테마 토글 버튼 클릭 이벤트 바인딩
themeToggle.addEventListener("click", () => {
    // [2. 상태 변경] 현재 다크 모드 적용 여부 확인
    const dark = document.documentElement.getAttribute("data-theme") === "dark";

    if (dark) {
        // 라이트 모드로 상태 전환 및 저장
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        
        // [3. 화면 업데이트] 버튼 아이콘 변경
        themeToggle.textContent = "🌙";
    } else {
        // 다크 모드로 상태 전환 및 저장
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        
        // [3. 화면 업데이트] 버튼 아이콘 변경
        themeToggle.textContent = "☀️";
    }
});
* **`async/await` 및 `try/catch` 기반 예외 처리**
  * **설명**: GitHub API 호출 시 `async/await` 문법을 적용하고, `try...catch` 구문을 통해 비동기 통신 성공/실패(네트워크 에러, HTTP 에러)를 명확하게 분기하여 안정성을 확보했습니다.
  * **코드 (`js/script.js`)**:
    ```javascript
    async function loadProjects() {
        showStatus("loading", "프로젝트를 불러오는 중...");
        try {
            const response = await fetch(`[https://api.github.com/users/$](https://api.github.com/users/$){GITHUB_USERNAME}/repos?sort=updated&per_page=30`);
            if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
            
            const repos = await response.json();
            if (repos.length === 0) {
                showStatus("empty", "표시할 프로젝트가 없습니다.");
                return;
            }

            projectList.innerHTML = repos.map(createCard).join("");
            hideStatus();
        } catch (error) {
            console.error(error);
            showStatus("error", "프로젝트를 불러올 수 없습니다.");
        }
    }
    ```

* **`map` 메서드를 활용한 동적 카드 UI 변환**
  * **설명**: 수신한 저장소 객체 배열(`repos`)을 `map` 메서드로 순회하며 HTML 카드 템플릿 문자열로 가공하고, `join("")`으로 결합하여 DOM에 주입합니다.
  * **코드 (`js/script.js`)**:
    ```javascript
    projectList.innerHTML = repos.map(createCard).join("");
    ```

* **Flexbox 및 Grid 적재적소 활용**
  * **Flexbox (1차원 정렬)**: 네비게이션 바, 버튼 그룹, 푸터 등 단일 방향 선형 정렬 및 요소 간 공간 배분에 적용했습니다.
    ```css
    .navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    ```
  * **Grid (2차원 정렬)**: 스킬/프로젝트 카드 격자 구조 및 카드 내부 구획 정렬에 적용했습니다.
    ```css
    .skills-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
    }
    .skill-card {
        display: grid;
        grid-template-columns: 60px 1fr;
    }
    ```

---
---

### 4. 반응형 및 상태 관리 전략

* **상태 (State) 일원화 관리**
  * **설명**: 다크 모드(`data-theme`), 메뉴 노출 여부(`aria-expanded`, `.active`), 로딩/에러 UI 상태를 특정 속성 및 데이터에 일원화하여 불필요한 부작용(Side Effect)을 방지합니다.

* **모바일 퍼스트 (Mobile-First) 전략**
  * **설명**: 모바일 기기의 기본 스타일을 우선 작성한 후, 미디어 쿼리(`min-width`)를 사용하여 데스크톱 레이아웃으로 확장 적용함으로써 기기 자원 소모를 최적화했습니다.
  * **코드 (`css/style.css`)**:
    ```css
    /* 기본 스타일 (Mobile) */
    .section { padding: 80px 0; }

    /* 태블릿 기기 확장 */
    @media (min-width: 768px) {
        .about-grid { grid-template-columns: .8fr 1.2fr; }
    }

    /* 데스크톱 기기 확장 */
    @media (min-width: 1024px) {
        .section { padding: 120px 0; }
    }
    ```
