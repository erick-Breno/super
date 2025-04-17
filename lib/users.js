import { sql } from "./db"

// Funções para gerenciar usuários
export async function getUserByEmail(email) {
  try {
    const users = await sql`
      SELECT * FROM users WHERE email = ${email}
    `

    if (users.length === 0) {
      return { success: false, error: "Usuário não encontrado" }
    }

    return { success: true, data: users[0] }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
    return { success: false, error: "Falha ao buscar usuário" }
  }
}

export async function createUser(userData) {
  try {
    const { email, password, user_type } = userData

    // Verificar se o usuário já existe
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return { success: false, error: "Email já cadastrado" }
    }

    const result = await sql`
      INSERT INTO users (email, password, user_type)
      VALUES (${email}, ${password}, ${user_type})
      RETURNING id, email, user_type
    `

    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return { success: false, error: "Falha ao criar usuário" }
  }
}

export async function validateUser(email, password) {
  try {
    const users = await sql`
      SELECT * FROM users WHERE email = ${email} AND password = ${password}
    `

    if (users.length === 0) {
      return { success: false, error: "Email ou senha incorretos" }
    }

    // Não retornar a senha no objeto de resposta
    const { password: _, ...userData } = users[0]

    return { success: true, data: userData }
  } catch (error) {
    console.error("Erro ao validar usuário:", error)
    return { success: false, error: "Falha ao validar usuário" }
  }
}
