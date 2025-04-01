import { ToyRepository } from "../../src/repository/postgreSQL/Toy.order.repository";
import { ConnectionManager } from "../../src/repository/postgreSQL/ConnectionManager";
import { IdentifiableToy } from "../../src/models/Toy.models";
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

// Create a mock toy object
const mockToy: IdentifiableToy = new IdentifiableToy(
    "toy-123",     // id
    "Lego Set",    // type
    "6+",         // ageGroup
    "LEGO",       // brand
    "Plastic",    // material
    true,         // batteryRequired
    true          // educational
);

describe("ToyRepository", () => {
    let repository: ToyRepository;

    beforeEach(() => {
        repository = new ToyRepository();
        jest.clearAllMocks();
    });

    describe("Initialization", () => {
        it("should initialize the toy table successfully and log the message", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            const infoSpy = jest.spyOn(logger, "info").mockImplementation(() => logger);
            await expect(repository.init()).resolves.not.toThrow();
            expect(infoSpy).toHaveBeenCalledWith("Toy Table initialized");
            infoSpy.mockRestore();
        });

        it("should throw InitializationException if initialization fails", async () => {
            (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));
            await expect(repository.init()).rejects.toThrow(InitializationException);
        });
    });

    describe("Create Operation", () => {
        it("should create a new toy entry successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.create(mockToy)).resolves.toEqual("toy-123");
        });
    });

    describe("Read Operations", () => {
        it("should retrieve a toy by ID successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [mockToy] });
            await expect(repository.get("toy-123")).resolves.toEqual(expect.any(Object));
        });

        it("should throw DbException if toy ID is not found", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
            await expect(repository.get("99")).rejects.toThrow(DbException);
        });

        it("should retrieve all toys successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [mockToy, mockToy] });
            await expect(repository.getAll()).resolves.toHaveLength(2);
        });

        it("should return an empty array when no toys exist", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
            await expect(repository.getAll()).resolves.toEqual([]);
        });
    });

    describe("Update Operation", () => {
        it("should update a toy entry successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.update(mockToy)).resolves.not.toThrow();
        });
    });

    describe("Delete Operation", () => {
        it("should delete a toy entry successfully", async () => {
            (mockDb.query as jest.Mock).mockResolvedValueOnce(undefined);
            await expect(repository.delete("toy-123")).resolves.not.toThrow();
        });

        it("should throw DbException if delete fails", async () => {
            (mockDb.query as jest.Mock).mockRejectedValueOnce(new Error("DB Delete Error"));
            await expect(repository.delete("toy-123")).rejects.toThrow(DbException);
        });
    });
});
