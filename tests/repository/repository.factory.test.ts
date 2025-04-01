
import { ItemCategory } from "../../src/models/IItem";
import { CakeOrderRepository } from "../../src/repository/file/Cake.order.repository";
import { PostgreSQLOrderRepository } from "../../src/repository/postgreSQL/Order.repository";
import {DBMode, RepositoryFactory} from "../../src/repository/RepositoryFactory";
import { OrderRepository } from "../../src/repository/sqlite/Order.repository";


// Mock the required repositories and dependencies
jest.mock('../../src/repository/postgreSQL/Order.repository');
jest.mock('../../src/repository/file/Cake.order.repository');
jest.mock('../../src/repository/sqlite/Order.repository');


describe('RepositoryFactory', () => {

  it('should return PostgreSQLCakeRepository for DBMode.POSTGRESQL and ItemCategory.CAKE', async () => {
    const repository = await RepositoryFactory.create(DBMode.POSTGRESQL, ItemCategory.CAKE);
    expect(repository).toBeInstanceOf(PostgreSQLOrderRepository);
    
  });
  it('should return PostgreSQLOrderRepository for DBMode.POSTGRESQL and ItemCategory.CAKE', async () => {
    const repository = await RepositoryFactory.create(DBMode.POSTGRESQL, ItemCategory.CAKE);
    expect(repository).toBeInstanceOf(PostgreSQLOrderRepository);
  });

  it('should return PostgreSQLOrderRepository for DBMode.POSTGRESQL and ItemCategory.CLOTHING', async () => {
    const repository = await RepositoryFactory.create(DBMode.POSTGRESQL, ItemCategory.CLOTHING);
    expect(repository).toBeInstanceOf(PostgreSQLOrderRepository);
  });

  it('should return PostgreSQLOrderRepository for DBMode.POSTGRESQL and ItemCategory.BOOK', async () => {
    const repository = await RepositoryFactory.create(DBMode.POSTGRESQL, ItemCategory.BOOK);
    expect(repository).toBeInstanceOf(PostgreSQLOrderRepository);
  });

  it('should return PostgreSQLOrderRepository for DBMode.POSTGRESQL and ItemCategory.FURNITURE', async () => {
    const repository = await RepositoryFactory.create(DBMode.POSTGRESQL, ItemCategory.FURNITURE);
    expect(repository).toBeInstanceOf(PostgreSQLOrderRepository);
  });

  it('should return PostgreSQLOrderRepository for DBMode.POSTGRESQL and ItemCategory.PET', async () => {
    const repository = await RepositoryFactory.create(DBMode.POSTGRESQL, ItemCategory.PET);
    expect(repository).toBeInstanceOf(PostgreSQLOrderRepository);
  });

  it('should return PostgreSQLOrderRepository for DBMode.POSTGRESQL and ItemCategory.TOY', async () => {
    const repository = await RepositoryFactory.create(DBMode.POSTGRESQL, ItemCategory.TOY);
    expect(repository).toBeInstanceOf(PostgreSQLOrderRepository);
  });


  it('should throw error for unsupported category in POSTGRESQL mode', async () => {
    await expect(RepositoryFactory.create(DBMode.POSTGRESQL, ItemCategory.Test))
      .rejects
      .toThrowError('Unsupported category');
  });


  it('should return CakeOrderRepository for DBMode.SQLITE and ItemCategory.CAKE', async () => {
    const repository = await RepositoryFactory.create(DBMode.SQLITE, ItemCategory.CAKE);
    expect(repository).toBeInstanceOf(OrderRepository);
  });

  it('should return OrderRepository for DBMode.File and ItemCategory.CAKE', async () => {
    const repository = await RepositoryFactory.create(DBMode.FILE, ItemCategory.CAKE);
    expect(repository).toBeInstanceOf(CakeOrderRepository);
  });

  it('should throw error for invalid DB mode even with valid category', async () => {
    await expect(RepositoryFactory.create(DBMode.TEST, ItemCategory.CAKE))
      .rejects
      .toThrowError('Unsupported DB mode');
  });

  it('should throw error for unsupported category in SQLITE mode', async () => {
    await expect(RepositoryFactory.create(DBMode.SQLITE, ItemCategory.Test))
      .rejects
      .toThrowError('Unsupported category');
  });
});
