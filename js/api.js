// Funções para interagir com a API

// Produtos
export async function fetchAllProducts() {
  try {
    const response = await fetch("/api/products")
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return { success: false, error: "Falha ao buscar produtos" }
  }
}

export async function fetchFeaturedProducts() {
  try {
    const response = await fetch("/api/products/featured")
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao buscar produtos em destaque:", error)
    return { success: false, error: "Falha ao buscar produtos em destaque" }
  }
}

export async function fetchPromotionProducts() {
  try {
    const response = await fetch("/api/products/promotions")
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao buscar produtos em promoção:", error)
    return { success: false, error: "Falha ao buscar produtos em promoção" }
  }
}

export async function fetchProductsByCategory(category) {
  try {
    const response = await fetch(`/api/products/category/${category}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao buscar produtos por categoria:", error)
    return { success: false, error: "Falha ao buscar produtos por categoria" }
  }
}

export async function fetchDonationProducts() {
  try {
    const response = await fetch("/api/products/donations")
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao buscar doações:", error)
    return { success: false, error: "Falha ao buscar doações" }
  }
}

export async function fetchProductsByType(type) {
  try {
    const response = await fetch(`/api/products/type/${type}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao buscar produtos por tipo:", error)
    return { success: false, error: "Falha ao buscar produtos por tipo" }
  }
}

export async function searchProducts(term) {
  try {
    const response = await fetch(`/api/products/search?term=${encodeURIComponent(term)}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return { success: false, error: "Falha ao buscar produtos" }
  }
}

export async function fetchProductById(id) {
  try {
    const response = await fetch(`/api/products/${id}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao buscar produto:", error)
    return { success: false, error: "Falha ao buscar produto" }
  }
}

export async function createProduct(productData) {
  try {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return { success: false, error: "Falha ao criar produto" }
  }
}

export async function updateProduct(id, productData) {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
    return { success: false, error: "Falha ao atualizar produto" }
  }
}

export async function deleteProduct(id) {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao excluir produto:", error)
    return { success: false, error: "Falha ao excluir produto" }
  }
}

// Autenticação
export async function login(email, password) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    return { success: false, error: "Falha ao fazer login" }
  }
}

export async function logout() {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao fazer logout:", error)
    return { success: false, error: "Falha ao fazer logout" }
  }
}

export async function register(email, password, userType = "cliente") {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, user_type: userType }),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    return { success: false, error: "Falha ao registrar usuário" }
  }
}

export async function getCurrentUser() {
  try {
    const response = await fetch("/api/auth/user")
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao obter usuário atual:", error)
    return { success: false, error: "Falha ao obter usuário atual" }
  }
}
