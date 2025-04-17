import { getAllProducts, createProduct } from "../../../lib/products"

export default async function handler(req, res) {
  // Permitir apenas métodos GET e POST
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Método não permitido" })
  }

  // Listar todos os produtos
  if (req.method === "GET") {
    const result = await getAllProducts()

    if (!result.success) {
      return res.status(500).json(result)
    }

    return res.status(200).json(result)
  }

  // Criar um novo produto
  if (req.method === "POST") {
    // Verificar se o usuário está autenticado como admin
    // Implementação simplificada - em produção, use um middleware de autenticação
    const { session } = req.cookies

    if (!session || !isAdmin(session)) {
      return res.status(401).json({ success: false, error: "Não autorizado" })
    }

    const productData = req.body
    const result = await createProduct(productData)

    if (!result.success) {
      return res.status(400).json(result)
    }

    return res.status(201).json(result)
  }
}

// Função auxiliar para verificar se o usuário é admin
// Em produção, use uma solução mais robusta
function isAdmin(session) {
  try {
    const userData = JSON.parse(session)
    return userData && userData.user_type === "admin"
  } catch (error) {
    return false
  }
}
