import { getProductsByType } from "../../../../lib/products"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Método não permitido" })
  }

  const { type } = req.query

  if (!type || (type !== "venda" && type !== "doacao")) {
    return res.status(400).json({ success: false, error: "Tipo inválido" })
  }

  const result = await getProductsByType(type)

  if (!result.success) {
    return res.status(500).json(result)
  }

  return res.status(200).json(result)
}
