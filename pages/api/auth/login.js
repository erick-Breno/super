import { validateUser } from "../../../lib/users"
import cookie from "cookie"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Método não permitido" })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Email e senha são obrigatórios" })
  }

  const result = await validateUser(email, password)

  if (!result.success) {
    return res.status(401).json(result)
  }

  // Definir cookie de sessão
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(
      "session",
      JSON.stringify({
        id: result.data.id,
        email: result.data.email,
        user_type: result.data.user_type,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 60 * 60 * 24 * 7, // 1 semana
        sameSite: "strict",
        path: "/",
      },
    ),
  )

  return res.status(200).json(result)
}
