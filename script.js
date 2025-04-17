// Dados de usuários para simulação de login
const users = [
  { email: "admin@supermercado.com", senha: "admin123", tipo: "admin" },
  { email: "cliente@supermercado.com", senha: "cliente123", tipo: "cliente" },
]

// Dados iniciais de produtos
let produtos = [
  {
    id: 1,
    nome: "Maçã Fuji",
    descricao: "Maçã Fuji fresca e suculenta, ideal para lanches saudáveis.",
    preco: 5.99,
    precoPromocional: 4.99,
    categoria: "hortifruti",
    imagem: "https://via.placeholder.com/300?text=Maçã+Fuji",
    destaque: true,
    promocao: true,
  },
  {
    id: 2,
    nome: "Filé Mignon",
    descricao: "Corte nobre e macio, perfeito para ocasiões especiais.",
    preco: 59.9,
    precoPromocional: null,
    categoria: "carnes",
    imagem: "https://via.placeholder.com/300?text=Filé+Mignon",
    destaque: true,
    promocao: false,
  },
  {
    id: 3,
    nome: "Pão Francês",
    descricao: "Pão fresquinho e crocante, feito diariamente em nossa padaria.",
    preco: 0.75,
    precoPromocional: 0.6,
    categoria: "padaria",
    imagem: "https://via.placeholder.com/300?text=Pão+Francês",
    destaque: false,
    promocao: true,
  },
  {
    id: 4,
    nome: "Queijo Mussarela",
    descricao: "Queijo mussarela fatiado de alta qualidade.",
    preco: 29.9,
    precoPromocional: null,
    categoria: "laticinios",
    imagem: "https://via.placeholder.com/300?text=Queijo+Mussarela",
    destaque: true,
    promocao: false,
  },
  {
    id: 5,
    nome: "Refrigerante Cola 2L",
    descricao: "Refrigerante sabor cola, garrafa de 2 litros.",
    preco: 8.99,
    precoPromocional: 7.49,
    categoria: "bebidas",
    imagem: "https://via.placeholder.com/300?text=Refrigerante+Cola",
    destaque: false,
    promocao: true,
  },
  {
    id: 6,
    nome: "Detergente Líquido",
    descricao: "Detergente líquido para louças, remove gordura com eficiência.",
    preco: 2.99,
    precoPromocional: null,
    categoria: "limpeza",
    imagem: "https://via.placeholder.com/300?text=Detergente+Líquido",
    destaque: false,
    promocao: false,
  },
  {
    id: 7,
    nome: "Banana Prata",
    descricao: "Banana prata madura e doce, rica em potássio.",
    preco: 4.99,
    precoPromocional: 3.99,
    categoria: "hortifruti",
    imagem: "https://via.placeholder.com/300?text=Banana+Prata",
    destaque: false,
    promocao: true,
  },
  {
    id: 8,
    nome: "Leite Integral 1L",
    descricao: "Leite integral pasteurizado, embalagem de 1 litro.",
    preco: 4.5,
    precoPromocional: null,
    categoria: "laticinios",
    imagem: "https://via.placeholder.com/300?text=Leite+Integral",
    destaque: true,
    promocao: false,
  },
]

// Verificar se já existem produtos no localStorage
if (!localStorage.getItem("produtos")) {
  localStorage.setItem("produtos", JSON.stringify(produtos))
} else {
  produtos = JSON.parse(localStorage.getItem("produtos"))
}

// Funções de utilidade
function formatarPreco(preco) {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function mostrarNotificacao(mensagem, tipo = "success") {
  const notificacao = document.getElementById("notification")
  const mensagemElement = document.getElementById("notification-message")

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
  const cardHTML = `
        <div class="product-card" data-id="${produto.id}" data-category="${produto.categoria}">
            <div class="product-image">
                <img src="${produto.imagem}" alt="${produto.nome}">
            </div>
            <div class="product-info">
                <span class="product-category">${traduzirCategoria(produto.categoria)}</span>
                <h3 class="product-title">${produto.nome}</h3>
                <p class="product-description">${produto.descricao}</p>
                ${
                  produto.promocao
                    ? `<div class="product-price promotion">
                        <span class="original-price">${formatarPreco(produto.preco)}</span>
                        ${formatarPreco(produto.precoPromocional)}
                    </div>`
                    : `<div class="product-price">
                        ${formatarPreco(produto.preco)}
                    </div>`
                }
            </div>
        </div>
    `
  return cardHTML
}

function traduzirCategoria(categoria) {
  const categorias = {
    hortifruti: "Hortifruti",
    carnes: "Carnes",
    padaria: "Padaria",
    laticinios: "Laticínios",
    bebidas: "Bebidas",
    limpeza: "Limpeza",
  }
  return categorias[categoria] || categoria
}

function exibirProdutosDestaque() {
  const container = document.getElementById("featured-products-container")
  if (!container) return

  const produtosDestaque = produtos.filter((produto) => produto.destaque)

  container.innerHTML = ""
  produtosDestaque.forEach((produto) => {
    container.innerHTML += criarCardProduto(produto)
  })
}

function exibirPromocoes() {
  const container = document.getElementById("promotions-container")
  if (!container) return

  const produtosPromocao = produtos.filter((produto) => produto.promocao)

  container.innerHTML = ""
  produtosPromocao.forEach((produto) => {
    container.innerHTML += criarCardProduto(produto)
  })
}

function exibirTodosProdutos() {
  const container = document.getElementById("products-container")
  if (!container) return

  container.innerHTML = ""
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

  produtosFiltrados.forEach((produto) => {
    container.innerHTML += criarCardProduto(produto)
  })
}

function inicializarFiltros() {
  const botoesFiltro = document.querySelectorAll(".filter-btn")
  if (botoesFiltro.length === 0) return

  botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
      // Remover classe ativa de todos os botões
      botoesFiltro.forEach((b) => b.classList.remove("active"))

      // Adicionar classe ativa ao botão clicado
      botao.classList.add("active")

      // Filtrar produtos
      const categoria = botao.getAttribute("data-category")
      filtrarProdutosPorCategoria(categoria)
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
    // Estamos na página de produtos
    const produtosFiltrados = produtos.filter(
      (produto) =>
        produto.nome.toLowerCase().includes(termoBusca) ||
        produto.descricao.toLowerCase().includes(termoBusca) ||
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
    document.querySelector('.filter-btn[data-category="todos"]').classList.add("active")
  } else {
    // Estamos na página inicial, redirecionar para a página de produtos
    sessionStorage.setItem("termoBusca", termoBusca)
    window.location.href = "produtos.html"
  }
}

// Funções de login e autenticação
function inicializarFormularioLogin() {
  const formLogin = document.getElementById("login-form")
  if (!formLogin) return

  formLogin.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const senha = document.getElementById("password").value

    const usuario = users.find((user) => user.email === email && user.senha === senha)

    if (usuario) {
      // Login bem-sucedido
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
      // Login falhou
      mostrarNotificacao("Email ou senha incorretos!", "error")
    }
  })
}

function verificarAutenticacao() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))

  // Verificar se estamos na página de admin
  if (window.location.pathname.includes("admin.html")) {
    if (!usuarioLogado || usuarioLogado.tipo !== "admin") {
      // Redirecionar para login se não for admin
      window.location.href = "login.html"
    }
  }

  // Atualizar botão de login/logout
  const btnLogin = document.querySelector(".btn-login")
  if (btnLogin) {
    if (usuarioLogado) {
      btnLogin.textContent = "Sair"
      btnLogin.href = "#"
      btnLogin.addEventListener("click", (e) => {
        e.preventDefault()
        logout()
      })
    } else {
      btnLogin.textContent = "Login"
      btnLogin.href = "login.html"
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

// Funções de administração
function inicializarPainelAdmin() {
  if (!window.location.pathname.includes("admin.html")) return

  // Exibir nome do usuário
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))
  const adminName = document.getElementById("admin-name")
  if (adminName && usuarioLogado) {
    adminName.textContent = usuarioLogado.email.split("@")[0]
  }

  // Inicializar tabs
  const tabBtns = document.querySelectorAll(".tab-btn")
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remover classe ativa de todos os botões e painéis
      tabBtns.forEach((b) => b.classList.remove("active"))
      document.querySelectorAll(".tab-pane").forEach((pane) => pane.classList.remove("active"))

      // Adicionar classe ativa ao botão clicado e painel correspondente
      btn.classList.add("active")
      const tabId = btn.getAttribute("data-tab")
      document.getElementById(tabId).classList.add("active")
    })
  })

  // Inicializar formulário de adição de produto
  const formAddProduto = document.getElementById("add-product-form")
  if (formAddProduto) {
    const checkboxPromocao = document.getElementById("product-promotion")
    const grupoPrecoPromocional = document.getElementById("promotion-price-group")

    checkboxPromocao.addEventListener("change", () => {
      grupoPrecoPromocional.style.display = checkboxPromocao.checked ? "block" : "none"
    })

    formAddProduto.addEventListener("submit", (e) => {
      e.preventDefault()

      // Obter valores do formulário
      const nome = document.getElementById("product-name").value
      const descricao = document.getElementById("product-description").value
      const preco = Number.parseFloat(document.getElementById("product-price").value)
      const imagem = document.getElementById("product-image").value
      const categoria = document.getElementById("product-category").value
      const destaque = document.getElementById("product-featured").checked
      const promocao = document.getElementById("product-promotion").checked
      let precoPromocional = null

      if (promocao) {
        precoPromocional = Number.parseFloat(document.getElementById("product-promotion-price").value)
        if (precoPromocional >= preco) {
          mostrarNotificacao("O preço promocional deve ser menor que o preço normal!", "error")
          return
        }
      }

      // Criar novo produto
      const novoProduto = {
        id: Date.now(), // Usar timestamp como ID único
        nome,
        descricao,
        preco,
        precoPromocional,
        categoria,
        imagem,
        destaque,
        promocao,
      }

      // Adicionar ao array de produtos
      produtos.push(novoProduto)

      // Salvar no localStorage
      localStorage.setItem("produtos", JSON.stringify(produtos))

      // Limpar formulário
      formAddProduto.reset()
      grupoPrecoPromocional.style.display = "none"

      // Mostrar notificação
      mostrarNotificacao("Produto adicionado com sucesso!")

      // Atualizar listas de produtos
      exibirProdutosAdmin()
      exibirPromocoesAdmin()
    })
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

  // Exibir produtos e promoções
  exibirProdutosAdmin()
  exibirPromocoesAdmin()

  // Inicializar modal de edição
  inicializarModalEdicao()
}

function exibirProdutosAdmin() {
  const container = document.getElementById("admin-products-container")
  if (!container) return

  container.innerHTML = ""

  produtos.forEach((produto) => {
    container.innerHTML += `
            <div class="admin-product-card" data-id="${produto.id}">
                <div class="admin-product-image">
                    <img src="${produto.imagem}" alt="${produto.nome}">
                </div>
                <div class="admin-product-info">
                    <h3 class="admin-product-title">${produto.nome}</h3>
                    <p class="admin-product-price">
                        ${
                          produto.promocao
                            ? `<span class="original-price">${formatarPreco(produto.preco)}</span> ${formatarPreco(produto.precoPromocional)}`
                            : formatarPreco(produto.preco)
                        }
                    </p>
                    <div class="admin-product-actions">
                        <button class="edit-btn" data-id="${produto.id}">Editar</button>
                        <button class="delete-btn" data-id="${produto.id}">Excluir</button>
                    </div>
                </div>
            </div>
        `
  })

  // Adicionar event listeners para botões de edição e exclusão
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number.parseInt(btn.getAttribute("data-id"))
      abrirModalEdicao(id)
    })
  })

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number.parseInt(btn.getAttribute("data-id"))
      excluirProduto(id)
    })
  })
}

function exibirPromocoesAdmin() {
  const container = document.getElementById("admin-promotions-container")
  if (!container) return

  const promocoes = produtos.filter((produto) => produto.promocao)

  container.innerHTML = ""

  if (promocoes.length === 0) {
    container.innerHTML = "<p>Nenhuma promoção cadastrada.</p>"
    return
  }

  promocoes.forEach((produto) => {
    container.innerHTML += `
            <div class="admin-product-card" data-id="${produto.id}">
                <div class="admin-product-image">
                    <img src="${produto.imagem}" alt="${produto.nome}">
                </div>
                <div class="admin-product-info">
                    <h3 class="admin-product-title">${produto.nome}</h3>
                    <p class="admin-product-price">
                        <span class="original-price">${formatarPreco(produto.preco)}</span> 
                        ${formatarPreco(produto.precoPromocional)}
                    </p>
                    <div class="admin-product-actions">
                        <button class="edit-btn" data-id="${produto.id}">Editar</button>
                        <button class="delete-btn" data-id="${produto.id}">Excluir</button>
                    </div>
                </div>
            </div>
        `
  })

  // Adicionar event listeners para botões de edição e exclusão
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number.parseInt(btn.getAttribute("data-id"))
      abrirModalEdicao(id)
    })
  })

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number.parseInt(btn.getAttribute("data-id"))
      excluirProduto(id)
    })
  })
}

function inicializarModalEdicao() {
  const modal = document.getElementById("edit-modal")
  const closeBtn = document.querySelector(".close-modal")

  if (!modal || !closeBtn) return

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none"
  })

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none"
    }
  })

  const checkboxPromocao = document.getElementById("edit-product-promotion")
  const grupoPrecoPromocional = document.getElementById("edit-promotion-price-group")

  checkboxPromocao.addEventListener("change", () => {
    grupoPrecoPromocional.style.display = checkboxPromocao.checked ? "block" : "none"
  })

  const formEditProduto = document.getElementById("edit-product-form")
  formEditProduto.addEventListener("submit", (e) => {
    e.preventDefault()

    const id = Number.parseInt(document.getElementById("edit-product-id").value)
    const nome = document.getElementById("edit-product-name").value
    const descricao = document.getElementById("edit-product-description").value
    const preco = Number.parseFloat(document.getElementById("edit-product-price").value)
    const imagem = document.getElementById("edit-product-image").value
    const categoria = document.getElementById("edit-product-category").value
    const destaque = document.getElementById("edit-product-featured").checked
    const promocao = document.getElementById("edit-product-promotion").checked
    let precoPromocional = null

    if (promocao) {
      precoPromocional = Number.parseFloat(document.getElementById("edit-product-promotion-price").value)
      if (precoPromocional >= preco) {
        mostrarNotificacao("O preço promocional deve ser menor que o preço normal!", "error")
        return
      }
    }

    // Atualizar produto
    const index = produtos.findIndex((p) => p.id === id)
    if (index !== -1) {
      produtos[index] = {
        id,
        nome,
        descricao,
        preco,
        precoPromocional,
        categoria,
        imagem,
        destaque,
        promocao,
      }

      // Salvar no localStorage
      localStorage.setItem("produtos", JSON.stringify(produtos))

      // Fechar modal
      modal.style.display = "none"

      // Mostrar notificação
      mostrarNotificacao("Produto atualizado com sucesso!")

      // Atualizar listas de produtos
      exibirProdutosAdmin()
      exibirPromocoesAdmin()
    }
  })
}

function abrirModalEdicao(id) {
  const produto = produtos.find((p) => p.id === id)
  if (!produto) return

  document.getElementById("edit-product-id").value = produto.id
  document.getElementById("edit-product-name").value = produto.nome
  document.getElementById("edit-product-description").value = produto.descricao
  document.getElementById("edit-product-price").value = produto.preco
  document.getElementById("edit-product-image").value = produto.imagem
  document.getElementById("edit-product-category").value = produto.categoria
  document.getElementById("edit-product-featured").checked = produto.destaque
  document.getElementById("edit-product-promotion").checked = produto.promocao

  const grupoPrecoPromocional = document.getElementById("edit-promotion-price-group")
  grupoPrecoPromocional.style.display = produto.promocao ? "block" : "none"

  if (produto.promocao && produto.precoPromocional) {
    document.getElementById("edit-product-promotion-price").value = produto.precoPromocional
  } else {
    document.getElementById("edit-product-promotion-price").value = ""
  }

  document.getElementById("edit-modal").style.display = "block"
}

function excluirProduto(id) {
  if (confirm("Tem certeza que deseja excluir este produto?")) {
    const index = produtos.findIndex((p) => p.id === id)
    if (index !== -1) {
      produtos.splice(index, 1)

      // Salvar no localStorage
      localStorage.setItem("produtos", JSON.stringify(produtos))

      // Mostrar notificação
      mostrarNotificacao("Produto excluído com sucesso!")

      // Atualizar listas de produtos
      exibirProdutosAdmin()
      exibirPromocoesAdmin()
    }
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar funcionalidades comuns
  inicializarAcessibilidade()
  inicializarMenuResponsivo()
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
    exibirPromocoes()
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
  } else if (window.location.pathname.includes("admin.html")) {
    inicializarPainelAdmin()
  }
})
