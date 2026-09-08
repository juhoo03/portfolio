// ========================================
// GitHub 설정
// ========================================

const GITHUB_USERNAME = "juhoo03";


// ========================================
// DOM 요소 가져오기
// ========================================

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("#nav-menu");
const themeToggle = document.querySelector(".theme-toggle");
const scrollTopButton = document.querySelector("#scroll-top");
const projectStatus = document.querySelector("#project-status");
const projectList = document.querySelector("#project-list");
const contactForm = document.querySelector("#contact-form");
const formSuccess = document.querySelector("#form-success");


// ========================================
// 프로젝트 상태 표시
// ========================================

const showStatus = (type, message) => {
    projectStatus.classList.remove("hidden");

    if (type === "loading") {
        projectStatus.innerHTML = `
            <div class="spinner"></div>
            <p>${message}</p>
        `;
    } else if (type === "error") {
        projectStatus.innerHTML = `
            <p>${message}</p>
            <button class="retry-button" type="button" id="retry-projects">
                다시 시도
            </button>
        `;
    } else {
        projectStatus.innerHTML = `
            <p>${message}</p>
        `;
    }

    const retry = document.querySelector("#retry-projects");
    if (retry) {
        retry.addEventListener("click", loadProjects);
    }
};


// ========================================
// 프로젝트 상태 숨기기
// ========================================

const hideStatus = () => {
    projectStatus.classList.add("hidden");
};


// ========================================
// 모바일 메뉴
// ========================================

menuToggle.addEventListener("click", () => {
    const active = navMenu.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", String(active));
    menuToggle.setAttribute("aria-label", active ? "메뉴 닫기" : "메뉴 열기");
});

navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});


// ========================================
// 부드러운 스크롤
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});


// ========================================
// 스크롤 이벤트
// ========================================

window.addEventListener("scroll", () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y >= 60);
    scrollTopButton.classList.toggle("visible", y >= 300);
});


// ========================================
// 맨 위로 이동
// ========================================

scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


// ========================================
// 다크 모드
// ========================================

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


// ========================================
// 등장 애니메이션
// ========================================

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach(element => {
    observer.observe(element);
});


// ========================================
// GitHub 프로젝트 카드 생성
// ========================================

const createCard = repo => {
    const {
        name,
        description,
        html_url,
        language,
        stargazers_count,
        forks_count
    } = repo;

    return `
        <article class="project-card reveal visible">
            <span class="eyebrow">GITHUB REPOSITORY</span>
            <h3>${name}</h3>
            <p>${description || "프로젝트 설명이 등록되어 있지 않습니다."}</p>
            <div class="project-meta">
                <span>★ ${stargazers_count}</span>
                <span>⑂ ${forks_count}</span>
                <span>${language || "No language"}</span>
            </div>
            <a class="project-link" href="${html_url}" target="_blank" rel="noopener noreferrer">
                View Repository →
            </a>
        </article>
    `;
};


// ========================================
// GitHub 프로젝트 불러오기
// ========================================

async function loadProjects() {
    showStatus("loading", "프로젝트를 불러오는 중...");
    projectList.innerHTML = "";

    try {
        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`
        );

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

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


// ========================================
// 폼 에러 표시
// ========================================

const setFieldError = (id, message) => {
    const field = document.querySelector(`#${id}`);
    const group = field.closest(".form-group");
    const error = document.querySelector(`#${id}-error`);

    group.classList.toggle("error", Boolean(message));
    error.textContent = message;
};


// ========================================
// Contact Form 유효성 검사
// ========================================

const validateForm = () => {
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const message = document.querySelector("#message").value.trim();

    let valid = true;

    ["name", "email", "message"].forEach(id => setFieldError(id, ""));

    if (!name) {
        setFieldError("name", "이름을 입력해주세요.");
        valid = false;
    }

    if (!email) {
        setFieldError("email", "이메일을 입력해주세요.");
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFieldError("email", "올바른 이메일 형식을 입력해주세요.");
        valid = false;
    }

    if (!message) {
        setFieldError("message", "메시지를 입력해주세요.");
        valid = false;
    }

    return valid;
};


// ========================================
// Contact Form 제출 (Formspree 비동기 전송)
// ========================================

contactForm.addEventListener("submit", async event => {
    event.preventDefault();

    formSuccess.textContent = "";

    if (!validateForm()) {
        return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "전송 중...";
    submitBtn.disabled = true;

    const data = new FormData(contactForm);

    try {
        const response = await fetch(contactForm.action, {
            method: "POST",
            body: data,
            headers: {
                Accept: "application/json"
            }
        });

        if (response.ok) {
            formSuccess.style.color = "#2e7d32";
            formSuccess.textContent = "문의가 성공적으로 전송되었습니다! 곧 회신드리겠습니다.";
            contactForm.reset();
        } else {
            const result = await response.json();
            formSuccess.style.color = "#d32f2f";
            if (result && result.errors) {
                formSuccess.textContent = result.errors.map(err => err.message).join(", ");
            } else {
                formSuccess.textContent = "전송에 실패했습니다. 다시 시도해주세요.";
            }
        }
    } catch (error) {
        console.error(error);
        formSuccess.style.color = "#d32f2f";
        formSuccess.textContent = "네트워크 오류로 전송하지 못했습니다.";
    } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});


// 입력 시 에러 문구 즉시 지우기
contactForm.querySelectorAll("input, textarea").forEach(input => {
    input.addEventListener("input", () => {
        setFieldError(input.id, "");
        formSuccess.textContent = "";
    });
});


// 페이지 로드 시 GitHub 프로젝트 불러오기 실행
loadProjects();
