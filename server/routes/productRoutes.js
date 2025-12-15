import { Router } from "express";
import { getAllProducts, updateProductStock } from "../controllers/productController.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestion des produits
 */

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Récupérer tous les produits
 *     tags: [Products]
 *     description: "Rôles autorisés : ADMIN, LOGISTICS, CUSTOMER_SERVICE"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des produits
 *       401:
 *         description: Token manquant ou invalide
 *       500:
 *         description: Erreur serveur
 */
router.get("/", authenticate, authorizeRoles("ADMIN", "LOGISTICS", "CUSTOMER_SERVICE"), getAllProducts);

/**
 * @swagger
 * /api/v1/products/{id}/stock:
 *   patch:
 *     summary: Mettre à jour le stock d'un produit
 *     tags: [Products]
 *     description: "Rôles autorisés : ADMIN, LOGISTICS"
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [stock_quantity]
 *             properties:
 *               stock_quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Stock mis à jour
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         description: Produit introuvable
 *       500:
 *         description: Erreur serveur
 */
router.patch("/:id/stock", authenticate, authorizeRoles("ADMIN", "LOGISTICS"), updateProductStock);

export default router;
