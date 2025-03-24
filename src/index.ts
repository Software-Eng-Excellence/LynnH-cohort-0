import config from "./config/index";
import logger from "./util/logger";
import { CakeOrderRepository } from "./repository/file/Cake.order.repository";
import { CakeRepository } from "./repository/sqlite/Cake.order.repository";
import { OrderRepository } from "./repository/sqlite/Order.repository";
import { CakeBuilder, IdentifiableCakeBuilder } from "../src/models/builders/cake.builder";
import { IdentifiableOrderItemBuilder, OrderBuilder } from "../src/models/builders/order.builder";
import { ConnectionManager } from "./repository/postgreSQL/ConnectionManager";

const { cakeOrderPath } = config.storagePath.csv;
console.log(config.dbConnection)

async function main() {
   const repository = new CakeOrderRepository(cakeOrderPath);
   const data = await repository.get("3");
   logger.info("List of orders: \n %o", data)
}

async function DBSandBox() {
   const dbOrder = new OrderRepository(new CakeRepository());
   await dbOrder.init()

   //create identifiable cake
   const cake = CakeBuilder.newBuilder()
      .setType("Chocolate Cake")
      .setFlavor("Chocolate")
      .setFilling("Vanilla Cream")
      .setSize(8)
      .setLayers(3)
      .setFrostingType("Buttercream")
      .setFrostingFlavor("Chocolate")
      .setDecorationType("Sprinkles")
      .setDecorationColor("Rainbow")
      .setCustomMessage("Happy Birthday!")
      .setShape("Round")
      .setAllergies("None")
      .setSpecialIngredients("Organic Cocoa")
      .setPackagingType("Box")
      .build();

   const idCake = IdentifiableCakeBuilder.newBuilder().setCake(cake).setId(Math.random().toString(36).substring(2, 8)).build();
   const order = OrderBuilder.newBuilder()
      .setItem(idCake)
      .setPrice(209)
      .setId(Math.random().toString(36).substring(2, 8))
      .setQuantity(2)
      .build();
   const idOrder = IdentifiableOrderItemBuilder.newBuilder().setItem(idCake).setOrder(order).build();
   await dbOrder.create(idOrder);
   await dbOrder.delete(idOrder.getId());
   await dbOrder.update(idOrder);
   console.log("example",(await dbOrder.getAll()).length)
}

//main();
//DBSandBox();


async function testDBConnection() {
   try {
       const connection = await ConnectionManager.getConnection();
       console.log("✅ Database connected successfully!");
     
   } catch (error) {
       console.error("❌ Database connection failed:", error);
   }
}

testDBConnection();
