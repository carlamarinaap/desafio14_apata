import mongoose from "mongoose";
import { expect, should } from "chai";
import supertest from "supertest";
import { port } from "../commander.js";
const requester = supertest(`http://localhost:${port}`);

describe("Testing de integración", () => {
  describe("Test del router de productos", () => {
    it("El endpoint POST /api/products debe agregar un producto", async () => {
      const mockedProduct = {
        title: "Title",
        description: "This is a description",
        price: 1000,
        code: "code123",
        stock: 1,
        category: "Category",
      };
      const { statusCode, ok, _body } = await requester
        .post(`/api/products`)
        .send(mockedProduct);

      expect(statusCode).to.be.equal(201);
      expect(ok).to.be.true;
    });

    it("El endpoint GET /api/products debe traer todos los productos", async () => {
      const { statusCode, ok, _body } = await requester.get("/api/products").send({});
      expect(statusCode).to.be.equal(200);
      expect(ok).to.be.true;
      expect(_body).to.be.an("object");
      expect(_body.totalDocs).to.be.a("number");
      expect(_body.limit).to.be.a("number");
      expect(_body.totalPages).to.be.a("number");
      expect(_body.page).to.be.a("number");
      expect(_body.hasPrevPage).to.be.a("boolean");
      expect(_body.hasNextPage).to.be.a("boolean");
      expect(_body.payload).to.be.an("array");
    });

    it("El endpoint GET /api/products/:pid debe traer el producto con el id suministrado", async () => {
      const { _body } = await requester.get("/api/products").send({});
      const pid = _body.payload[0]._id;
      const result = await requester.get(`/api/products/${pid}`).send();
      expect(result.statusCode).to.be.equal(200);
      expect(result.ok).to.be.true;
      expect(result._body).to.be.an("object");
      expect(mongoose.isValidObjectId(result._body._id)).to.be.true;
    });
    //   it("El endpoint PUT /api/products/:pid debe actualizar un producto", async () => {
    //     const { _body } = await requester.get("/api/products").send({});
    //     const pid = _body.payload[0]._id;
    //     const result = await requester.get(`/api/products/${pid}`).send({
    //       title: "Title modified",
    //       description: "This is a description",
    //       price: 1000,
    //       stock: 10,
    //       category: "Category",
    //     });
    //     expect(result.statusCode).to.be.equal(200);
    //     expect(result.ok).to.be.true;
    //     expect(result._body).to.be.an("object");
    //     expect(mongoose.isValidObjectId(result._body._id)).to.be.true;
    //   });
    it("El endpoint DELETE /api/products/:pid debe eliminar un producto", async () => {
      const { _body } = await requester.get("/api/products").send({});
      const pid = _body.payload[0]._id;
      const result = await requester.delete(`/api/products/${pid}`).send();
    });

    //   describe("Test del router de carritos", () => {
    //     it("El endpoint GET /api/carts debe traer todos los carritos", async () => {});
    //     it("El endpoint GET /api/carts/:cid debe traer el carrito con el id suministrado", async () => {});
    //     it("El endpoint GET /api/carts/:cid/purchase debe generar el ticket de compra", async () => {});
    //     it("El endpoint POST /api/carts debe crear un carrito", async () => {});
    //     it("El endpoint POST /api/carts/:cid/products/:pid debe agregar un producto al carrito", async () => {});
    //     it("El endpoint DELETE /api/carts/:cid debe vaciar el carrito", async () => {});
    //     it("El endpoint DELETE /api/carts/:cid/products/:pid debe eliminar el producto correspondiente del carrito", async () => {});
    //     it("El endpoint PUT /api/carts/:cid debe actualizar los productos de un carrito", async () => {});
    //     it("El endpoint PUT /api/carts/:cid/products/:pid debe actualizar la cantidad de un producto en un carrito", async () => {});
    //   });

    //   describe("Test del router de usuarios", () => {
    //     it("El endpoint POST /api/sessions/register debe registrar un usuario", async () => {});
    //     it("El endpoint POST /api/sessions/login debe iniciar la sesión de un usuario", async () => {});
    //     it("El endpoint POST /api/sessions/passwordRestore debe cambiar la contraseña de un usuario", async () => {});
    //     it("El endpoint GET /api/sessions/logout debe cerrar la sesión", async () => {});
    //     it("El endpoint GET /api/sessions/github debe iniciar la sesión desde github", async () => {});
    //     it("El endpoint GET /api/sessions/current debe traer la información del usuario logueado", async () => {});
    //     it("El endpoint PUT /api/sessions/premium/:uid debe actualizar el tipo de usuario al usuario", async () => {});
    //   });
  });
});
