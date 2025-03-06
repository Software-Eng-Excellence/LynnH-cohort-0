describe('Math Functions', () => {
    it('Adding Two numbers', () => {
        expect(2 + 2).toBe(4);
    })
    it('Subtracting Two numbers', () => {
        expect(2 - 2).toBe(0);
    })
})

describe('Example Suite ', () => {
    beforeAll(() => { console.log("Before All") }
    )
    beforeEach(() => { console.log("Before Each") }
    )

    afterEach(() => { console.log("After Each") }
    )
    afterAll(() => { console.log("After All") }
    )
    it('should run the first test', () => {
        console.log("First Test")
    })
    it('should run the second test', () => {
        console.log("Second Test")
    }
    )
})