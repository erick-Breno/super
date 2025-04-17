import { getProductById, updateProduct, deleteProduct } from "../../../lib/products"

export default async function handler(req, res) {
  const { id } = req.query

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ success: false, error: "ID inválido" })
  }

  // Obter um produto específico
  if (req.method === "GET") {
    const result = await getProductById(Number(id))

    if (!result.success) {
      return res.status(404).json(result)
    }

    return res.status(200).json(result)
  }

  // Atualizar um produto
  if (req.method === "PUT") {
    // Verificar se o usuário está autenticado como admin
    const { session } = req.cookies

    if (!session || !isAdmin(session)) {
      return res.status(401).json({ success: false, error: "Não autorizado" })
    }

    const productData = req.body
    const result = await updateProduct(Number(id), productData)

    if (!result.success) {
      return res.status(404).json(result)
    }

    return res.status(200).json(result)
  }

  // Excluir um produto
  if (req.method === "DELETE") {
    // Verificar se o usuário está autenticado como admin
    const { session } = req.cookies

    if (!session || !isAdmin(session)) {
      return res.status(401).json({ success: false, error: "Não autorizado" })
    }

    const result = await deleteProduct(Number(id))

    if (!result.success) {
      return res.status(404).json(result)
    }

    return res.status(200).json(result)
  }

  // Método não permitido
  return res.status(405).json({ success: false, error: "Método não permitido" })
}

// Função auxiliar para verificar se o usuário é admin
function isAdmin(session) {
  try {
    const userData = JSON.parse(session)
    return userData && userData.user_type === "admin"
  } catch (error) {
    return false
  }
}
