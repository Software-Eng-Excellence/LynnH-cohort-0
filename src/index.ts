import config from "./config";
import logger from "./util/logger";
import parseCSV from "./util/parsers/csvParser";
import parseJSONFile from "./util/parsers/jsonParser";
import parseXML from "./util/parsers/xmlParser";
import { CakeBuilder } from "./models/builders/cake.builder";
import { BookBuilder } from "./models/builders/book.builder";
import { ClothingBuilder } from "./models/builders/clothing.builder";
import { FurnitureBuilder } from "./models/builders/furniture.builder";
import { PetBuilder } from "./models/builders/pet.builder";
import { ToyBuilder } from "./models/builders/toy.builder";

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

    const bookBuilder = new BookBuilder();
    bookBuilder.setTitle("The Great Gatsby")
        .setAuthor("F. Scott Fitzgerald")
        .setGenre("Fiction")
        .setFormat("Hardcover")
        .setLanguage("English")
        .setPublisher("Scribner")
        .setSpecialEdition("First Edition")
        .setPackaging("Slipcase");

    const book = bookBuilder.build();
    console.log(book);

    const clothingBuilder = new ClothingBuilder();
    clothingBuilder.setType("T-Shirt")
        .setSize("M")
        .setColor("Blue")
        .setMaterial("Cotton")
        .setPattern("Solid")
        .setBrand("BrandName")
        .setGender("Unisex")
        .setPackaging("Plastic Bag")
        .setSpecialRequest("None");

    const clothing = clothingBuilder.build();
    console.log(clothing);
    const furnitureBuilder = new FurnitureBuilder();
    furnitureBuilder.setType("Chair")
        .setMaterial("Wood")
        .setColor("Brown")
        .setSize("Medium")
        .setStyle("Modern")
        .setAssemblyRequired(true)
        .setWarranty("2 years");

    const furniture = furnitureBuilder.build();
    console.log(furniture);

    const petBuilder = new PetBuilder();
    petBuilder.setProductType("Food")
        .setPetType("Dog")
        .setBrand("BrandName")
        .setSize("Large")
        .setFlavor("Chicken")
        .setEcoFriendly("Yes");

    const pet = petBuilder.build();
    console.log(pet);
    const toyBuilder = new ToyBuilder();
    toyBuilder.setType("Action Figure")
        .setAgeGroup("5+")
        .setBrand("ToyBrand")
        .setMaterial("Plastic")
        .setBatteryRequired(true)
        .setEducational(true);

    const toy = toyBuilder.build();
    console.log(toy);
}
main();



