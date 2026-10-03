# 📁 Portfolio Web Project

전기정보공학 및 웹 기술을 바탕으로 제작한 개인 포트폴리오 웹사이트입니다.  
사용자 친화적인 UI/UX, 반응형 레이아웃, 다크 모드, GitHub API 연동, Formspree 문의 전송 기능을 포함하고 있습니다.

---

## 📋 평가 항목별 주요 코드 및 구현 설명

### 1. 웹사이트 기능 및 반응형 UX

* **모바일 반응형 레이아웃**
  * **설명**: 브라우저 창 크기가 767px 이하로 줄어들면 모바일 환경에 맞춰 카드 여백, 그리드 레이아웃, 폰트 크기 및 간격을 재조정합니다.
  * **코드 (`css/style.css`)**:
    ```css
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
  * **설명**: 테마 토글 버튼 클릭 시 `data-theme="dark"` 속성을 토글하며, 선택한 상태를 `localStorage`에 저장하여 새로고침 후에도 유지됩니다.
  * **코드 (`js/script.js`)**:
    ```javascript
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        themeToggle.textContent = "☀️";
    }

    themeToggle.addEventListener("click", () => {
        const dark = document.documentElement.getAttribute("data-theme") === "dark";
        if (dark) {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
            themeToggle.textContent = "🌙";
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
            themeToggle.textContent = "☀️";
        }
    });
    ```

* **인터랙션 (메뉴, 부드러운 스크롤, 스크롤 애니메이션, 맨 위로 가기)**
  * **설명**: 햄버거 메뉴 토글, 부드러운 앵커 스크롤, `IntersectionObserver` 기반의 등장 애니메이션, 스크롤 위치 기반 맨 위로 가기 버튼을 구현했습니다.
  * **코드 (`js/script.js`)**:
    ```javascript
    // 햄버거 메뉴 토글
    menuToggle.addEventListener("click", () => {
        const active = navMenu.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", String(active));
    });

    // 부드러운 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const target = document.querySelector(link.getAttribute("href"));
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    // 등장 애니메이션 (IntersectionObserver)
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    ```

* **GitHub API 상태 구분 (로딩 / 에러 / 빈 상태)**
  * **설명**: API 요청 중에는 스피너, 데이터가 없을 땐 안내 문구, 오류 발생 시 재시도 버튼을 동적으로 출력합니다.
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

* **폼 입력 유효성 검사 및 실시간 피드백**
  * **설명**: 이름, 이메일 필수 입력값 및 이메일 정규식 검사를 수행하며, 오류 시 즉각 피드백을 표시하고 입력 시 에러를 지워줍니다.
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

* **파일 분리 및 역할 (Separation of Concerns)**
  * **구조 (`index.html`)**: HTML 스크립트 연결
    ```html
    <link rel="stylesheet" href="css/style.css">
    <script src="js/script.js" defer></script>
    ```
  * **역할 구별**:
    * `index.html`: 웹 페이지의 구조와 의미적 구획 (뼈대)
    * `css/style.css`: 레이아웃, 색상, 애니메이션 등 시각적 디자인 (인테리어)
    * `js/script.js`: 동적 이벤트, API 통신, 상태 관리 (전기/기능)

* **시맨틱 태그 (Semantic HTML)**
  * **설명**: 웹 접근성과 검색 엔진 최적화(SEO)를 위해 의미에 맞는 태그를 적절히 사용했습니다.
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

* **CSS 변수 (`:root`)**
  * **설명**: 색상, 여백, 그림자 등을 변수화하여 테마 전환 및 유지보수를 용이하게 구축했습니다.
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

* **`addEventListener` 사용**
  * **설명**: HTML 태그에 직접 이벤트 속성을 넣는 인라인 방식(`onclick`) 대신 JS 파일에서 `addEventListener`를 등록하여 HTML과 JS를 완벽히 분리했습니다.

---

### 3. 비동기 처리 및 데이터 가공

* **`async/await` 및 `try/catch` 예외 처리**
  * **설명**: API 요청 성공 및 실패(네트워크 오류, HTTP 400/500 에러) 상황을 명확히 분기하여 안정적으로 예외를 처리합니다.
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

* **`map` 메서드를 활용한 카드 UI 변환**
  * **설명**: GitHub에서 전달받은 저장소 데이터 배열(`repos`)을 `map`을 통해 카카오 형태의 HTML 문자열 배열로 가공하고, `join("")`으로 병합하여 화면에 동적 렌더링합니다.
  * **코드 (`js/script.js`)**:
    ```javascript
    projectList.innerHTML = repos.map(createCard).join("");
    ```

* **Flexbox 및 Grid 적재적소 활용**
  * **Flexbox (1차원 정렬)**: 네비게이션 바, 버튼 그룹, 푸터 등 선형 배치 및 균등 정렬에 적용.
    ```css
    .navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    ```
  * **Grid (2차원 정렬)**: 스킬 및 프로젝트 카드 격자 구조, 카드 내부 번호-제목 정렬에 적용.
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

### 4. 반응형 및 상태 관리 전략

* **상태 (State) 관리**
  * **설명**: 테마(`data-theme`), 메뉴 열림(`aria-expanded`, `.active`), 로딩/에러 UI 상태를 일원화하여 예기치 못한 데이터 불일치 및 UI 오류를 방지합니다.

* **모바일 퍼스트 (Mobile-First) 전략**
  * **설명**: 모바일 기준 기본 스타일을 가장 먼저 작성하고, `@media (min-width: 768px)` 및 `@media (min-width: 1024px)` 확장 매체 쿼리를 적용하여 기기 자원을 효율적으로 사용합니다.
  * **코드 (`css/style.css`)**:
    ```css
    /* 1. 기본 스타일 (Mobile) */
    .section { padding: 80px 0; }

    /* 2. Tablet */
    @media (min-width: 768px) {
        .about-grid { grid-template-columns: .8fr 1.2fr; }
    }

    /* 3. Desktop */
    @media (min-width: 1024px) {
        .section { padding: 120px 0; }
    }
    ```
