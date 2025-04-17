export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Método não permitido" })
  }

  // Verificar se o usuário está autenticado
  const { session } = req.cookies

  if (!session) {
    return res.status(401).json({ success: false, error: "Não autenticado" })
  }

  try {
    const userData = JSON.parse(session)
    return res.status(200).json({ success: true, data: userData })
  } catch (error) {
    return res.status(401).json({ success: false, error: "Sessão inválida" })
  }
}
