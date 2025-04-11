import {  PostgreSQLCakeRepository } from "../../src/repository/postgreSQL/Cake.order.repository";
import { ConnectionManager } from "../../src/repository/postgreSQL/ConnectionManager";
import { IIdentifiableCake } from "../../src/models/Cake.models";
import { DbException, InitializationException, ItemNotFoundException } from "../../src/util/exceptions/RepositoryException";
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

const mockCake: IIdentifiableCake = new IIdentifiableCake(
    "cake-123", // id
    "Birthday Cake", // type
    "Chocolate", // flavor
    "Vanilla Cream", // filling
    8, // size
    2, // layers
    "Buttercream", // frostingType
    "Vanilla", // frostingFlavor
    "Sprinkles", // decorationType
    "Rainbow", // decorationColor
    "Happy Birthday!", // customMessage
    "Round", // shape
    "Nuts", // allergies
    "Organic Cocoa", // specialIngredients
    "Box" // packagingType
);

const nullCake = new IIdentifiableCake(
    "cake-123",          // id
    "Birthday Cake",     // type
    "Chocolate",         // flavor
    "Vanilla Cream",     // filling
    8,                   // size
    2,                   // layers
    "Buttercream",       // frostingType
    "Vanilla",           // frostingFlavor
    "Sprinkles",         // decorationType
    "Rainbow",           // decorationColor
    "",                  // customMessage (null replaced with empty string)
    "Round",             // shape
    "",                  // allergies (null replaced with empty string)
    "",                  // specialIngredients (null replaced with empty string)
    "Box"                // packagingType
);



describe("CakeRepository", () => {
    let repository: PostgreSQLCakeRepository;

    beforeEach(() => {
        repository = new PostgreSQLCakeRepository();
        jest.clearAllMocks();
    });

    describe("Initialization", () => {


        it("should initialize the cake table successfully and log the message", async () => {
            // Mocking the query to resolve successfully
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);

            // Spy on the logger's info method to check if it's called with the expected message
            const infoSpy = jest.spyOn(logger, "info").mockImplementation(() => logger);

            // Run the init method
            await expect(repository.init()).resolves.not.toThrow();

            // Expect the logger to be called with "Cake Table initialized"
            expect(infoSpy).toHaveBeenCalledWith("Cake Table initialized");

            // Clean up the spy
            infoSpy.mockRestore();
        });

        it("should throw InitializationException if initialization fails", async () => {
            (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));
            await expect(repository.init()).rejects.toThrow(InitializationException);
        });
    });

    describe("Create Operation", () => {
        it("should create a new cake order successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.create(mockCake)).resolves.toEqual("cake-123");
        });


    });

    describe("Read Operations", () => {
        it("should retrieve a cake by ID successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [mockCake] });
            await expect(repository.get("cake-123")).resolves.toEqual(expect.any(Object));
        });

        it("should throw DbException if cake ID is not found", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
            await expect(repository.get("99")).rejects.toThrow(DbException);
        });

        it("should retrieve all cakes successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [mockCake, mockCake] });
            await expect(repository.getAll()).resolves.toHaveLength(2);
        });

        it("should return an empty array when no cakes exist", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
            await expect(repository.getAll()).resolves.toEqual([]);
        });

        it("should throw DbException if getAll query fails", async () => {
            (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));
            await expect(repository.getAll()).rejects.toThrow(DbException);
        });
    });

    describe("Update Operation", () => {
        it("should update a cake order successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.update(mockCake)).resolves.not.toThrow();
        });

    });

    describe("Delete Operation", () => {
        it("should delete a cake order successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.delete("cake-123")).resolves.not.toThrow();
        });

        it("should throw DbException if delete fails", async () => {
            (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Delete Error"));
            await expect(repository.delete("1")).rejects.toThrow(DbException);
        });
    });

   
});
