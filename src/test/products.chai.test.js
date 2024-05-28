import ProductManager from "../dao/manager_mongo/productManager.js";
import mongoose from "mongoose";
import { expect } from "chai";

mongoose.connect(
  "mongodb+srv://carlaapata:Facundo1990@cluster0.ppztezy.mongodb.net/test?retryWrites=true&w=majority"
);

describe("Set de test de productos", () => {
  before(function () {
    this.pm = new ProductManager();
    this.mockedProduct = {
      title: "Title",
      description: "This is a description",
      price: 1000,
      code: "code123",
      stock: 1,
      category: "Category",
      status: true,
    };
  });
  beforeEach(function () {
    mongoose.connection.collections.products.drop();
    this.timeout(5000);
  });
  it("El DAO debe obtener todos los productos", async function () {
    const result = await this.pm.getProducts({});
    expect(result).to.be.an("object");
    expect(result.payload).to.be.an("array");
  });
  it("El DAO debe agregar un producto", async function () {
    const newProduct = await this.pm.addProduct(this.mockedProduct);
    expect(mongoose.isValidObjectId(newProduct._id)).to.be.true;
  });
  it("El DAO debe obtener un producto por id", async function () {
    const newProduct = await this.pm.addProduct(this.mockedProduct);
    const result = await this.pm.getProductById(newProduct._id);
    expect(mongoose.isValidObjectId(result._id)).to.be.true;
    expect(result).to.not.be.empty;
  });

  it("El DAO debe actualizar los datos de un producto por id", async function () {
    const newProduct = await this.pm.addProduct(this.mockedProduct);
    const updates = {
      title: "Title changed",
      description: "This is a description",
      price: 1000,
      stock: 1,
      category: "Category",
    };
    await this.pm.updateProduct(newProduct._id, updates);
    const result = await this.pm.getProductById(newProduct._id);
    expect(result).to.deep.include(updates);
  });

  it("El DAO debe eliminar un producto", async function () {
    const newProduct = await this.pm.addProduct(this.mockedProduct);
    await this.pm.deleteProduct(newProduct._id);
  });
});
