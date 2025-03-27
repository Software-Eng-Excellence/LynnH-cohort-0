import config from "./config/index";
import logger from "./util/logger";
import { CakeOrderRepository } from "./repository/file/Cake.order.repository";
import { CakeRepository } from "./repository/postgreSQL/Cake.order.repository";
import { OrderRepository } from "./repository/postgreSQL/Order.repository";
import { CakeBuilder, IdentifiableCakeBuilder } from "../src/models/builders/cake.builder";
import { IdentifiableOrderItemBuilder, OrderBuilder } from "../src/models/builders/order.builder";
import { BookRepository } from "./repository/postgreSQL/Book.order.repository";
import { BookBuilder, IdentifiableBookBuilder } from "./models/builders/book.builder";
import { PetRepository } from "./repository/postgreSQL/Pet.order.repository";
import { IdentifiablePetBuilder, PetBuilder } from "./models/builders/pet.builder";
import { ClothingRepository } from "./repository/postgreSQL/Clothing.order.repository";
import { ClothingBuilder, IdentifiableClothingBuilder } from "./models/builders/clothing.builder";
import { ToyRepository } from "./repository/postgreSQL/Toy.order.repository";
import { IdentifiableToyBuilder, ToyBuilder } from "./models/builders/toy.builder";
import { FurnitureRepository } from "./repository/postgreSQL/Furniture.order.repository";
import { FurnitureBuilder, IdentifiableFurnitureBuilder } from "./models/builders/furniture.builder";

const { cakeOrderPath } = config.storagePath.csv;


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
   console.log("example", (await dbOrder.getAll()).length)
}

//main();
//DBSandBox();


async function postgreSQLConnection() {


   const dbOrder = new OrderRepository(new CakeRepository());
   await dbOrder.init()

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
   //await dbOrder.getAll();

   await dbOrder.create(idOrder);
   await dbOrder.get(idOrder.getId());
   //await dbOrder.update(idOrder);
   //await dbOrder.delete(idOrder.getId());
   //console.log("example", (await dbOrder.getAll()).length)
}

//postgreSQLConnection();


async function PostegreSQLBookRepo() {

   const dbOrder = new OrderRepository(new BookRepository());
   await dbOrder.init();
   const book = BookBuilder.newBuilder()
      .setTitle("The Great Gatsby")
      .setAuthor("F. Scott Fitzgerald")
      .setGenre("Classic Literature")
      .setFormat("Hardcover")
      .setLanguage("English")
      .setPublisher("Scribner")
      .setSpecialEdition("Anniversary Edition")
      .setPackaging("Slipcase")
      .build();

   const idBook = IdentifiableBookBuilder.newBuilder()
      .setBook(book)
      .setId(Math.random().toString(36).substring(2, 8))
      .build();

   const order = OrderBuilder.newBuilder()
      .setItem(idBook)
      .setPrice(209)
      .setId(Math.random().toString(36).substring(2, 8))
      .setQuantity(2)
      .build();

   const idOrder = IdentifiableOrderItemBuilder.newBuilder().setItem(idBook).setOrder(order).build();
   await dbOrder.create(idOrder);
   await dbOrder.get(idOrder.getId());
   await dbOrder.getAll()
   await dbOrder.update(idOrder);
   await dbOrder.delete(idOrder.getId());
   console.log((await dbOrder.getAll()).length);
}

//PostegreSQLBookRepo()

async function PostegreSQLPetRepo() {

   const dbOrder = new OrderRepository(new PetRepository());
   await dbOrder.init();
   const pet = PetBuilder.newBuilder()
      .setProductType("Pet Food")
      .setPetType("Dog")
      .setBrand("Healthy Paws")
      .setSize("Medium")
      .setFlavor("Chicken")
      .setEcoFriendly("Yes")
      .build();


   const idPet = IdentifiablePetBuilder
      .newBuilder()
      .setPet(pet)
      .setId(Math.random().toString(36).substring(2, 8))
      .build();

   const order = OrderBuilder.newBuilder()
      .setItem(idPet)
      .setPrice(209)
      .setId(Math.random().toString(36).substring(2, 8))
      .setQuantity(2)
      .build();

   const idOrder = IdentifiableOrderItemBuilder.newBuilder().setItem(idPet).setOrder(order).build();
   await dbOrder.create(idOrder);
   await dbOrder.get(idOrder.getId());
   //console.log(idOrder.getId())
   await dbOrder.getAll()
   await dbOrder.update(idOrder);
   await dbOrder.delete(idOrder.getId());
   console.log((await dbOrder.getAll()).length);
}
//PostegreSQLPetRepo()


async function PostegreSQLClothingRepo() {

   const dbOrder = new OrderRepository(new ClothingRepository());
   await dbOrder.init();
   const clothing = ClothingBuilder.newBuilder()
      .setType('T-shirt')
      .setSize('L')
      .setColor('Blue')
      .setMaterial('Cotton')
      .setPattern('Solid')
      .setBrand('BrandX')
      .setGender('Unisex')
      .setPackaging('Plastic')
      .setSpecialRequest('None')
      .build();


   const idPet = IdentifiableClothingBuilder
      .newBuilder()
      .setClothing(clothing)
      .setId(Math.random().toString(36).substring(2, 8))
      .build();

   const order = OrderBuilder.newBuilder()
      .setItem(idPet)
      .setPrice(209)
      .setId(Math.random().toString(36).substring(2, 8))
      .setQuantity(2)
      .build();

   const idOrder = IdentifiableOrderItemBuilder.newBuilder().setItem(idPet).setOrder(order).build();
   await dbOrder.create(idOrder);
   await dbOrder.get(idOrder.getId());
   console.log(idOrder.getId())
   await dbOrder.getAll()
   await dbOrder.update(idOrder);
   await dbOrder.delete(idOrder.getId());
   console.log((await dbOrder.getAll()).length);
}

//PostegreSQLClothingRepo()

async function PostegreSQLToyRepo() {

   const dbOrder = new OrderRepository(new ToyRepository());
   await dbOrder.init();
   const toy = ToyBuilder.newBuilder()
      .setType("Action Figure")
      .setAgeGroup("6-10")
      .setBrand("ToyCo")
      .setMaterial("Plastic")
      .setBatteryRequired(true)
      .setEducational(false)
      .build();


   const idToy = IdentifiableToyBuilder
      .newBuilder()
      .setToy(toy)
      .setId(Math.random().toString(36).substring(2, 8))
      .build();

   const order = OrderBuilder.newBuilder()
      .setItem(idToy)
      .setPrice(209)
      .setId(Math.random().toString(36).substring(2, 8))
      .setQuantity(2)
      .build();

   const idOrder = IdentifiableOrderItemBuilder.newBuilder().setItem(idToy).setOrder(order).build();
   await dbOrder.create(idOrder);
   await dbOrder.get(idOrder.getId());
   console.log(idOrder.getId())
   await dbOrder.getAll()
   await dbOrder.update(idOrder);
   //await dbOrder.delete(idOrder.getId());
   console.log((await dbOrder.getAll()).length);
}
//PostegreSQLToyRepo()


async function PostegreSQLFurnitureRepo() {

   const dbOrder = new OrderRepository(new FurnitureRepository());
   await dbOrder.init();
   const furniture = FurnitureBuilder.newBuilder()
      .setType("Sofa")
      .setMaterial("Leather")
      .setColor("Brown")
      .setSize("Large")
      .setStyle("Modern")
      .setAssemblyRequired(true)
      .setWarranty("2 Years")
      .build();


   const idFurniture = IdentifiableFurnitureBuilder
      .newBuilder()
      .setFurniture(furniture)
      .setId(Math.random().toString(36).substring(2, 8))
      .build();

   const order = OrderBuilder.newBuilder()
      .setItem(idFurniture)
      .setPrice(209)
      .setId(Math.random().toString(36).substring(2, 8))
      .setQuantity(2)
      .build();

   const idOrder = IdentifiableOrderItemBuilder.newBuilder().setItem(idFurniture).setOrder(order).build();
   await dbOrder.create(idOrder);
   await dbOrder.get(idOrder.getId());
   console.log(idOrder.getId())
   await dbOrder.getAll()
   await dbOrder.update(idOrder);
   await dbOrder.delete(idOrder.getId());
   console.log((await dbOrder.getAll()).length);
}

PostegreSQLFurnitureRepo();