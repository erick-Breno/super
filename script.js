// Dados de usuários para simulação de login
const users = [
  { email: "admin@seagrima.com", senha: "admin123", tipo: "admin" },
  { email: "usuario@seagrima.com", senha: "user123", tipo: "cliente" },
]

// Cidades do Maranhão para padronização
const cidadesMaranhao = [
  "Açailândia - MA",
  "Imperatriz - MA",
  "São Luís - MA",
  "Caxias - MA",
  "Codó - MA",
  "Timon - MA",
  "Bacabal - MA",
  "Balsas - MA",
  "Santa Inês - MA",
  "Pinheiro - MA",
  "Pedreiras - MA",
  "Barra do Corda - MA",
  "Chapadinha - MA",
  "São José de Ribamar - MA",
  "Paço do Lumiar - MA",
  "teste — xique-xique",
]

// Função para obter cidade aleatória
function obterCidadeAleatoria() {
  return cidadesMaranhao[Math.floor(Math.random() * cidadesMaranhao.length)]
}

// Array de produtos (inicialmente vazio)
let produtos = []

// Verificar se já existem produtos no localStorage
if (localStorage.getItem("produtos")) {
  produtos = JSON.parse(localStorage.getItem("produtos"))
}

// Algoritmo para definir produtos em destaque
function algoritmoDestaque() {
  if (produtos.length === 0) return

  // Primeiro, remove destaque de todos os produtos
  produtos.forEach((produto) => (produto.destaque = false))

  // Critérios para destaque (pontuação)
  const produtosComPontuacao = produtos.map((produto) => {
    let pontuacao = 0

    // Produtos de doação têm prioridade (40 pontos)
    if (produto.tipo === "doacao") {
      pontuacao += 40
    }

    // Produtos com promoção têm prioridade (30 pontos)
    if (produto.promocao) {
      pontuacao += 30
    }

    // Produtos mais recentes têm prioridade (até 25 pontos)
    const diasDesdePublicacao = (Date.now() - new Date(produto.dataPublicacao).getTime()) / (1000 * 60 * 60 * 24)
    if (diasDesdePublicacao <= 1) pontuacao += 25
    else if (diasDesdePublicacao <= 3) pontuacao += 20
    else if (diasDesdePublicacao <= 7) pontuacao += 15
    else if (diasDesdePublicacao <= 14) pontuacao += 10

    // Produtos de hortifruti têm leve prioridade (10 pontos)
    if (produto.categoria === "hortifruti") {
      pontuacao += 10
    }

    // Adiciona um fator aleatório (0-15 pontos) para variedade
    pontuacao += Math.random() * 15

    return { ...produto, pontuacao }
  })

  // Ordena por pontuação (maior para menor)
  produtosComPontuacao.sort((a, b) => b.pontuacao - a.pontuacao)

  // Seleciona os top 3-5 produtos para destaque
  const numDestaques = Math.min(Math.floor(Math.random() * 3) + 3, produtos.length) // 3 a 5 produtos

  for (let i = 0; i < numDestaques; i++) {
    const produtoOriginal = produtos.find((p) => p.id === produtosComPontuacao[i].id)
    if (produtoOriginal) {
      produtoOriginal.destaque = true
    }
  }

  // Salva no localStorage
  localStorage.setItem("produtos", JSON.stringify(produtos))
}

// Executar algoritmo de destaque periodicamente
function verificarEAtualizarDestaques() {
  const ultimaAtualizacao = localStorage.getItem("ultimaAtualizacaoDestaques")
  const agora = new Date().getTime()
  const seisHoras = 6 * 60 * 60 * 1000 // 6 horas em millisegundos

  if (!ultimaAtualizacao || agora - Number.parseInt(ultimaAtualizacao) > seisHoras) {
    algoritmoDestaque()
    localStorage.setItem("ultimaAtualizacaoDestaques", agora.toString())
  }
}

// Funções de utilidade
function formatarPreco(preco) {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function formatarData(dataISO) {
  const data = new Date(dataISO)
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
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
  }, 4000)
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

// Função para abrir modal de detalhes do produto
function abrirModalProduto(id) {
  const produto = produtos.find((p) => p.id === id)
  if (!produto) return

  const precoDisplay =
    produto.tipo === "doacao"
      ? "Gratuito"
      : produto.promocao
        ? `<span class="original-price">${formatarPreco(produto.preco)}</span> ${formatarPreco(produto.precoPromocional)}`
        : formatarPreco(produto.preco)

  const modalHTML = `
    <div class="product-modal" id="product-modal">
      <div class="product-modal-content">
        <div class="product-modal-header">
          <img src="${produto.imagem}" alt="${produto.nome}">
          <span class="close-product-modal" onclick="fecharModalProduto()">&times;</span>
        </div>
        <div class="product-modal-body">
          <div class="product-modal-meta">
            <div class="product-type-badge ${produto.tipo}">${produto.tipo === "doacao" ? "Doação" : "Venda"}</div>
            <span class="product-category">${traduzirCategoria(produto.categoria)}</span>
          </div>
          
          <h2 class="product-modal-title">${produto.nome}</h2>
          <p class="product-modal-description">${produto.descricao}</p>
          
          <div class="product-modal-details">
            <div class="product-detail-item">
              <i class="fas fa-map-marker-alt"></i>
              <div class="product-detail-content">
                <h4>Localização</h4>
                <p>${produto.localizacao}</p>
              </div>
            </div>
            
            <div class="product-detail-item">
              <i class="fas fa-user"></i>
              <div class="product-detail-content">
                <h4>Publicado por</h4>
                <p>${produto.usuario}</p>
              </div>
            </div>
            
            <div class="product-detail-item">
              <i class="fas fa-clock"></i>
              <div class="product-detail-content">
                <h4>Data de Publicação</h4>
                <p>${formatarData(produto.dataPublicacao)}</p>
              </div>
            </div>
            
            <div class="product-detail-item">
              <i class="fas fa-tag"></i>
              <div class="product-detail-content">
                <h4>Categoria</h4>
                <p>${traduzirCategoria(produto.categoria)}</p>
              </div>
            </div>
          </div>
          
          <div class="product-modal-price">
            <div class="price-label">${produto.tipo === "doacao" ? "Disponível para" : "Preço"}</div>
            <div class="price-value">${precoDisplay}</div>
          </div>
          
          <div class="product-modal-contact">
            <h4>Entre em contato</h4>
            <p><i class="fas fa-phone"></i> ${produto.contato}</p>
          </div>
        </div>
      </div>
    </div>
  `

  // Remove modal existente se houver
  const modalExistente = document.getElementById("product-modal")
  if (modalExistente) {
    modalExistente.remove()
  }

  // Adiciona o modal ao body
  document.body.insertAdjacentHTML("beforeend", modalHTML)

  // Mostra o modal
  const modal = document.getElementById("product-modal")
  modal.style.display = "block"

  // Fecha modal ao clicar fora dele
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      fecharModalProduto()
    }
  })
}

// Função para fechar modal
function fecharModalProduto() {
  const modal = document.getElementById("product-modal")
  if (modal) {
    modal.style.display = "none"
    setTimeout(() => modal.remove(), 300)
  }
}

// Funções de exibição de produtos
function criarCardProduto(produto) {
  const precoDisplay =
    produto.tipo === "doacao"
      ? "Gratuito"
      : produto.promocao
        ? `<span class="original-price">${formatarPreco(produto.preco)}</span> ${formatarPreco(produto.precoPromocional)}`
        : formatarPreco(produto.preco)

  const cardHTML = `
    <article class="product-card" data-id="${produto.id}" data-category="${produto.categoria}" data-type="${produto.tipo}" onclick="abrirModalProduto(${produto.id})" style="cursor: pointer;">
      <div class="product-image">
        <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
      </div>
      <div class="product-info">
        <div class="product-meta">
          <div class="product-type-badge ${produto.tipo}">${produto.tipo === "doacao" ? "Doação" : "Venda"}</div>
          <span class="product-category">${traduzirCategoria(produto.categoria)}</span>
        </div>
        <h3 class="product-title">${produto.nome}</h3>
        <p class="product-description">${produto.descricao.substring(0, 120)}${produto.descricao.length > 120 ? "..." : ""}</p>
        <div class="product-location">
          <i class="fas fa-map-marker-alt"></i>
          ${produto.localizacao}
        </div>
        <div class="product-price ${produto.promocao ? "promotion" : ""}">
          ${precoDisplay}
        </div>
        <div class="product-contact">
          <i class="fas fa-phone"></i>
          ${produto.contato}
        </div>
        <div style="margin-top: 10px; font-size: 0.8rem; color: var(--light-text);">
          <i class="fas fa-clock"></i>
          Publicado em ${formatarData(produto.dataPublicacao)}
        </div>
      </div>
    </article>
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

function exibirProdutosDestaque() {
  const container = document.getElementById("featured-products-container")
  if (!container) return

  const produtosDestaque = produtos.filter((produto) => produto.destaque)

  container.innerHTML = ""
  if (produtosDestaque.length === 0) {
    container.innerHTML =
      '<p class="no-results">Nenhum produto em destaque no momento. Publique produtos para vê-los aqui!</p>'
    return
  }

  produtosDestaque.forEach((produto) => {
    container.innerHTML += criarCardProduto(produto)
  })
}

function exibirDoacoes() {
  const container = document.getElementById("donations-container")
  if (!container) return

  const doacoes = produtos.filter((produto) => produto.tipo === "doacao")

  container.innerHTML = ""
  if (doacoes.length === 0) {
    container.innerHTML =
      '<p class="no-results">Nenhuma doação disponível no momento. Publique doações para ajudar a comunidade!</p>'
    return
  }

  doacoes.forEach((produto) => {
    container.innerHTML += criarCardProduto(produto)
  })
}

function exibirTodosProdutos() {
  const container = document.getElementById("products-container")
  if (!container) return

  container.innerHTML = ""
  if (produtos.length === 0) {
    container.innerHTML = '<p class="no-results">Nenhum produto cadastrado ainda. Seja o primeiro a publicar!</p>'
    return
  }

  produtos.forEach((produto) => {
    container.innerHTML += criarCardProduto(produto)
  })
}

function filtrarProdutosPorCategoria(categoria) {
  const container = document.getElementById("products-container")
  if (!container) return

  container.innerHTML = ""

  let produtosFiltrados
  if (categoria === "todos") {
    produtosFiltrados = produtos
  } else {
    produtosFiltrados = produtos.filter((produto) => produto.categoria === categoria)
  }

  if (produtosFiltrados.length === 0) {
    container.innerHTML = '<p class="no-results">Nenhum produto encontrado nesta categoria.</p>'
    return
  }

  produtosFiltrados.forEach((produto) => {
    container.innerHTML += criarCardProduto(produto)
  })
}

function filtrarProdutosPorTipo(tipo) {
  const container = document.getElementById("products-container")
  if (!container) return

  container.innerHTML = ""

  let produtosFiltrados
  if (tipo === "todos") {
    produtosFiltrados = produtos
  } else {
    produtosFiltrados = produtos.filter((produto) => produto.tipo === tipo)
  }

  if (produtosFiltrados.length === 0) {
    container.innerHTML = '<p class="no-results">Nenhum produto encontrado neste tipo.</p>'
    return
  }

  produtosFiltrados.forEach((produto) => {
    container.innerHTML += criarCardProduto(produto)
  })
}

function inicializarFiltros() {
  const botoesFiltro = document.querySelectorAll(".filter-btn")
  if (botoesFiltro.length === 0) return

  botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
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

function realizarBusca() {
  const inputBusca = document.getElementById("search-input")
  const termoBusca = inputBusca.value.toLowerCase().trim()

  if (termoBusca === "") return

  const container = document.getElementById("products-container")
  if (container) {
    const produtosFiltrados = produtos.filter(
      (produto) =>
        produto.nome.toLowerCase().includes(termoBusca) ||
        produto.descricao.toLowerCase().includes(termoBusca) ||
        produto.localizacao.toLowerCase().includes(termoBusca) ||
        traduzirCategoria(produto.categoria).toLowerCase().includes(termoBusca),
    )

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

      authTabs.forEach((t) => t.classList.remove("active"))
      authForms.forEach((f) => f.classList.remove("active"))

      tab.classList.add("active")
      document.getElementById(`${targetTab}-form-container`).classList.add("active")
    })
  })

  // Formulário de login
  const formLogin = document.getElementById("login-form")
  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("login-email").value
      const senha = document.getElementById("login-password").value

      const usuario = users.find((user) => user.email === email && user.senha === senha)

      if (usuario) {
        localStorage.setItem(
          "usuarioLogado",
          JSON.stringify({
            email: usuario.email,
            tipo: usuario.tipo,
          }),
        )

        mostrarNotificacao("Login realizado com sucesso!")

        setTimeout(() => {
          if (usuario.tipo === "admin") {
            window.location.href = "admin.html"
          } else {
            window.location.href = "index.html"
          }
        }, 1000)
      } else {
        mostrarNotificacao("Email ou senha incorretos!", "error")
      }
    })
  }

  // Formulário de cadastro
  const formRegister = document.getElementById("register-form")
  if (formRegister) {
    formRegister.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("register-email").value
      const senha = document.getElementById("register-password").value
      const confirmarSenha = document.getElementById("register-confirm-password").value

      if (senha !== confirmarSenha) {
        mostrarNotificacao("As senhas não coincidem!", "error")
        return
      }

      // Verificar se o email já existe
      const usuarioExistente = users.find((user) => user.email === email)
      if (usuarioExistente) {
        mostrarNotificacao("Este email já está cadastrado!", "error")
        return
      }

      // Adicionar novo usuário
      users.push({
        email: email,
        senha: senha,
        tipo: "cliente",
      })

      mostrarNotificacao("Cadastro realizado com sucesso! Faça login para continuar.")

      // Mudar para aba de login
      document.querySelector('.auth-tab-btn[data-tab="login"]').click()
      formRegister.reset()
    })
  }
}

function verificarAutenticacao() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))

  // Verificar se estamos na página de admin
  if (window.location.pathname.includes("admin.html")) {
    if (!usuarioLogado || usuarioLogado.tipo !== "admin") {
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
        logout()
      }
    } else {
      btnLogin.textContent = "Login"
      btnLogin.href = "login.html"
      btnLogin.onclick = null
    }
  }
}

function logout() {
  localStorage.removeItem("usuarioLogado")
  mostrarNotificacao("Logout realizado com sucesso!")
  setTimeout(() => {
    window.location.href = "index.html"
  }, 1000)
}

// Funções de botão de publicar
function inicializarBotaoPublicar() {
  const publishBtn = document.getElementById("publish-btn")
  if (!publishBtn) return

  publishBtn.addEventListener("click", () => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))
    if (!usuarioLogado) {
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
  const imageInput = document.getElementById("product-image")
  const imagePreview = document.getElementById("image-preview")
  const previewImg = document.getElementById("preview-img")

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

  // Preview da imagem
  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (file) {
      // Verificar tamanho do arquivo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        mostrarNotificacao("A imagem deve ter no máximo 5MB", "error")
        imageInput.value = ""
        return
      }

      // Verificar tipo do arquivo
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
      if (!allowedTypes.includes(file.type)) {
        mostrarNotificacao("Formato não suportado. Use JPG, JPEG, PNG ou GIF", "error")
        imageInput.value = ""
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        previewImg.src = e.target.result
        imagePreview.style.display = "block"
      }
      reader.readAsDataURL(file)
    }
  })

  formPublicar.addEventListener("submit", (e) => {
    e.preventDefault()

    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))
    if (!usuarioLogado) {
      mostrarNotificacao("Você precisa estar logado para publicar", "error")
      return
    }

    const submitBtn = formPublicar.querySelector('button[type="submit"]')
    const originalText = submitBtn.innerHTML
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publicando...'
    submitBtn.disabled = true

    // Simular upload da imagem (usar a imagem do preview)
    let imagemUrl =
      "https://via.placeholder.com/400x300?text=" + encodeURIComponent(document.getElementById("product-name").value)

    if (previewImg.src && previewImg.src !== "") {
      imagemUrl = previewImg.src
    }

    // Criar novo produto
    const novoProduto = {
      id: Date.now(),
      nome: document.getElementById("product-name").value,
      descricao: document.getElementById("product-description").value,
      tipo: document.getElementById("product-type").value,
      preco:
        document.getElementById("product-type").value === "doacao"
          ? 0
          : Number.parseFloat(document.getElementById("product-price").value),
      precoPromocional: null,
      categoria: document.getElementById("product-category").value,
      localizacao: document.getElementById("product-location").value || obterCidadeAleatoria(),
      contato: document.getElementById("product-contact").value,
      imagem: imagemUrl,
      destaque: false, // Será definido pelo algoritmo
      promocao: false,
      usuario: usuarioLogado.email.split("@")[0],
      dataPublicacao: new Date().toISOString(),
    }

    // Adicionar ao array de produtos
    produtos.push(novoProduto)
    localStorage.setItem("produtos", JSON.stringify(produtos))

    // Executar algoritmo de destaque após adicionar o produto
    algoritmoDestaque()

    // Verificar se o produto foi selecionado para destaque
    const produtoAtualizado = produtos.find((p) => p.id === novoProduto.id)
    let mensagem = "Produto publicado com sucesso!"
    if (produtoAtualizado && produtoAtualizado.destaque) {
      mensagem += " Seu produto foi selecionado para destaque! 🌟"
    }

    mostrarNotificacao(mensagem)
    formPublicar.reset()
    imagePreview.style.display = "none"

    setTimeout(() => {
      window.location.href = "produtos.html"
    }, 2000)

    submitBtn.innerHTML = originalText
    submitBtn.disabled = false
  })
}

// Funções de administração
function inicializarPainelAdmin() {
  if (!window.location.pathname.includes("admin.html")) return

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))
  const adminName = document.getElementById("admin-name")
  if (adminName && usuarioLogado) {
    adminName.textContent = usuarioLogado.email.split("@")[0]
  }

  // Inicializar botões de logout
  const btnLogout = document.getElementById("logout-btn")
  const footerLogout = document.getElementById("footer-logout")

  if (btnLogout) {
    btnLogout.addEventListener("click", (e) => {
      e.preventDefault()
      logout()
    })
  }

  if (footerLogout) {
    footerLogout.addEventListener("click", (e) => {
      e.preventDefault()
      logout()
    })
  }

  // Exibir produtos
  exibirProdutosAdmin()
}

function exibirProdutosAdmin() {
  const container = document.getElementById("admin-products-container")
  if (!container) return

  container.innerHTML = ""

  if (produtos.length === 0) {
    container.innerHTML = '<p class="no-results">Nenhum produto cadastrado ainda.</p>'
    return
  }

  produtos.forEach((produto) => {
    const destaqueIcon = produto.destaque
      ? '<i class="fas fa-star" style="color: gold; margin-left: 10px;" title="Em destaque"></i>'
      : ""

    container.innerHTML += `
      <div class="admin-product-card" data-id="${produto.id}">
        <div class="admin-product-image">
          <img src="${produto.imagem}" alt="${produto.nome}">
        </div>
        <div class="admin-product-info">
          <h3 class="admin-product-title">${produto.nome}${destaqueIcon}</h3>
          <p class="admin-product-price">
            ${produto.tipo === "doacao" ? "Gratuito" : formatarPreco(produto.preco)}
          </p>
          <p><strong>Tipo:</strong> ${produto.tipo === "doacao" ? "Doação" : "Venda"}</p>
          <p><strong>Categoria:</strong> ${traduzirCategoria(produto.categoria)}</p>
          <p><strong>Local:</strong> ${produto.localizacao}</p>
          <p><strong>Usuário:</strong> ${produto.usuario}</p>
          <p><strong>Publicado:</strong> ${formatarData(produto.dataPublicacao)}</p>
          <div class="admin-product-actions">
            <button class="delete-btn" data-id="${produto.id}">
              <i class="fas fa-trash"></i> Excluir
            </button>
          </div>
        </div>
      </div>
    `
  })

  // Adicionar event listeners para botões de exclusão
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number.parseInt(btn.getAttribute("data-id"))
      excluirProduto(id)
    })
  })
}

function excluirProduto(id) {
  if (confirm("Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.")) {
    const index = produtos.findIndex((p) => p.id === id)
    if (index !== -1) {
      produtos.splice(index, 1)
      localStorage.setItem("produtos", JSON.stringify(produtos))

      // Reexecutar algoritmo de destaque após exclusão
      algoritmoDestaque()

      mostrarNotificacao("Produto excluído com sucesso!")
      exibirProdutosAdmin()
    }
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // Verificar e atualizar destaques
  verificarEAtualizarDestaques()

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
    inicializarPainelAdmin()
  }
})
