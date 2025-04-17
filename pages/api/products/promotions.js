import { getPromotionProducts } from "../../../lib/products"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Método não permitido" })
  }

  const result = await getPromotionProducts()

  if (!result.success) {
    return res.status(500).json(result)
  }

  return res.status(200).json(result)
}
