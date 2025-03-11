import config from "./config";
import logger from "./util/logger";
import parseCSV from "./util/parsers/csvParser";
import parseJSONFile from "./util/parsers/jsonParser";
import parseXML from "./util/parsers/xmlParser";
import { CakeBuilder } from "./models/builders/cake.builder";

const { cakeOrderPath, bookOrderPath, petOrdersPath, furnitureOrdersPath, toyOrdersPath } = config;

// Fetching all cake orders
async function fetchOrdersFromFile(filePath: string, parser: Function) {
    const orders = await parser(filePath);

    //for each data log the row
    orders.forEach((order: Object) => {
        logger.info(JSON.stringify(order))
    });

}

async function fetchAllOrders() {
    await fetchOrdersFromFile(cakeOrderPath, parseCSV);
    await fetchOrdersFromFile(bookOrderPath, parseJSONFile);
    await fetchOrdersFromFile(petOrdersPath, parseJSONFile);
    await fetchOrdersFromFile(furnitureOrdersPath, parseXML);
    await fetchOrdersFromFile(toyOrdersPath, parseXML);
}

//fetchAllOrders();

async function main() {
    const cakeBuilder = new CakeBuilder();
    //method chaining 
    cakeBuilder.setType("type")
        .setFlavor("chocolate")
        .setFilling("strawberry")
        .setSize(10)
        .setLayers(3)
        .setFrostingType("buttercream")
        .setFrostingFlavor("vanilla")
        .setDecorationType("flowers")
        .setDecorationColor("red")
        .setCustomMessage("Happy Birthday")
        .setShape("round")
        .setAllergies("nuts")
        .setSpecialIngredients("organic flour")
        .setPackagingType("box");

    const cake = cakeBuilder.build();
    console.log(cake);
}
main();



