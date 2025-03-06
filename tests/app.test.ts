import { FinancialCalculator, OrderManagement, Validator, Order } from '../src/app';

describe('OrderManager', () => {
    //before all new validator and new calculator
    // before each new orderManagment
    let validator: Validator;
    let calculator: FinancialCalculator;
    let orderManagment: OrderManagement;
    let baseValidtor: (order:Order) => void;
    beforeAll(() => {
        validator = new Validator([]);
        calculator = new FinancialCalculator();
    })
    beforeEach(() => {
        //add base validator to have a validation value as mock
        baseValidtor = validator.validate;
        validator.validate = jest.fn();
        orderManagment = new OrderManagement(validator, calculator);

    })
    afterEach(() => {
        validator.validate = baseValidtor;
    })
    it('should add an order', () => {
        //Arrange
        // const validator=new Validator([]);
        // const calculator = new FinancialCalculator();
        //const orderManagment = new OrderManagement(validator,calculator);
        const item = "Carrot";
        const price = 10;
        //Act
        orderManagment.addOrder(price, item);
        //Assert
        expect(orderManagment.getOrders()).toEqual([{ id: 1, item: "Carrot", price: 10 }]);
    })
    it('should get an order by id', () => {
        //Arrange
        // const validator=new Validator([]);
        // const calculator = new FinancialCalculator();
        //const orderManagment = new OrderManagement(validator,calculator);
        const item = "Carrot";
        const price = 10;
        //Act
        orderManagment.addOrder(price, item);
        //Assert
        expect(orderManagment.getOrder(1)).toEqual({ id: 1, item: "Carrot", price: 10 });
    })
    it("should call finance calculator getRevenue", () => {
        //Arrange
        const item = "Carrot";
        const price = 10;
        //Act
        orderManagment.addOrder(price, item);
        const spy = jest.spyOn(calculator, 'getRevenue');
        //Assert
        expect(orderManagment.getTotalRevenue()).toBe(10);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith([{ id: 1, item: "Carrot", price: 10 }]);
        expect(spy).toHaveBeenCalledTimes(1);

    })
    it('should throw addition exceptioon if validation doesn\'t pass', () => {
        //Arrange
        const item = "Carrot";
        const price = 100;
        //make validate returns function
        (validator.validate as jest.Mock).mockImplementation = (() => {
            throw new Error("Invalid Order");
        });
        //Act
        const addOrder = () => orderManagment.addOrder(price, item);
        //Assert
        expect(()=>orderManagment.addOrder(price, item)).toThrow("Order is not validInvalid Order");
       
    })
})

describe('FinancialCalculator', () => {
    it('should get the total revenue', () => {
        //Arrange
        const orders = [
            { id: 1, item: "Sponge", price: 15 },
            { id: 2, item: "Chocolate", price: 20 },
            { id: 3, item: "Fruit", price: 18 },
            { id: 4, item: "Red Velvet", price: 25 },
            { id: 5, item: "Coffee", price: 8 },
        ];
        const calculator = new FinancialCalculator();
        //Act
        const totalRevenue = calculator.getRevenue(orders);
        //Assert
        expect(totalRevenue).toBe(86);
    })
    it('should get the total average buy power', () => {
        //Arrange
        const orders = [
            { id: 1, item: "Sponge", price: 15 },
            { id: 2, item: "Chocolate", price: 20 },
            { id: 3, item: "Fruit", price: 18 },
            { id: 4, item: "Red Velvet", price: 25 },
            { id: 5, item: "Coffee", price: 8 },
        ];
        const calculator = new FinancialCalculator();
        //Act
        const totalAverageBuyPower = calculator.getAverageBuyPower(orders);
        //Assert
        expect(totalAverageBuyPower).toBe(17.2);
    })

})