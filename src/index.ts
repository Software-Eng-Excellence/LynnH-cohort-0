import config from "./config";
import logger from "./util/logger";
import parseCSV from "./util/parsers/csvParser";
import parseJSONFile from "./util/parsers/jsonParser";
import parseXML from "./util/parsers/xmlParser";
import { CSVCakeMapper } from "./mappers/Cake.mapper";
import { CSVOrderMapper } from "./mappers/Order.mapper";
import { CSVClothingMapper } from "./mappers/Clothing.mapper";
import { JSONBookMapper } from "./mappers/Book.mapper";
import { JSONPetMapper } from "./mappers/pet.mapper";
import { XMLToyMapper } from "./mappers/toy.mapper";
import { XMLFurnitureMapper } from "./mappers/furniture.mapper";

const { cakeOrderPath, bookOrderPath, petOrdersPath, furnitureOrdersPath, toyOrdersPath, clothingOrdersPath } = config;

// Fetching all cake orders
async function fetchOrdersFromFile(filePath: string, parser: Function) {
    const orders = await parser(filePath);

    //for each cakeData log the row
    orders.forEach((order: Object) => {
        logger.info(JSON.stringify(order))
    });

}

async function fetchAllOrders() {
    //await fetchOrdersFromFile(cakeOrderPath, parseCSV);
    await fetchOrdersFromFile(bookOrderPath, parseJSONFile);
    //await fetchOrdersFromFile(petOrdersPath, parseJSONFile);
    //await fetchOrdersFromFile(furnitureOrdersPath, parseXML);
    //await fetchOrdersFromFile(toyOrdersPath, parseXML);
}

//fetchAllOrders();

async function main() {
    try {
        const cakeData = await parseCSV(cakeOrderPath)
        const cakeMapper = new CSVCakeMapper();
        const cakes = cakeData.map(cakeMapper.map)

        const clothingData = await parseCSV(clothingOrdersPath)

        const clothingMapper = new CSVClothingMapper();
        const clothings = clothingData.map(clothingMapper.map)


        //logger.info("List of cakes \n %o", cakes)
        const cakeOrderMapper = new CSVOrderMapper(cakeMapper);
        const cakeOrders = cakeData.map(cakeOrderMapper.map.bind(cakeOrderMapper));
        //or  cakeData.map((row)=>orderMapper.map(row));
        logger.info("List of orders \n %o", cakeOrders);

        const clothingOrderMapper = new CSVOrderMapper(clothingMapper);
        const clothingOrders = clothingData.map(clothingOrderMapper.map.bind(clothingOrderMapper));
        logger.info("List of clothing orders \n %o", clothingOrders);

        const bookData: { [key: string]: string; }[] = await parseJSONFile(bookOrderPath);

        const bookMapper = new JSONBookMapper();
        const bookOrders = bookData.map(bookMapper.map.bind(bookMapper));

        logger.info("List of book orders \n %o", bookOrders);
        const petData: { [key: string]: string; }[] = await parseJSONFile(petOrdersPath);
        const petMapper = new JSONPetMapper();
        const petOrders = petData.map(petMapper.map.bind(petMapper));
        logger.info("List of pet orders \n %o", petOrders);

        const toyData: { [key: string]: string; }[] = await parseXML(toyOrdersPath);
        const toyMapper = new XMLToyMapper();
        const toyOrders = toyData.map(toyMapper.map.bind(toyMapper));
        logger.info("List of toy orders \n %o", toyOrders);

        const furnitureData: { [key: string]: string; }[] = await parseXML(furnitureOrdersPath);
        const furnitureMapper = new XMLFurnitureMapper();
        const furnitureOrders = furnitureData.map(furnitureMapper.map.bind(furnitureMapper));
        logger.info("List of furniture orders \n %o", furnitureOrders);
    } catch (error) {
        logger.error(error);
    }
}

main();