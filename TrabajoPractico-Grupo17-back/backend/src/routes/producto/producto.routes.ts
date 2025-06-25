import { Router } from "express";
import { ProductoController } from "../../controller/producto.controller";

export const productoRouter = Router();
const productoController = new ProductoController();

productoRouter.get("/", productoController.getProductos.bind(productoController));
productoRouter.get("/:id", productoController.getProducto.bind(productoController));
productoRouter.post("/", productoController.createProducto.bind(productoController));
productoRouter.put("/:id", productoController.updateProducto.bind(productoController));
productoRouter.delete("/:id", productoController.deleteProducto.bind(productoController));
