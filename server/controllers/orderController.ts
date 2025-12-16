import pool from "../config/db"
import { sendMail } from "../services/mailer.js"

const wrapEmail = ({ title, body }: { title: string; body: string }) => `
  <div style="font-family: Arial, sans-serif; background:#f6f8fb; padding:24px;">
    <div style="max-width:520px; margin:auto; background:#fff; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.06); overflow:hidden;">
      <div style="background:#0f7a4b; color:#fff; padding:16px 20px; font-size:18px; font-weight:700;">${title}</div>
      <div style="padding:20px; color:#1f2933; line-height:1.6; font-size:14px;">${body}</div>
      <div style="padding:12px 20px; font-size:12px; color:#6b7280; background:#f9fafb;">Notification Green Market</div>
    </div>
  </div>`

const renderOrderSummaryTable = (lines: any[] = []) => {
  if (!Array.isArray(lines) || lines.length === 0) return "<p>Aucune ligne</p>"

  const hasPrice = lines.some((l) => l.price !== undefined && l.price !== null)

  const rows = lines
    .map(
      (l) => `
        <tr>
          <td style="padding:8px 10px; border-bottom:1px solid #e5e7eb;">${l.quantity}</td>
          <td style="padding:8px 10px; border-bottom:1px solid #e5e7eb;">${l.sku || l.product_id}</td>
          <td style="padding:8px 10px; border-bottom:1px solid #e5e7eb;">${l.name || "Produit"}</td>
          ${
            hasPrice
              ? `<td style="padding:8px 10px; border-bottom:1px solid #e5e7eb;">${Number(l.price || 0).toFixed(2)} €</td>`
              : ""
          }
        </tr>`
    )
    .join("")

  return `
    <table style="width:100%; border-collapse:collapse; margin-top:12px; font-size:13px;">
      <thead>
        <tr style="background:#f3f4f6;">
          <th align="left" style="padding:8px 10px;">Qté</th>
          <th align="left" style="padding:8px 10px;">SKU / ID</th>
          <th align="left" style="padding:8px 10px;">Produit</th>
          ${hasPrice ? '<th align="left" style="padding:8px 10px;">Prix</th>' : ""}
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`
}

// GET /api/v1/orders
export const getOrders = async (req: any, res: any) => {
  try {
    const q = await pool.query(
      "SELECT id, external_reference, customer_name, status, tracking_number, created_at FROM orders ORDER BY created_at DESC"
    )
    return res.json(q.rows)
  } catch (error: any) {
    console.error("Erreur récupération commandes:", error?.message || error)
    return res.status(500).json({ message: "Erreur serveur" })
  }
}

// GET /api/v1/orders/:id
export const getOrderById = async (req: any, res: any) => {
  try {
    const { id } = req.params

    const ordersQ = await pool.query(
      "SELECT id, external_reference, customer_name, status, tracking_number, created_at FROM orders WHERE id = $1",
      [id]
    )

    if (ordersQ.rows.length === 0) {
      return res.status(404).json({ message: "Commande introuvable" })
    }

    const order = ordersQ.rows[0]

    const linesQ = await pool.query(
      `SELECT ol.id, ol.quantity, p.id AS product_id, p.sku, p.name, p.price
       FROM order_lines ol
       JOIN products p ON ol.product_id = p.id
       WHERE ol.order_id = $1`,
      [id]
    )

    return res.json({ ...order, lines: linesQ.rows })
  } catch (error: any) {
    console.error("Erreur récupération commande:", error?.message || error)
    return res.status(500).json({ message: "Erreur serveur" })
  }
}

// POST /api/v1/orders
export const createOrder = async (req: any, res: any) => {
  const client = await pool.connect()
  try {
    const {
      external_reference,
      customer_name,
      customer_email,
      status = "PENDING",
      tracking_number = null,
      lines = [],
    } = req.body

    if (!external_reference) {
      return res.status(400).json({ message: "external_reference requis" })
    }
    if (!Array.isArray(lines) || lines.length === 0) {
      return res.status(400).json({ message: "lines doit contenir au moins un produit" })
    }

    await client.query("BEGIN")

    const existing = await client.query("SELECT id FROM orders WHERE external_reference = $1", [external_reference])
    if (existing.rows.length > 0) {
      await client.query("ROLLBACK")
      return res.status(409).json({ message: "external_reference déjà utilisée" })
    }

    for (const line of lines) {
      if (!line.product_id || !line.quantity) {
        await client.query("ROLLBACK")
        return res.status(400).json({ message: "Chaque ligne doit avoir product_id et quantity" })
      }
      const prod = await client.query("SELECT id FROM products WHERE id = $1", [line.product_id])
      if (prod.rows.length === 0) {
        await client.query("ROLLBACK")
        return res.status(404).json({ message: `Produit ${line.product_id} introuvable` })
      }
    }

    const orderIns = await client.query(
      `INSERT INTO orders (external_reference, customer_name, status, tracking_number)
       VALUES ($1, $2, $3, $4)
       RETURNING id, external_reference, customer_name, status, tracking_number, created_at`,
      [external_reference, customer_name || null, status, tracking_number]
    )

    const order = orderIns.rows[0]

    for (const line of lines) {
      await client.query(
        "INSERT INTO order_lines (order_id, product_id, quantity) VALUES ($1, $2, $3)",
        [order.id, line.product_id, line.quantity]
      )
    }

    const createdLinesQ = await client.query(
      `SELECT ol.id, ol.quantity, p.id AS product_id, p.sku, p.name, p.price
       FROM order_lines ol
       JOIN products p ON ol.product_id = p.id
       WHERE ol.order_id = $1`,
      [order.id]
    )

    await client.query("COMMIT")

    const createdOrder = { ...order, lines: createdLinesQ.rows }

    // Notification (best effort)
    if (customer_email) {
      try {
        const htmlBody = `
          <p>Une nouvelle commande vient d'être créée.</p>
          <div style="margin-top:10px; padding:12px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px;">
            <div><strong>Référence :</strong> ${createdOrder.external_reference}</div>
            <div><strong>Client :</strong> ${createdOrder.customer_name || "N/A"}</div>
            <div><strong>Statut :</strong> ${createdOrder.status}</div>
            <div><strong>Lignes :</strong> ${createdLinesQ.rows.length}</div>
          </div>
          ${renderOrderSummaryTable(createdLinesQ.rows)}
          <p style="margin-top:12px;">Merci pour votre confiance.</p>
        `

        await sendMail({
          to: customer_email,
          subject: `Nouvelle commande ${createdOrder.external_reference}`,
          text: `Commande ${createdOrder.external_reference} créée avec ${createdLinesQ.rows.length} ligne(s). Statut: ${createdOrder.status}.`,
          html: wrapEmail({ title: "Nouvelle commande", body: htmlBody }),
        })
      } catch (mailErr: any) {
        console.warn("Envoi mail création commande échoué:", mailErr?.message || mailErr)
      }
    }

    return res.status(201).json({ message: "Commande créée", order: createdOrder })
  } catch (error: any) {
    await client.query("ROLLBACK")
    console.error("Erreur création commande:", error?.message || error)
    return res.status(500).json({ message: "Erreur serveur" })
  } finally {
    client.release()
  }
}

// PATCH /api/v1/orders/:id
export const updateOrder = async (req: any, res: any) => {
  try {
    const { id } = req.params
    const { status, tracking_number, notify_email } = req.body

    if (!status && !tracking_number) {
      return res.status(400).json({ message: "Fournir status ou tracking_number" })
    }

    const fields: string[] = []
    const values: any[] = []
    let i = 1

    if (status) {
      fields.push(`status = $${i++}`)
      values.push(status)
    }
    if (tracking_number !== undefined) {
      fields.push(`tracking_number = $${i++}`)
      values.push(tracking_number)
    }

    values.push(id)
    const idPlaceholder = `$${i}`

    const updatedQ = await pool.query(
      `UPDATE orders SET ${fields.join(", ")} WHERE id = ${idPlaceholder}
       RETURNING id, external_reference, customer_name, status, tracking_number, created_at`,
      values
    )

    if (updatedQ.rows.length === 0) {
      return res.status(404).json({ message: "Commande introuvable" })
    }

    const updated = updatedQ.rows[0]

    // Notification (best effort)
    if (notify_email) {
      try {
        const htmlBody = `
          <p>Les informations de la commande ont été mises à jour.</p>
          <div style="margin-top:10px; padding:12px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px;">
            <div><strong>Référence :</strong> ${updated.external_reference}</div>
            <div><strong>Statut :</strong> ${updated.status}</div>
            ${updated.tracking_number ? `<div><strong>Tracking :</strong> ${updated.tracking_number}</div>` : ""}
          </div>
        `

        await sendMail({
          to: notify_email,
          subject: `Commande ${updated.external_reference} mise à jour`,
          text: `Statut: ${updated.status}${updated.tracking_number ? `, Tracking: ${updated.tracking_number}` : ""}`,
          html: wrapEmail({ title: "Commande mise à jour", body: htmlBody }),
        })
      } catch (mailErr: any) {
        console.warn("Envoi mail MAJ commande échoué:", mailErr?.message || mailErr)
      }
    }

    return res.json({ message: "Commande mise à jour", order: updated })
  } catch (error: any) {
    console.error("Erreur mise à jour commande:", error?.message || error)
    return res.status(500).json({ message: "Erreur serveur" })
  }
}

// DELETE /api/v1/orders/:id
export const deleteOrder = async (req: any, res: any) => {
  try {
    const { id } = req.params

    // order_lines ON DELETE CASCADE -> un seul delete suffit
    const del = await pool.query("DELETE FROM orders WHERE id = $1", [id])

    if (del.rowCount === 0) {
      return res.status(404).json({ message: "Commande introuvable" })
    }

    return res.json({ message: "Commande supprimée" })
  } catch (error: any) {
    console.error("Erreur suppression commande:", error?.message || error)
    return res.status(500).json({ message: "Erreur serveur" })
  }
}
