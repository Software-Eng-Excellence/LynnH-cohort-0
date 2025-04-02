import { PostgreSQLPetRepository } from "../../src/repository/postgreSQL/Pet.order.repository";
import { ConnectionManager } from "../../src/repository/postgreSQL/ConnectionManager";
import { IdentifiablePet } from "../../src/models/Pet.models";
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

// Create a mock pet product object
const mockPetProduct: IdentifiablePet = new IdentifiablePet(
    "pet-123",        // id
    "Food",           // productType
    "Dog",            // petType
    "Purina",         // brand
    "Medium",         // size
    "Chicken",        // flavor
    "Yes"             // ecoFriendly
);

describe("PetRepository", () => {
    let repository: PostgreSQLPetRepository;

    beforeEach(() => {
        repository = new PostgreSQLPetRepository();
        jest.clearAllMocks();
    });

    describe("Initialization", () => {
        it("should initialize the pet table successfully and log the message", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            const infoSpy = jest.spyOn(logger, "info").mockImplementation(() => logger);
            await expect(repository.init()).resolves.not.toThrow();
            expect(infoSpy).toHaveBeenCalledWith("Pet Table initialized");
            infoSpy.mockRestore();
        });

        it("should throw InitializationException if initialization fails", async () => {
            (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));
            await expect(repository.init()).rejects.toThrow(InitializationException);
        });
    });

    describe("Create Operation", () => {
        it("should create a new pet product entry successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.create(mockPetProduct)).resolves.toEqual("pet-123");
        });
    });

    describe("Read Operations", () => {
        it("should retrieve a pet product by ID successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [mockPetProduct] });
            await expect(repository.get("pet-123")).resolves.toEqual(expect.any(Object));
        });

        it("should throw DbException if pet product ID is not found", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
            await expect(repository.get("99")).rejects.toThrow(DbException);
        });

        it("should retrieve all pet products successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [mockPetProduct, mockPetProduct] });
            await expect(repository.getAll()).resolves.toHaveLength(2);
        });

        it("should return an empty array when no pet products exist", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
            await expect(repository.getAll()).resolves.toEqual([]);
        });
    });

    describe("Update Operation", () => {
        it("should update a pet product entry successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.update(mockPetProduct)).resolves.not.toThrow();
        });
    });

    describe("Delete Operation", () => {
        it("should delete a pet product entry successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.delete("pet-123")).resolves.not.toThrow();
        });

        it("should throw DbException if delete fails", async () => {
            (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Delete Error"));
            await expect(repository.delete("pet-123")).rejects.toThrow(DbException);
        });
    });
});
