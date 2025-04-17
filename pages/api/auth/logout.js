import cookie from "cookie"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Método não permitido" })
  }

  // Limpar cookie de sessão
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      expires: new Date(0),
      sameSite: "strict",
      path: "/",
    }),
  )

  return res.status(200).json({ success: true })
}
