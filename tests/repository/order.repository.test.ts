import { PostgreSQLOrderRepository } from "../../src/repository/postgreSQL/Order.repository";
import { ConnectionManager } from "../../src/repository/postgreSQL/ConnectionManager";
import { IIdentifiableOrderItem } from "../../src/models/IOrder";
import { IIdentifiableItem, ItemCategory } from "../../src/models/IItem";
import { DbException, InitializationException } from "../../src/util/exceptions/RepositoryException";
import { Client } from "pg";
import logger from "../../src/util/logger";


jest.mock("../../src/repository/postgreSQL/ConnectionManager");

// Create a mock database client
const mockDb = {
    query: jest.fn(),
    end: jest.fn(),
    connect: jest.fn(),
    release: jest.fn(),
    port: 5432,
    host: "localhost",
    ssl: false,
    user: "test_user",
    database: "test_db",
    password: "test_password",
} as unknown as Client;

ConnectionManager.getConnection = jest.fn(() => Promise.resolve(mockDb));

const mockItem = {
    getId: jest.fn(() => "item-123"),  // Mocking getId
    getCategory: jest.fn(() => "Electronics" as ItemCategory),  // Mocking getCategory
};

// Create a mock order
const mockOrder: IIdentifiableOrderItem = {
    getId: jest.fn(() => "order-123"),
    getQuantity: jest.fn(() => 2),
    getPrice: jest.fn(() => 100),
    getItem: jest.fn(() => mockItem),
};

// Mock item repository
const mockItemRepository = {
    init: jest.fn(),
    create: jest.fn(() => Promise.resolve("item-123")),
    get: jest.fn(() => Promise.resolve(mockItem)),
    getAll: jest.fn(() => Promise.resolve([mockItem])),
    update: jest.fn(),
    delete: jest.fn()
};

describe("OrderRepository", () => {
    let repository: PostgreSQLOrderRepository;

    beforeEach(() => {
        repository = new PostgreSQLOrderRepository(mockItemRepository);
        jest.clearAllMocks();
    });

    describe("Initialization", () => {
        it("should initialize the order table successfully and log the message", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            const infoSpy = jest.spyOn(logger, "info").mockImplementation(() => logger);
            await expect(repository.init()).resolves.not.toThrow();
            expect(mockItemRepository.init).toHaveBeenCalled();
            expect(infoSpy).toHaveBeenCalledWith("Order Table initialized");
            infoSpy.mockRestore();
        });

        it("should throw InitializationException if initialization fails", async () => {
            (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));
            await expect(repository.init()).rejects.toThrow(InitializationException);
        });
    });

    describe("Create Operation", () => {
        it("should create a new order entry successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.create(mockOrder)).resolves.toEqual("order-123");
            expect(mockItemRepository.create).toHaveBeenCalledWith(mockItem);
        });


    });

    describe("Read Operations", () => {
        it("should retrieve an order by ID successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: "order-123", quantity: 2, price: 100, item_category: "Electronics", item_id: "item-123" }] });
            await expect(repository.get("order-123")).resolves.toEqual(expect.any(Object));
            expect(mockItemRepository.get).toHaveBeenCalledWith("item-123");
        });

        it("should throw DbException if order ID is not found", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
            await expect(repository.get("99")).rejects.toThrow(DbException);
        });

        it("should retrieve all orders successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: "order-123", quantity: 2, price: 100, item_category: "Electronics", item_id: "item-123" }] });
            await expect(repository.getAll()).resolves.toHaveLength(1);
        });

        it("should return an empty array when no orders exist", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
            await expect(repository.getAll()).resolves.toEqual([]);
        }); 

    });

    describe("Update Operation", () => {
        it("should update an order entry successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.update(mockOrder)).resolves.not.toThrow();
            expect(mockItemRepository.update).toHaveBeenCalledWith(mockItem);
        });


    });

    describe("Delete Operation", () => {
        it("should delete an order entry successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.delete("order-123")).resolves.not.toThrow();
        });


    });
});
