import { createUser } from "../../../lib/users"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Método não permitido" })
  }

  const { email, password, user_type = "cliente" } = req.body

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Email e senha são obrigatórios" })
  }

  // Validar tipo de usuário
  if (user_type !== "cliente" && user_type !== "admin") {
    return res.status(400).json({ success: false, error: "Tipo de usuário inválido" })
  }

  const result = await createUser({ email, password, user_type })

  if (!result.success) {
    return res.status(400).json(result)
  }

  return res.status(201).json(result)
}
