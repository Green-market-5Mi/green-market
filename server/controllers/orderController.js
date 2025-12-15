import pool from "../config/db.js";

// Récupérer toutes les commandes (simple liste)
export const getOrders = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, external_reference, customer_name, status, tracking_number, created_at FROM orders ORDER BY created_at DESC"
    );
    return res.json(rows);
  } catch (error) {
    console.error("Erreur récupération commandes:", error.message);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer une commande avec ses lignes + produits
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await pool.query(
      "SELECT id, external_reference, customer_name, status, tracking_number, created_at FROM orders WHERE id = ?",
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    const order = orders[0];

    const [lines] = await pool.query(
      `SELECT ol.id, ol.quantity, p.id AS product_id, p.sku, p.name, p.price
       FROM order_lines ol
       JOIN products p ON ol.product_id = p.id
       WHERE ol.order_id = ?`,
      [id]
    );

    return res.json({ ...order, lines });
  } catch (error) {
    console.error("Erreur récupération commande:", error.message);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// Créer une commande + lignes
export const createOrder = async (req, res) => {
  let connection;
  try {
    const { external_reference, customer_name, status = "PENDING", tracking_number = null, lines = [] } = req.body;

    if (!external_reference) {
      return res.status(400).json({ message: "external_reference requis" });
    }
    if (!Array.isArray(lines) || lines.length === 0) {
      return res.status(400).json({ message: "lines doit contenir au moins un produit" });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Vérifier unicité de la ref externe
    const [existing] = await connection.query(
      "SELECT id FROM orders WHERE external_reference = ?",
      [external_reference]
    );
    if (existing.length > 0) {
      await connection.rollback();
      return res.status(409).json({ message: "external_reference déjà utilisée" });
    }

    // Vérifier existence des produits
    for (const line of lines) {
      if (!line.product_id || !line.quantity) {
        await connection.rollback();
        return res.status(400).json({ message: "Chaque ligne doit avoir product_id et quantity" });
      }
      const [prod] = await connection.query("SELECT id FROM products WHERE id = ?", [line.product_id]);
      if (prod.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: `Produit ${line.product_id} introuvable` });
      }
    }

    // Insertion commande
    const [orderResult] = await connection.query(
      "INSERT INTO orders (external_reference, customer_name, status, tracking_number) VALUES (?, ?, ?, ?)",
      [external_reference, customer_name || null, status, tracking_number]
    );

    const orderId = orderResult.insertId;

    // Insertion lignes
    for (const line of lines) {
      await connection.query(
        "INSERT INTO order_lines (order_id, product_id, quantity) VALUES (?, ?, ?)",
        [orderId, line.product_id, line.quantity]
      );
    }

    await connection.commit();

    const [createdOrderRows] = await connection.query(
      "SELECT id, external_reference, customer_name, status, tracking_number, created_at FROM orders WHERE id = ?",
      [orderId]
    );
    const [createdLines] = await connection.query(
      `SELECT ol.id, ol.quantity, p.id AS product_id, p.sku, p.name, p.price
       FROM order_lines ol
       JOIN products p ON ol.product_id = p.id
       WHERE ol.order_id = ?`,
      [orderId]
    );

    return res.status(201).json({
      message: "Commande créée",
      order: { ...createdOrderRows[0], lines: createdLines },
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Erreur création commande:", error.message);
    return res.status(500).json({ message: "Erreur serveur" });
  } finally {
    if (connection) connection.release();
  }
};

// Mettre à jour statut/tracking
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, tracking_number } = req.body;

    if (!status && !tracking_number) {
      return res.status(400).json({ message: "Fournir status ou tracking_number" });
    }

    // Construction dynamique
    const fields = [];
    const values = [];
    if (status) {
      fields.push("status = ?");
      values.push(status);
    }
    if (tracking_number) {
      fields.push("tracking_number = ?");
      values.push(tracking_number);
    }
    values.push(id);

    const [result] = await pool.query(
      `UPDATE orders SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    const [orderRows] = await pool.query(
      "SELECT id, external_reference, customer_name, status, tracking_number, created_at FROM orders WHERE id = ?",
      [id]
    );

    return res.json({ message: "Commande mise à jour", order: orderRows[0] });
  } catch (error) {
    console.error("Erreur mise à jour commande:", error.message);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer une commande
export const deleteOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    await connection.beginTransaction();

    // Supprimer les lignes d'abord pour respecter les contraintes FK éventuelles
    await connection.query("DELETE FROM order_lines WHERE order_id = ?", [id]);
    const [result] = await connection.query("DELETE FROM orders WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ message: "Commande introuvable" });
    }

    await connection.commit();
    connection.release();
    return res.json({ message: "Commande supprimée" });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("Erreur suppression commande:", error.message);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
