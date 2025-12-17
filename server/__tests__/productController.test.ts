import { createProduct } from "../controllers/productController"
import pool from "../config/db"

type MockResponse = {
  status: jest.Mock
  json: jest.Mock
}

jest.mock("../config/db", () => {
  const query = jest.fn()
  const connect = jest.fn(async () => ({ query, release: jest.fn() }))
  return { __esModule: true, default: { query, connect } }
})

const mockRes = (): MockResponse => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe("createProduct", () => {
  const queryMock = (pool as any).query as jest.Mock<any, any>
  const connectMock = (pool as any).connect as jest.Mock<any, any>

  beforeEach(() => {
    queryMock.mockReset()
    connectMock.mockReset()
  })

  it("retourne 400 si sku ou name manquent", async () => {
    const req: any = { body: { name: "Produit test" } }
    const res = mockRes()

    await createProduct(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: "sku et name sont requis" })
    expect(queryMock).not.toHaveBeenCalled()
  })

  it("retourne 409 si le SKU existe déjà", async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] })

    const req: any = { body: { sku: "SKU123", name: "Produit" } }
    const res = mockRes()

    await createProduct(req, res)

    expect(queryMock).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({ message: "SKU déjà utilisé" })
  })

  it("crée un produit et renvoie 201", async () => {
    queryMock.mockResolvedValueOnce({ rows: [] })
    queryMock.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          sku: "SKU123",
          name: "Produit",
          stock_quantity: 5,
          price: 10,
          created_at: "2025-01-01",
        },
      ],
    })

    const req: any = { body: { sku: "SKU123", name: "Produit", stock_quantity: 5, price: 10 } }
    const res = mockRes()

    await createProduct(req, res)

    expect(queryMock).toHaveBeenCalledTimes(2)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      message: "Produit créé",
      product: {
        id: 1,
        sku: "SKU123",
        name: "Produit",
        stock_quantity: 5,
        price: 10,
        created_at: "2025-01-01",
      },
    })
  })
})
