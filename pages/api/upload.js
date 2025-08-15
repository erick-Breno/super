import { IncomingForm } from "formidable"
import fs from "fs"
import path from "path"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Método não permitido" })
  }

  const form = new IncomingForm({
    uploadDir: "./public/uploads",
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  })

  // Criar diretório de uploads se não existir
  const uploadDir = "./public/uploads"
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  try {
    const [fields, files] = await form.parse(req)

    const file = Array.isArray(files.image) ? files.image[0] : files.image

    if (!file) {
      return res.status(400).json({ success: false, error: "Nenhum arquivo enviado" })
    }

    // Verificar tipo de arquivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
    if (!allowedTypes.includes(file.mimetype)) {
      // Remover arquivo inválido
      fs.unlinkSync(file.filepath)
      return res.status(400).json({
        success: false,
        error: "Tipo de arquivo não permitido. Use JPG, JPEG, PNG ou GIF.",
      })
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const extension = path.extname(file.originalFilename || file.newFilename)
    const newFilename = `${timestamp}${extension}`
    const newPath = path.join(uploadDir, newFilename)

    // Mover arquivo para o local final
    fs.renameSync(file.filepath, newPath)

    // Retornar URL do arquivo
    const fileUrl = `/uploads/${newFilename}`

    return res.status(200).json({
      success: true,
      data: {
        url: fileUrl,
        filename: newFilename,
      },
    })
  } catch (error) {
    console.error("Erro no upload:", error)
    return res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    })
  }
}
