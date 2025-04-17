import { searchProducts } from "../../../lib/products"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Método não permitido" })
  }

  const { term } = req.query

  if (!term) {
    return res.status(400).json({ success: false, error: "Termo de busca não especificado" })
  }

  const result = await searchProducts(term)

  if (!result.success) {
    return res.status(500).json(result)
  }

  return res.status(200).json(result)
}
