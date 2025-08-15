import { sql } from "./db"

// Funções para gerenciar produtos
export async function getAllProducts() {
  try {
    const products = await sql`
      SELECT * FROM products ORDER BY id DESC
    `
    return { success: true, data: products }
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return { success: false, error: "Falha ao buscar produtos" }
  }
}

export async function getFeaturedProducts() {
  try {
    const products = await sql`
      SELECT * FROM products WHERE featured = true ORDER BY id DESC
    `
    return { success: true, data: products }
  } catch (error) {
    console.error("Erro ao buscar produtos em destaque:", error)
    return { success: false, error: "Falha ao buscar produtos em destaque" }
  }
}

export async function getPromotionProducts() {
  try {
    const products = await sql`
      SELECT * FROM products WHERE promotion = true ORDER BY id DESC
    `
    return { success: true, data: products }
  } catch (error) {
    console.error("Erro ao buscar produtos em promoção:", error)
    return { success: false, error: "Falha ao buscar produtos em promoção" }
  }
}

export async function getProductsByCategory(category) {
  try {
    const products = await sql`
      SELECT * FROM products WHERE category = ${category} ORDER BY id DESC
    `
    return { success: true, data: products }
  } catch (error) {
    console.error("Erro ao buscar produtos por categoria:", error)
    return { success: false, error: "Falha ao buscar produtos por categoria" }
  }
}

export async function searchProducts(term) {
  try {
    const products = await sql`
      SELECT * FROM products 
      WHERE 
        name ILIKE ${"%" + term + "%"} OR 
        description ILIKE ${"%" + term + "%"} OR
        category ILIKE ${"%" + term + "%"}
      ORDER BY id DESC
    `
    return { success: true, data: products }
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return { success: false, error: "Falha ao buscar produtos" }
  }
}

export async function getProductById(id) {
  try {
    const products = await sql`
      SELECT * FROM products WHERE id = ${id}
    `

    if (products.length === 0) {
      return { success: false, error: "Produto não encontrado" }
    }

    return { success: true, data: products[0] }
  } catch (error) {
    console.error("Erro ao buscar produto:", error)
    return { success: false, error: "Falha ao buscar produto" }
  }
}

export async function createProduct(productData) {
  try {
    const {
      name,
      description,
      price,
      promotional_price,
      category,
      image_url,
      featured,
      promotion,
      product_type,
      location,
      contact_info,
      user_id,
      status = "ativo",
    } = productData

    const result = await sql`
      INSERT INTO products (
        name, description, price, promotional_price, category, image_url, 
        featured, promotion, product_type, location, contact_info, user_id, status
      )
      VALUES (
        ${name}, ${description}, ${price}, ${promotional_price}, ${category}, ${image_url}, 
        ${featured}, ${promotion}, ${product_type}, ${location}, ${contact_info}, ${user_id}, ${status}
      )
      RETURNING *
    `

    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return { success: false, error: "Falha ao criar produto" }
  }
}

export async function updateProduct(id, productData) {
  try {
    const {
      name,
      description,
      price,
      promotional_price,
      category,
      image_url,
      featured,
      promotion,
      product_type,
      location,
      contact_info,
      status,
    } = productData

    const result = await sql`
      UPDATE products
      SET 
        name = ${name},
        description = ${description},
        price = ${price},
        promotional_price = ${promotional_price},
        category = ${category},
        image_url = ${image_url},
        featured = ${featured},
        promotion = ${promotion},
        product_type = ${product_type},
        location = ${location},
        contact_info = ${contact_info},
        status = ${status}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return { success: false, error: "Produto não encontrado" }
    }

    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
    return { success: false, error: "Falha ao atualizar produto" }
  }
}

export async function deleteProduct(id) {
  try {
    const result = await sql`
      DELETE FROM products WHERE id = ${id} RETURNING id
    `

    if (result.length === 0) {
      return { success: false, error: "Produto não encontrado" }
    }

    return { success: true, data: { id: result[0].id } }
  } catch (error) {
    console.error("Erro ao excluir produto:", error)
    return { success: false, error: "Falha ao excluir produto" }
  }
}

export async function getDonationProducts() {
  try {
    const products = await sql`
      SELECT * FROM products WHERE product_type = 'doacao' AND status = 'ativo' ORDER BY id DESC
    `
    return { success: true, data: products }
  } catch (error) {
    console.error("Erro ao buscar doações:", error)
    return { success: false, error: "Falha ao buscar doações" }
  }
}

export async function getProductsByType(type) {
  try {
    const products = await sql`
      SELECT * FROM products WHERE product_type = ${type} AND status = 'ativo' ORDER BY id DESC
    `
    return { success: true, data: products }
  } catch (error) {
    console.error("Erro ao buscar produtos por tipo:", error)
    return { success: false, error: "Falha ao buscar produtos por tipo" }
  }
}
