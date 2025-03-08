import config from "./config";
import logger from "./util/logger";
import parseCSV from "./util/parsers/csvParser";
import parseJSONFile from "./util/parsers/jsonParser";
import parseXML from "./util/parsers/xmlParser";

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

fetchAllOrders();