import { getProductsByCategory } from "../../../../lib/products"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Método não permitido" })
  }

  const { category } = req.query

  if (!category) {
    return res.status(400).json({ success: false, error: "Categoria não especificada" })
  }

  const result = await getProductsByCategory(category)

  if (!result.success) {
    return res.status(500).json(result)
  }

  return res.status(200).json(result)
}
