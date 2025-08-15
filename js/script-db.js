// Versão corrigida do script.js para usar o banco de dados
import {
  fetchAllProducts,
  fetchFeaturedProducts,
  fetchPromotionProducts,
  fetchDonationProducts,
  fetchProductsByCategory,
  fetchProductsByType,
  searchProducts,
  createProduct,
  login,
  logout,
  register,
  getCurrentUser,
} from "./api.js"

// Funções de utilidade
function formatarPreco(preco) {
  return Number(preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function mostrarNotificacao(mensagem, tipo = "success") {
  const notificacao = document.getElementById("notification")
  const mensagemElement = document.getElementById("notification-message")

  if (!notificacao || !mensagemElement) return

  mensagemElement.textContent = mensagem
  notificacao.className = "notification " + tipo
  notificacao.style.display = "block"

  setTimeout(() => {
    notificacao.style.display = "none"
  }, 3000)
}

// Funções de acessibilidade
function inicializarAcessibilidade() {
  const botaoAumentarFonte = document.getElementById("increase-font")
  const botaoAltoContraste = document.getElementById("high-contrast")

  if (botaoAumentarFonte) {
    botaoAumentarFonte.addEventListener("click", () => {
      document.body.classList.toggle("larger-font")
      localStorage.setItem("larger-font", document.body.classList.contains("larger-font"))
    })
  }

  if (botaoAltoContraste) {
    botaoAltoContraste.addEventListener("click", () => {
      document.body.classList.toggle("high-contrast")
      localStorage.setItem("high-contrast", document.body.classList.contains("high-contrast"))
    })
  }

  // Aplicar configurações salvas
  if (localStorage.getItem("larger-font") === "true") {
    document.body.classList.add("larger-font")
  }

  if (localStorage.getItem("high-contrast") === "true") {
    document.body.classList.add("high-contrast")
  }
}

// Funções de tema escuro
function inicializarTemaEscuro() {
  const themeToggle = document.getElementById("theme-toggle")
  const themeIcon = themeToggle?.querySelector("i")

  if (!themeToggle) return

  // Verificar tema salvo
  const savedTheme = localStorage.getItem("theme") || "light"
  document.documentElement.setAttribute("data-theme", savedTheme)

  if (themeIcon) {
    themeIcon.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon"
  }

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"

    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)

    if (themeIcon) {
      themeIcon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon"
    }
  })
}

// Funções de menu responsivo
function inicializarMenuResponsivo() {
  const menuToggle = document.querySelector(".menu-toggle")
  const nav = document.querySelector("nav")

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active")
    })
  }
}

// Funções de exibição de produtos
function criarCardProduto(produto) {
  const precoDisplay =
    produto.product_type === "doacao"
      ? "Gratuito"
      : produto.promotion
        ? `<span class="original-price">${formatarPreco(produto.price)}</span> ${formatarPreco(produto.promotional_price)}`
        : formatarPreco(produto.price)

  const cardHTML = `
    <div class="product-card" data-id="${produto.id}" data-category="${produto.category}" data-type="${produto.product_type}">
      <div class="product-image">
        <img src="${produto.image_url || "https://via.placeholder.com/300?text=" + encodeURIComponent(produto.name)}" alt="${produto.name}">
      </div>
      <div class="product-info">
        <div class="product-type-badge ${produto.product_type}">${produto.product_type === "doacao" ? "Doação" : "Venda"}</div>
        <span class="product-category">${traduzirCategoria(produto.category)}</span>
        <h3 class="product-title">${produto.name}</h3>
        <p class="product-description">${produto.description}</p>
        <div class="product-location">
          <i class="fas fa-map-marker-alt"></i>
          ${produto.location || "Localização não informada"}
        </div>
        <div class="product-price ${produto.promotion ? "promotion" : ""}">
          ${precoDisplay}
        </div>
        <div class="product-contact">
          <i class="fas fa-phone"></i>
          ${produto.contact_info || "Contato não informado"}
        </div>
      </div>
    </div>
  `
  return cardHTML
}

function traduzirCategoria(categoria) {
  const categorias = {
    hortifruti: "Hortifruti",
    graos: "Grãos",
    carnes: "Carnes",
    laticinios: "Laticínios",
    bebidas: "Bebidas",
    limpeza: "Limpeza",
    outros: "Outros",
  }
  return categorias[categoria] || categoria
}

async function exibirProdutosDestaque() {
  const container = document.getElementById("featured-products-container")
  if (!container) return

  const result = await fetchFeaturedProducts()

  if (!result.success) {
    mostrarNotificacao(result.error, "error")
    return
  }

  const produtosDestaque = result.data

  container.innerHTML = ""
  produtosDestaque.forEach((produto) => {
    container.innerHTML += criarCardProduto(produto)
  })
}

async function exibirDoacoes() {
  const container = document.getElementById("donations-container")
  if (!container) return

  const result = await fetchDonationProducts()

  if (!result.success) {
    mostrarNotificacao(result.error, "error")
    return
  }

  const doacoes = result.data

  container.innerHTML = ""
  if (doacoes.length === 0) {
    container.innerHTML = '<p class="no-results">Nenhuma doação disponível no momento.</p>'
    return
  }

  doacoes.forEach((produto) => {
    container.innerHTML += criarCardProduto(produto)
  })
}

async function exibirPromocoes() {
  const container = document.getElementById("promotions-container")
  if (!container) return

  const result = await fetchPromotionProducts()

  if (!result.success) {
    mostrarNotificacao(result.error, "error")
    return
  }

  const produtosPromocao = result.data

  container.innerHTML = ""
  produtosPromocao.forEach((produto) => {
    container.innerHTML += criarCardProduto(produto)
  })
}

async function exibirTodosProdutos() {
  const container = document.getElementById("products-container")
  if (!container) return

  const result = await fetchAllProducts()

  if (!result.success) {
    mostrarNotificacao(result.error, "error")
    return
  }

  const produtos = result.data

  container.innerHTML = ""
  produtos.forEach((produto) => {
    container.innerHTML += criarCardProduto(produto)
  })
}

async function filtrarProdutosPorCategoria(categoria) {
  const container = document.getElementById("products-container")
  if (!container) return

  let result

  if (categoria === "todos") {
    result = await fetchAllProducts()
  } else {
    result = await fetchProductsByCategory(categoria)
  }

  if (!result.success) {
    mostrarNotificacao(result.error, "error")
    return
  }

  const produtosFiltrados = result.data

  container.innerHTML = ""
  produtosFiltrados.forEach((produto) => {
    container.innerHTML += criarCardProduto(produto)
  })
}

async function filtrarProdutosPorTipo(tipo) {
  const container = document.getElementById("products-container")
  if (!container) return

  let result

  if (tipo === "todos") {
    result = await fetchAllProducts()
  } else {
    result = await fetchProductsByType(tipo)
  }

  if (!result.success) {
    mostrarNotificacao(result.error, "error")
    return
  }

  const produtosFiltrados = result.data

  container.innerHTML = ""
  produtosFiltrados.forEach((produto) => {
    container.innerHTML += criarCardProduto(produto)
  })
}

function inicializarFiltros() {
  const botoesFiltro = document.querySelectorAll(".filter-btn")
  if (botoesFiltro.length === 0) return

  botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
      // Remover classe ativa de todos os botões do mesmo grupo
      const isCategory = botao.hasAttribute("data-category")
      const isType = botao.hasAttribute("data-type")

      if (isCategory) {
        document.querySelectorAll("[data-category]").forEach((b) => b.classList.remove("active"))
        botao.classList.add("active")
        const categoria = botao.getAttribute("data-category")
        filtrarProdutosPorCategoria(categoria)
      } else if (isType) {
        document.querySelectorAll("[data-type]").forEach((b) => b.classList.remove("active"))
        botao.classList.add("active")
        const tipo = botao.getAttribute("data-type")
        filtrarProdutosPorTipo(tipo)
      }
    })
  })
}

function inicializarBusca() {
  const botaoBusca = document.getElementById("search-button")
  const inputBusca = document.getElementById("search-input")

  if (!botaoBusca || !inputBusca) return

  botaoBusca.addEventListener("click", realizarBusca)
  inputBusca.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      realizarBusca()
    }
  })
}

async function realizarBusca() {
  const inputBusca = document.getElementById("search-input")
  const termoBusca = inputBusca.value.toLowerCase().trim()

  if (termoBusca === "") return

  const container = document.getElementById("products-container")
  if (container) {
    // Estamos na página de produtos
    const result = await searchProducts(termoBusca)

    if (!result.success) {
      mostrarNotificacao(result.error, "error")
      return
    }

    const produtosFiltrados = result.data

    container.innerHTML = ""

    if (produtosFiltrados.length === 0) {
      container.innerHTML = '<p class="no-results">Nenhum produto encontrado para sua busca.</p>'
    } else {
      produtosFiltrados.forEach((produto) => {
        container.innerHTML += criarCardProduto(produto)
      })
    }

    // Atualizar botões de filtro
    const botoesFiltro = document.querySelectorAll(".filter-btn")
    botoesFiltro.forEach((botao) => botao.classList.remove("active"))
    const todosCategoryBtn = document.querySelector('.filter-btn[data-category="todos"]')
    const todosTypeBtn = document.querySelector('.filter-btn[data-type="todos"]')
    if (todosCategoryBtn) todosCategoryBtn.classList.add("active")
    if (todosTypeBtn) todosTypeBtn.classList.add("active")
  } else {
    // Estamos na página inicial, redirecionar para a página de produtos
    sessionStorage.setItem("termoBusca", termoBusca)
    window.location.href = "produtos.html"
  }
}

// Funções de login e autenticação
function inicializarFormularioLogin() {
  // Inicializar abas de login/cadastro
  const authTabs = document.querySelectorAll(".auth-tab-btn")
  const authForms = document.querySelectorAll(".auth-form")

  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab")

      // Remover classe ativa de todas as abas e formulários
      authTabs.forEach((t) => t.classList.remove("active"))
      authForms.forEach((f) => f.classList.remove("active"))

      // Adicionar classe ativa à aba clicada e formulário correspondente
      tab.classList.add("active")
      document.getElementById(`${targetTab}-form-container`).classList.add("active")
    })
  })

  // Formulário de login
  const formLogin = document.getElementById("login-form")
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault()

      const email = document.getElementById("login-email").value
      const senha = document.getElementById("login-password").value

      const result = await login(email, senha)

      if (result.success) {
        mostrarNotificacao("Login realizado com sucesso!")
        setTimeout(() => {
          if (result.data.user_type === "admin") {
            window.location.href = "admin.html"
          } else {
            window.location.href = "index.html"
          }
        }, 1000)
      } else {
        mostrarNotificacao(result.error, "error")
      }
    })
  }

  // Formulário de cadastro
  const formRegister = document.getElementById("register-form")
  if (formRegister) {
    formRegister.addEventListener("submit", async (e) => {
      e.preventDefault()

      const email = document.getElementById("register-email").value
      const senha = document.getElementById("register-password").value
      const confirmarSenha = document.getElementById("register-confirm-password").value

      if (senha !== confirmarSenha) {
        mostrarNotificacao("As senhas não coincidem!", "error")
        return
      }

      const result = await register(email, senha, "cliente")

      if (result.success) {
        mostrarNotificacao("Cadastro realizado com sucesso! Faça login para continuar.")
        // Mudar para aba de login
        document.querySelector('.auth-tab-btn[data-tab="login"]').click()
        formRegister.reset()
      } else {
        mostrarNotificacao(result.error, "error")
      }
    })
  }
}

async function verificarAutenticacao() {
  const result = await getCurrentUser()
  const usuarioLogado = result.success ? result.data : null

  // Verificar se estamos na página de admin
  if (window.location.pathname.includes("admin.html")) {
    if (!usuarioLogado || usuarioLogado.user_type !== "admin") {
      window.location.href = "login.html"
      return
    }
  }

  // Atualizar botão de login/logout
  const btnLogin = document.querySelector(".btn-login")
  if (btnLogin) {
    if (usuarioLogado) {
      btnLogin.textContent = "Sair"
      btnLogin.href = "#"
      btnLogin.onclick = (e) => {
        e.preventDefault()
        fazerLogout()
      }
    } else {
      btnLogin.textContent = "Login"
      btnLogin.href = "login.html"
      btnLogin.onclick = null
    }
  }
}

async function fazerLogout() {
  const result = await logout()

  if (result.success) {
    mostrarNotificacao("Logout realizado com sucesso!")
    setTimeout(() => {
      window.location.href = "index.html"
    }, 1000)
  } else {
    mostrarNotificacao(result.error, "error")
  }
}

// Funções de botão de publicar
function inicializarBotaoPublicar() {
  const publishBtn = document.getElementById("publish-btn")
  if (!publishBtn) return

  publishBtn.addEventListener("click", async () => {
    const result = await getCurrentUser()
    if (!result.success) {
      mostrarNotificacao("Você precisa estar logado para publicar produtos", "error")
      setTimeout(() => {
        window.location.href = "login.html"
      }, 2000)
      return
    }

    window.location.href = "publicar.html"
  })
}

// Função para inicializar formulário de publicação
function inicializarFormularioPublicacao() {
  const formPublicar = document.getElementById("publish-form")
  if (!formPublicar) return

  const tipoSelect = document.getElementById("product-type")
  const precoGroup = document.getElementById("price-group")
  const precoInput = document.getElementById("product-price")

  // Controlar visibilidade do campo preço
  tipoSelect.addEventListener("change", () => {
    if (tipoSelect.value === "doacao") {
      precoGroup.style.display = "none"
      precoInput.required = false
      precoInput.value = "0"
    } else {
      precoGroup.style.display = "block"
      precoInput.required = true
      precoInput.value = ""
    }
  })

  formPublicar.addEventListener("submit", async (e) => {
    e.preventDefault()

    const result = await getCurrentUser()
    if (!result.success) {
      mostrarNotificacao("Você precisa estar logado para publicar", "error")
      return
    }

    const formData = new FormData(formPublicar)
    const produtoData = {
      name: formData.get("product-name"),
      description: formData.get("product-description"),
      product_type: formData.get("product-type"),
      price: formData.get("product-type") === "doacao" ? 0 : Number.parseFloat(formData.get("product-price")),
      promotional_price: null,
      category: formData.get("product-category"),
      location: formData.get("product-location"),
      contact_info: formData.get("product-contact"),
      image_url:
        formData.get("product-image") ||
        `https://via.placeholder.com/300?text=${encodeURIComponent(formData.get("product-name"))}`,
      featured: false,
      promotion: false,
      user_id: result.data.id,
      status: "ativo",
    }

    const createResult = await createProduct(produtoData)

    if (createResult.success) {
      mostrarNotificacao("Produto publicado com sucesso!")
      formPublicar.reset()
      setTimeout(() => {
        window.location.href = "produtos.html"
      }, 2000)
    } else {
      mostrarNotificacao(createResult.error, "error")
    }
  })
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar funcionalidades comuns
  inicializarAcessibilidade()
  inicializarMenuResponsivo()
  inicializarTemaEscuro()
  inicializarBotaoPublicar()
  verificarAutenticacao()

  // Fechar notificação
  const btnFecharNotificacao = document.getElementById("notification-close")
  if (btnFecharNotificacao) {
    btnFecharNotificacao.addEventListener("click", () => {
      document.getElementById("notification").style.display = "none"
    })
  }

  // Inicializar funcionalidades específicas de cada página
  if (
    window.location.pathname.includes("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname === ""
  ) {
    exibirProdutosDestaque()
    exibirDoacoes()
    inicializarBusca()
  } else if (window.location.pathname.includes("produtos.html")) {
    exibirTodosProdutos()
    inicializarFiltros()
    inicializarBusca()

    // Verificar se há termo de busca na sessão
    const termoBusca = sessionStorage.getItem("termoBusca")
    if (termoBusca) {
      document.getElementById("search-input").value = termoBusca
      realizarBusca()
      sessionStorage.removeItem("termoBusca")
    }
  } else if (window.location.pathname.includes("login.html")) {
    inicializarFormularioLogin()
  } else if (window.location.pathname.includes("publicar.html")) {
    inicializarFormularioPublicacao()
  } else if (window.location.pathname.includes("admin.html")) {
    // Código do admin será mantido como estava
  }
})
