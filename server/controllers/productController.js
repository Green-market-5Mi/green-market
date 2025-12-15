import pool from "../config/db.js";

// Récupérer tous les produits
export const getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, sku, name, stock_quantity, price, created_at FROM products"
    );
    return res.json(rows);
  } catch (error) {
    console.error("Erreur récupération produits:", error.message);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mettre à jour le stock d'un produit
export const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity } = req.body;

    if (stock_quantity === undefined || Number.isNaN(Number(stock_quantity))) {
      return res.status(400).json({ message: "stock_quantity requis (nombre)" });
    }

    const [result] = await pool.query(
      "UPDATE products SET stock_quantity = ? WHERE id = ?",
      [Number(stock_quantity), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    const [productRows] = await pool.query(
      "SELECT id, sku, name, stock_quantity, price, created_at FROM products WHERE id = ?",
      [id]
    );

    return res.json({ message: "Stock mis à jour", product: productRows[0] });
  } catch (error) {
    console.error("Erreur mise à jour stock:", error.message);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
