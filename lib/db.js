import { neon } from "@neondatabase/serverless"

// Inicializa a conexão com o banco de dados Neon
const sql = neon(process.env.DATABASE_URL)

export { sql }
