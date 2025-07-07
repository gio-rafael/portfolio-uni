// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener("DOMContentLoaded", function () {
  // Inicializar todas as funcionalidades
  initializeNavigation();
  initializeContactForm();
  initializeProjectDemos();
  initializeAnimations();
  initializeAccessibility();

  console.log("Portfólio carregado com sucesso!");
});

/**
 * Inicializa a navegação e destaque do menu ativo
 */
function initializeNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Remove classe active de todos os links
  navLinks.forEach((link) => {
    link.classList.remove("active");

    // Adiciona classe active ao link da página atual
    const linkHref = link.getAttribute("href");
    if (
      linkHref === currentPage ||
      (currentPage === "" && linkHref === "index.html")
    ) {
      link.classList.add("active");
    }
  });

  // Adiciona efeito de hover suave nos links de navegação
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });

    link.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });
}

/**
 * Inicializa e valida o formulário de contato
 */
function initializeContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (!contactForm) return; // Sai se não estiver na página de contato

  // Adiciona validação em tempo real aos campos
  const formInputs = contactForm.querySelectorAll("input, select, textarea");
  formInputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });

    input.addEventListener("input", function () {
      clearFieldError(this);
    });
  });

  // Manipula o envio do formulário
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    handleFormSubmission(this);
  });

  // Manipula o reset do formulário
  contactForm.addEventListener("reset", function () {
    clearAllErrors();
    hideSuccessMessage();
  });
}

/**
 * Valida um campo específico do formulário
 * @param {HTMLElement} field - Campo a ser validado
 */
function validateField(field) {
  const fieldName = field.name;
  const fieldValue = field.value.trim();
  let isValid = true;
  let errorMessage = "";

  // Validação por tipo de campo
  switch (fieldName) {
    case "nome":
      if (fieldValue.length < 2) {
        isValid = false;
        errorMessage = "Nome deve ter pelo menos 2 caracteres.";
      } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(fieldValue)) {
        isValid = false;
        errorMessage = "Nome deve conter apenas letras e espaços.";
      }
      break;

    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(fieldValue)) {
        isValid = false;
        errorMessage = "Por favor, insira um email válido.";
      }
      break;

    case "telefone":
      // Telefone é opcional, mas se preenchido deve ser válido
      if (fieldValue && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(fieldValue)) {
        isValid = false;
        errorMessage = "Formato: (11) 99999-9999";
      }
      break;

    case "assunto":
      if (!fieldValue) {
        isValid = false;
        errorMessage = "Por favor, selecione um assunto.";
      }
      break;

    case "mensagem":
      if (fieldValue.length < 10) {
        isValid = false;
        errorMessage = "Mensagem deve ter pelo menos 10 caracteres.";
      }
      break;

    case "concordo":
      if (!field.checked) {
        isValid = false;
        errorMessage = "Você deve concordar para continuar.";
      }
      break;
  }

  // Exibe ou remove erro
  if (!isValid) {
    showFieldError(field, errorMessage);
  } else {
    clearFieldError(field);
  }

  return isValid;
}

/**
 * Exibe erro em um campo específico
 * @param {HTMLElement} field - Campo com erro
 * @param {string} message - Mensagem de erro
 */
function showFieldError(field, message) {
  const errorElement = document.getElementById(field.name + "Error");
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }

  field.style.borderColor = "var(--error-color)";
  field.setAttribute("aria-invalid", "true");
}

/**
 * Remove erro de um campo específico
 * @param {HTMLElement} field - Campo para limpar erro
 */
function clearFieldError(field) {
  const errorElement = document.getElementById(field.name + "Error");
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }

  field.style.borderColor = "#e2e8f0";
  field.removeAttribute("aria-invalid");
}

/**
 * Remove todos os erros do formulário
 */
function clearAllErrors() {
  const errorElements = document.querySelectorAll(".form-error");
  errorElements.forEach((error) => {
    error.textContent = "";
    error.style.display = "none";
  });

  const formFields = document.querySelectorAll(
    ".form-input, .form-select, .form-textarea"
  );
  formFields.forEach((field) => {
    field.style.borderColor = "#e2e8f0";
    field.removeAttribute("aria-invalid");
  });
}

/**
 * Manipula o envio do formulário
 * @param {HTMLFormElement} form - Formulário a ser enviado
 */
function handleFormSubmission(form) {
  const formData = new FormData(form);
  let isFormValid = true;

  // Valida todos os campos obrigatórios
  const requiredFields = form.querySelectorAll("[required]");
  requiredFields.forEach((field) => {
    if (!validateField(field)) {
      isFormValid = false;
    }
  });

  if (!isFormValid) {
    showFormMessage("Por favor, corrija os erros antes de enviar.", "error");
    return;
  }

  // Simula envio do formulário
  showLoadingState(true);

  // Simula delay de envio (2 segundos)
  setTimeout(() => {
    showLoadingState(false);
    showSuccessMessage();
    form.reset();
    clearAllErrors();

    // Log dos dados do formulário (apenas para demonstração)
    console.log("Dados do formulário enviados:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
  }, 2000);
}

/**
 * Exibe/oculta estado de carregamento do formulário
 * @param {boolean} loading - Se deve mostrar loading
 */
function showLoadingState(loading) {
  const submitBtn = document.querySelector(".btn-primary");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnLoading = submitBtn.querySelector(".btn-loading");

  if (loading) {
    btnText.style.display = "none";
    btnLoading.style.display = "inline-flex";
    submitBtn.disabled = true;
  } else {
    btnText.style.display = "inline";
    btnLoading.style.display = "none";
    submitBtn.disabled = false;
  }
}

/**
 * Exibe mensagem de sucesso
 */
function showSuccessMessage() {
  const successElement = document.getElementById("formSuccess");
  const formElement = document.getElementById("contactForm");

  if (successElement && formElement) {
    formElement.style.display = "none";
    successElement.style.display = "block";

    // Rola para a mensagem de sucesso
    successElement.scrollIntoView({ behavior: "smooth" });

    // Oculta a mensagem após 10 segundos e mostra o formulário novamente
    setTimeout(() => {
      hideSuccessMessage();
    }, 10000);
  }
}

/**
 * Oculta mensagem de sucesso e mostra formulário
 */
function hideSuccessMessage() {
  const successElement = document.getElementById("formSuccess");
  const formElement = document.getElementById("contactForm");

  if (successElement && formElement) {
    successElement.style.display = "none";
    formElement.style.display = "flex";
  }
}

/**
 * Exibe mensagem temporária no formulário
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo da mensagem (success, error)
 */
function showFormMessage(message, type = "info") {
  // Remove mensagem anterior se existir
  const existingMessage = document.querySelector(".form-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Cria nova mensagem
  const messageElement = document.createElement("div");
  messageElement.className = `form-message form-message-${type}`;
  messageElement.textContent = message;
  messageElement.style.cssText = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 0.5rem;
        font-weight: 600;
        text-align: center;
        ${
          type === "error"
            ? "background-color: rgba(239, 68, 68, 0.1); color: var(--error-color); border: 1px solid var(--error-color);"
            : "background-color: rgba(16, 185, 129, 0.1); color: var(--success-color); border: 1px solid var(--success-color);"
        }
    `;

  // Insere mensagem antes do formulário
  const form = document.getElementById("contactForm");
  form.parentNode.insertBefore(messageElement, form);

  // Remove mensagem após 5 segundos
  setTimeout(() => {
    messageElement.remove();
  }, 5000);
}

/**
 * Inicializa demonstrações de projetos
 */
function initializeProjectDemos() {
  // Adiciona funcionalidade aos links de demo dos projetos
  const projectLinks = document.querySelectorAll(".project-link");

  projectLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Adiciona efeito visual de clique
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 150);
    });
  });
}

/**
 * Funções para demonstração de projetos
 */
function showProjectDemo(projectType) {
  const messages = {
    landing:
      "Demo da Landing Page: Uma página moderna e responsiva com animações suaves e design atrativo.",
  };

  alert(messages[projectType] || "Demo não disponível no momento.");
}

function showProjectCode(projectType) {
  const messages = {
    landing:
      "Código da Landing Page: HTML semântico, CSS com Flexbox/Grid e JavaScript",
  };

  alert(messages[projectType] || "Código não disponível no momento.");
}

/**
 * Inicializa animações e efeitos visuais
 */
function initializeAnimations() {
  // Animação de entrada para cards
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observa cards para animação de entrada
  const animatedElements = document.querySelectorAll(
    ".hobby-card, .course-card, .project-card, .academic-card, .language-card, .availability-item"
  );
  animatedElements.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = `opacity 0.6s ease ${
      index * 0.1
    }s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });

  // Animação das barras de progresso
  const progressBars = document.querySelectorAll(
    ".skill-progress, .level-progress"
  );
  progressBars.forEach((bar) => {
    const width = bar.style.width;
    bar.style.width = "0%";

    setTimeout(() => {
      bar.style.width = width;
    }, 500);
  });
}

/**
 * Inicializa recursos de acessibilidade
 */
function initializeAccessibility() {
  // Adiciona navegação por teclado melhorada
  document.addEventListener("keydown", function (e) {
    // Esc para fechar mensagens
    if (e.key === "Escape") {
      const formMessage = document.querySelector(".form-message");
      if (formMessage) {
        formMessage.remove();
      }
    }

    // Enter para ativar links com role="button"
    if (e.key === "Enter") {
      const focusedElement = document.activeElement;
      if (focusedElement.classList.contains("project-link")) {
        focusedElement.click();
      }
    }
  });

  // Adiciona indicadores de foco visíveis
  const focusableElements = document.querySelectorAll(
    "a, button, input, select, textarea"
  );
  focusableElements.forEach((element) => {
    element.addEventListener("focus", function () {
      this.style.outline = "2px solid var(--primary-color)";
      this.style.outlineOffset = "2px";
    });

    element.addEventListener("blur", function () {
      this.style.outline = "";
      this.style.outlineOffset = "";
    });
  });
}

/**
 * Utilitários gerais
 */

// Função para formatar telefone automaticamente
function formatPhone(input) {
  let value = input.value.replace(/\D/g, "");

  if (value.length >= 11) {
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (value.length >= 7) {
    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else if (value.length >= 3) {
    value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  }

  input.value = value;
}

// Adiciona formatação automática ao campo telefone
document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.getElementById("telefone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      formatPhone(this);
    });
  }
});

// Função para scroll suave (caso necessário)
function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Função para detectar tema do sistema (para futuras implementações)
function detectSystemTheme() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

// Log de informações do sistema (apenas para desenvolvimento)
console.log("Sistema detectado:", {
  userAgent: navigator.userAgent,
  language: navigator.language,
  theme: detectSystemTheme(),
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
});

// Tratamento de erros globais
window.addEventListener("error", function (e) {
  console.error("Erro detectado:", e.error);
  // Em produção, aqui seria enviado para um serviço de monitoramento
});

// Aviso sobre JavaScript desabilitado (para usuários sem JS)
document.documentElement.classList.add("js-enabled");
