// Versão modificada do script.js para usar o banco de dados
import {
  fetchAllProducts,
  fetchFeaturedProducts,
  fetchPromotionProducts,
  fetchProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  login,
  logout,
  getCurrentUser,
  fetchProductById,
} from "./api.js"

// Funções de utilidade
function formatarPreco(preco) {
  return Number(preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
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
    <div class="product-card" data-id="${produto.id}" data-category="${produto.category}">
      <div class="product-image">
        <img src="${produto.image_url}" alt="${produto.name}">
      </div>
      <div class="product-info">
        <span class="product-category">${traduzirCategoria(produto.category)}</span>
        <h3 class="product-title">${produto.name}</h3>
        <p class="product-description">${produto.description}</p>
        ${
          produto.promotion
            ? `<div class="product-price promotion">
                <span class="original-price">${formatarPreco(produto.price)}</span>
                ${formatarPreco(produto.promotional_price)}
              </div>`
            : `<div class="product-price">
                ${formatarPreco(produto.price)}
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

  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const senha = document.getElementById("password").value

    const result = await login(email, senha)

    if (result.success) {
      // Login bem-sucedido
      mostrarNotificacao("Login realizado com sucesso!")

      setTimeout(() => {
        if (result.data.user_type === "admin") {
          window.location.href = "admin.html"
        } else {
          window.location.href = "index.html"
        }
      }, 1000)
    } else {
      // Login falhou
      mostrarNotificacao(result.error, "error")
    }
  })
}

async function verificarAutenticacao() {
  const result = await getCurrentUser()
  const usuarioLogado = result.success ? result.data : null

  // Verificar se estamos na página de admin
  if (window.location.pathname.includes("admin.html")) {
    if (!usuarioLogado || usuarioLogado.user_type !== "admin") {
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
        fazerLogout()
      })
    } else {
      btnLogin.textContent = "Login"
      btnLogin.href = "login.html"
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

// Funções de administração
async function inicializarPainelAdmin() {
  if (!window.location.pathname.includes("admin.html")) return

  // Exibir nome do usuário
  const resultUser = await getCurrentUser()
  const usuarioLogado = resultUser.success ? resultUser.data : null

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

    formAddProduto.addEventListener("submit", async (e) => {
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
        name: nome,
        description: descricao,
        price: preco,
        promotional_price: precoPromocional,
        category: categoria,
        image_url: imagem,
        featured: destaque,
        promotion: promocao,
      }

      // Adicionar ao banco de dados
      const result = await createProduct(novoProduto)

      if (!result.success) {
        mostrarNotificacao(result.error, "error")
        return
      }

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
      fazerLogout()
    })
  }

  if (footerLogout) {
    footerLogout.addEventListener("click", (e) => {
      e.preventDefault()
      fazerLogout()
    })
  }

  // Exibir produtos e promoções
  exibirProdutosAdmin()
  exibirPromocoesAdmin()

  // Inicializar modal de edição
  inicializarModalEdicao()
}

async function exibirProdutosAdmin() {
  const container = document.getElementById("admin-products-container")
  if (!container) return

  const result = await fetchAllProducts()

  if (!result.success) {
    mostrarNotificacao(result.error, "error")
    return
  }

  const produtos = result.data

  container.innerHTML = ""

  produtos.forEach((produto) => {
    container.innerHTML += `
      <div class="admin-product-card" data-id="${produto.id}">
        <div class="admin-product-image">
          <img src="${produto.image_url}" alt="${produto.name}">
        </div>
        <div class="admin-product-info">
          <h3 class="admin-product-title">${produto.name}</h3>
          <p class="admin-product-price">
            ${
              produto.promotion
                ? `<span class="original-price">${formatarPreco(produto.price)}</span> ${formatarPreco(produto.promotional_price)}`
                : formatarPreco(produto.price)
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

async function exibirPromocoesAdmin() {
  const container = document.getElementById("admin-promotions-container")
  if (!container) return

  const result = await fetchPromotionProducts()

  if (!result.success) {
    mostrarNotificacao(result.error, "error")
    return
  }

  const promocoes = result.data

  container.innerHTML = ""

  if (promocoes.length === 0) {
    container.innerHTML = "<p>Nenhuma promoção cadastrada.</p>"
    return
  }

  promocoes.forEach((produto) => {
    container.innerHTML += `
      <div class="admin-product-card" data-id="${produto.id}">
        <div class="admin-product-image">
          <img src="${produto.image_url}" alt="${produto.name}">
        </div>
        <div class="admin-product-info">
          <h3 class="admin-product-title">${produto.name}</h3>
          <p class="admin-product-price">
            <span class="original-price">${formatarPreco(produto.price)}</span> 
            ${formatarPreco(produto.promotional_price)}
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
  formEditProduto.addEventListener("submit", async (e) => {
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
    const produtoAtualizado = {
      name: nome,
      description: descricao,
      price: preco,
      promotional_price: precoPromocional,
      category: categoria,
      image_url: imagem,
      featured: destaque,
      promotion: promocao,
    }

    const result = await updateProduct(id, produtoAtualizado)

    if (!result.success) {
      mostrarNotificacao(result.error, "error")
      return
    }

    // Fechar modal
    modal.style.display = "none"

    // Mostrar notificação
    mostrarNotificacao("Produto atualizado com sucesso!")

    // Atualizar listas de produtos
    exibirProdutosAdmin()
    exibirPromocoesAdmin()
  })
}

async function abrirModalEdicao(id) {
  const result = await fetchProductById(id)

  if (!result.success) {
    mostrarNotificacao(result.error, "error")
    return
  }

  const produto = result.data

  document.getElementById("edit-product-id").value = produto.id
  document.getElementById("edit-product-name").value = produto.name
  document.getElementById("edit-product-description").value = produto.description
  document.getElementById("edit-product-price").value = produto.price
  document.getElementById("edit-product-image").value = produto.image_url
  document.getElementById("edit-product-category").value = produto.category
  document.getElementById("edit-product-featured").checked = produto.featured
  document.getElementById("edit-product-promotion").checked = produto.promotion

  const grupoPrecoPromocional = document.getElementById("edit-promotion-price-group")
  grupoPrecoPromocional.style.display = produto.promotion ? "block" : "none"

  if (produto.promotion && produto.promotional_price) {
    document.getElementById("edit-product-promotion-price").value = produto.promotional_price
  } else {
    document.getElementById("edit-product-promotion-price").value = ""
  }

  document.getElementById("edit-modal").style.display = "block"
}

async function excluirProduto(id) {
  if (confirm("Tem certeza que deseja excluir este produto?")) {
    const result = await deleteProduct(id)

    if (!result.success) {
      mostrarNotificacao(result.error, "error")
      return
    }

    // Mostrar notificação
    mostrarNotificacao("Produto excluído com sucesso!")

    // Atualizar listas de produtos
    exibirProdutosAdmin()
    exibirPromocoesAdmin()
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
