import { OrderManagmentService } from '../../src/services/OrderManagementService.service';
import { ServiceException } from '../../src/util/exceptions/ServiceException';
import { ItemCategory } from '../../src/models/IItem';



const mockRepo = {
    create: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
};


jest.mock('../../src/repository/RepositoryFactory', () => ({
    RepositoryFactory: {
        create: jest.fn(() => mockRepo),
    },
}));

describe('OrderManagmentService', () => {
    let service: OrderManagmentService;

    const mockOrder = {
        getItem: () => ({ getCategory: () => ItemCategory.BOOK }),
        getPrice: () => 100,
        getQuantity: () => 2,
    };

    beforeEach(() => {
        service = new OrderManagmentService();
        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        it('should create a valid order', async () => {
            await service.createOrder(mockOrder as any);
            expect(mockRepo.create).toHaveBeenCalledWith(mockOrder);
        });

        it('should throw if order is invalid', async () => {
            const invalidOrder = {
                getItem: () => null,
                getPrice: () => -5,
                getQuantity: () => 0,
            };
            await expect(service.createOrder(invalidOrder as any)).rejects.toThrow(ServiceException);
            expect(mockRepo.create).not.toHaveBeenCalled();
        });
    });

    describe('getOrder', () => {
        it('should return the correct order', async () => {
            mockRepo.get.mockResolvedValueOnce(null).mockResolvedValueOnce(mockOrder);
            const result = await service.getOrder('123');
            expect(result).toBe(mockOrder);
        });

        it('should throw if order is not found', async () => {
            mockRepo.get.mockResolvedValue(null);
            await expect(service.getOrder('123')).rejects.toThrow(ServiceException);
        });
    });

    describe('updateOrder', () => {
        it('should update a valid order', async () => {
            await service.updateOrder('123', mockOrder as any);
            expect(mockRepo.update).toHaveBeenCalledWith(mockOrder);
        });

        it('should throw if updated order is invalid', async () => {
            const invalidOrder = {
                getItem: () => null,
                getPrice: () => -5,
                getQuantity: () => 0,
            };
            await expect(service.updateOrder('123', invalidOrder as any)).rejects.toThrow(ServiceException);
            expect(mockRepo.update).not.toHaveBeenCalled();
        });
    });

    describe('deleteOrder', () => {
        it('should delete an existing order', async () => {
            mockRepo.get.mockResolvedValueOnce(mockOrder);
            await service.deleteOrder('123');
            expect(mockRepo.delete).toHaveBeenCalledWith('123');
        });

        it('should throw if order is not found', async () => {
            mockRepo.get.mockResolvedValue(null);
            await expect(service.deleteOrder('123')).rejects.toThrow(ServiceException);
        });
    });

    describe('getAllOrders', () => {
        it('should return all orders', async () => {
            mockRepo.getAll.mockResolvedValue([mockOrder]);
            const result = await service.getAllOrders();
            expect(result).toContain(mockOrder);
        });
    });

    describe('getTotalRevenue', () => {
        it('should return total revenue', async () => {
            mockRepo.getAll.mockResolvedValue([mockOrder]);
            const result = await service.getTotalRevenue();
            expect(result).toBe(1200);
        });
    });

    describe('getTotalOrders', () => {
        it('should return total number of orders', async () => {
            mockRepo.getAll.mockResolvedValue([mockOrder]);
            const result = await service.getTotalOrders();
            expect(result).toBe(6);
        });
    });

    describe('getOrderVolumeAnalytics', () => {
        it('should return order volume analytics', async () => {
            mockRepo.getAll.mockResolvedValue([mockOrder]);
            const result = await service.getOrderVolumeAnalytics();
            expect(result.totalOrderCount).toBe(6);
            expect(result.orderCountsByItemType[ItemCategory.BOOK]).toBe(6);
        });
    });

    describe('getRevenueAnalytics', () => {
        it('should return revenue analytics', async () => {
            mockRepo.getAll.mockResolvedValue([mockOrder]);
            const result = await service.getRevenueAnalytics();
            expect(result.totalRevenue).toBe(1200);
            expect(result.revenueByItemType[ItemCategory.BOOK]).toBe(1200);
        });
    });
});
