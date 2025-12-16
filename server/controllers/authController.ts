import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import pool from "../config/db"

dotenv.config()

const ALLOWED_ROLES = ["ADMIN", "LOGISTICS", "CUSTOMER_SERVICE"]

export const register = async (req: any, res: any) => {
  try {
    const { email, password, role = "LOGISTICS" } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" })
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email])
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Utilisateur déjà existant" })
    }

    const normalizedRole = String(role || "LOGISTICS").toUpperCase()
    if (!ALLOWED_ROLES.includes(normalizedRole)) {
      return res.status(400).json({ message: "Rôle invalide" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const inserted = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role",
      [email, hashedPassword, normalizedRole]
    )

    const user = inserted.rows[0]
    const payload = { id: user.id, email: user.email, role: user.role }

    const token = jwt.sign(payload, process.env.JWT_SECRET || "changeme", {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    })

    return res.status(201).json({
      message: "Utilisateur créé",
      user,
      token,
    })
  } catch (error: any) {
    console.error("Erreur inscription:", error?.message || error)
    return res.status(500).json({ message: "Erreur serveur" })
  }
}

export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" })
    }

    const q = await pool.query("SELECT id, email, role, password FROM users WHERE email = $1", [email])
    if (q.rows.length === 0) {
      return res.status(401).json({ message: "Identifiants invalides" })
    }

    const user = q.rows[0]
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: "Identifiants invalides" })
    }

    const payload = { id: user.id, email: user.email, role: user.role }
    const token = jwt.sign(payload, process.env.JWT_SECRET || "changeme", {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    })

    return res.json({
      message: "Connexion réussie",
      user: { id: user.id, email: user.email, role: user.role },
      token,
    })
  } catch (error: any) {
    console.error("Erreur connexion:", error?.message || error)
    return res.status(500).json({ message: "Erreur serveur" })
  }
}
