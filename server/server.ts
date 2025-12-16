import express, { type Express, type Request, type Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"
import swaggerJsdoc from "swagger-jsdoc"
import path from "path"
import { fileURLToPath } from "url"

import productRoutes from "./routes/productRoutes"
import orderRoutes from "./routes/orderRoutes"
import authRoutes from "./routes/authRoutes"
import { testConnection } from "./config/db"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app: Express = express()

// Middleware globaux
app.use(cors())
app.use(express.json())

// Swagger
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "GreenMarket Orders API",
    version: "1.0.0",
    description: "API logistique GreenMarket (auth, produits, commandes)",
  },
  servers: [{ url: process.env.BASE_URL || "http://localhost:3001/api/v1" }],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
}

// ⚠️ Certains types de swagger-jsdoc exigent swaggerDefinition + champs supplémentaires
const swaggerOptions = {
  swaggerDefinition,
  definition: swaggerDefinition, // garde aussi "definition" pour compat
  apis: [
    path.join(__dirname, "routes", "*.ts").replace(/\\/g, "/"),
    path.join(__dirname, "routes", "*.js").replace(/\\/g, "/"),
  ],
  encoding: "utf8",
  failOnErrors: true,
  verbose: false,
  format: "json",
}

const swaggerSpec = swaggerJsdoc(swaggerOptions as any)

// Routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/products", productRoutes)
app.use("/api/v1/orders", orderRoutes)

// Healthcheck
app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.json({ ok: true, message: "API opérationnelle" })
})

// Documentation Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route non trouvée" })
})

const PORT = Number(process.env.PORT || 3001)

// Start
async function start() {
  try {
    await testConnection()
    console.log("Connexion Postgres OK (Supabase)")
    app.listen(PORT, () => {
      console.log(`API démarrée sur http://localhost:${PORT}`)
      console.log(`Swagger disponible sur http://localhost:${PORT}/api-docs`)
    })
  } catch (error: any) {
    console.error("Impossible de démarrer le serveur (DB KO)", error?.message || error)
    process.exit(1)
  }
}

start()
