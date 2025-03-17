import config from "./config";
import logger from "./util/logger";
import { CakeOrderRepository } from "./repository/file/cake.order.repository";

const { cakeOrderPath, bookOrderPath, petOrdersPath, furnitureOrdersPath, toyOrdersPath, clothingOrdersPath } = config;


async function main() {
   const repository=new CakeOrderRepository(cakeOrderPath);
   const data =await repository.get("3");
   logger.info("List of orders: \n %o",data)
}

main();