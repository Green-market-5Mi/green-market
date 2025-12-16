import pool from "../config/db"

// GET /api/v1/products
export const getAllProducts = async (req: any, res: any) => {
  try {
    const q = await pool.query("SELECT id, sku, name, stock_quantity, price, created_at FROM products ORDER BY created_at DESC")
    return res.json(q.rows)
  } catch (error: any) {
    console.error("Erreur récupération produits:", error?.message || error)
    return res.status(500).json({ message: "Erreur serveur" })
  }
}

// POST /api/v1/products
export const createProduct = async (req: any, res: any) => {
  try {
    const { sku, name, stock_quantity = 0, price = null } = req.body

    if (!sku || !name) {
      return res.status(400).json({ message: "sku et name sont requis" })
    }

    const existing = await pool.query("SELECT id FROM products WHERE sku = $1", [sku])
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "SKU déjà utilisé" })
    }

    const ins = await pool.query(
      "INSERT INTO products (sku, name, stock_quantity, price) VALUES ($1, $2, $3, $4) RETURNING id, sku, name, stock_quantity, price, created_at",
      [sku, name, Number(stock_quantity) || 0, price]
    )

    return res.status(201).json({ message: "Produit créé", product: ins.rows[0] })
  } catch (error: any) {
    console.error("Erreur création produit:", error?.message || error)
    return res.status(500).json({ message: "Erreur serveur" })
  }
}

// PATCH /api/v1/products/:id/stock
export const updateProductStock = async (req: any, res: any) => {
  try {
    const { id } = req.params
    const { stock_quantity } = req.body

    if (stock_quantity === undefined || Number.isNaN(Number(stock_quantity))) {
      return res.status(400).json({ message: "stock_quantity requis (nombre)" })
    }

    const upd = await pool.query(
      "UPDATE products SET stock_quantity = $1 WHERE id = $2 RETURNING id, sku, name, stock_quantity, price, created_at",
      [Number(stock_quantity), id]
    )

    if (upd.rows.length === 0) {
      return res.status(404).json({ message: "Produit introuvable" })
    }

    return res.json({ message: "Stock mis à jour", product: upd.rows[0] })
  } catch (error: any) {
    console.error("Erreur mise à jour stock:", error?.message || error)
    return res.status(500).json({ message: "Erreur serveur" })
  }
}

// PATCH /api/v1/products/:id
export const updateProduct = async (req: any, res: any) => {
  try {
    const { id } = req.params
    const { name, sku, price } = req.body

    if (!name && !sku && price === undefined) {
      return res.status(400).json({
        message: "Fournir au moins un champ à mettre à jour (name, sku, price)",
      })
    }

    if (sku) {
      const existing = await pool.query("SELECT id FROM products WHERE sku = $1 AND id <> $2", [sku, id])
      if (existing.rows.length > 0) {
        return res.status(409).json({ message: "SKU déjà utilisé" })
      }
    }

    const fields: string[] = []
    const values: any[] = []
    let i = 1

    if (name) {
      fields.push(`name = $${i++}`)
      values.push(name)
    }
    if (sku) {
      fields.push(`sku = $${i++}`)
      values.push(sku)
    }
    if (price !== undefined) {
      fields.push(`price = $${i++}`)
      values.push(price)
    }

    values.push(id)
    const idPlaceholder = `$${i}`

    const upd = await pool.query(
      `UPDATE products SET ${fields.join(", ")} WHERE id = ${idPlaceholder}
       RETURNING id, sku, name, stock_quantity, price, created_at`,
      values
    )

    if (upd.rows.length === 0) {
      return res.status(404).json({ message: "Produit introuvable" })
    }

    return res.json({ message: "Produit mis à jour", product: upd.rows[0] })
  } catch (error: any) {
    console.error("Erreur mise à jour produit:", error?.message || error)
    return res.status(500).json({ message: "Erreur serveur" })
  }
}

// DELETE /api/v1/products/:id
export const deleteProduct = async (req: any, res: any) => {
  try {
    const { id } = req.params

    const del = await pool.query("DELETE FROM products WHERE id = $1", [id])

    if (del.rowCount === 0) {
      return res.status(404).json({ message: "Produit introuvable" })
    }

    return res.json({ message: "Produit supprimé" })
  } catch (error: any) {
    console.error("Erreur suppression produit:", error?.message || error)
    return res.status(500).json({ message: "Erreur serveur" })
  }
}
