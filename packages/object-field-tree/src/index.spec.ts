import { combine } from './index';

enum TestEnum1 {
    TestEnum1Key1 = 'TestEnum1_Value1',
    TestEnum1Key2 = 'TestEnum1_Value2',
    TestEnum1Key3 = 'TestEnum1_Value3',
}

enum TestEnum2 {
    TestEnum2Key1 = 'TestEnum2_Value1',
    TestEnum2Key2 = 'TestEnum2_Value2',
    TestEnum2Key3 = 'TestEnum2_Value3',
}

enum TestEnum3 {
    TestEnum3Key1 = 'TestEnum3_Value1',
    TestEnum3Key2 = 'TestEnum3_Value2',
    TestEnum3Key3 = 'TestEnum3_Value3',
}

enum TestEnum4 {
    TestEnum4Key1 = 'TestEnum4_Value1',
    TestEnum4Key2 = 'TestEnum4_Value2',
    TestEnum4Key3 = 'TestEnum4_Value3',
}

const testObj1 = {
    obj1_key1: 'obj1_val1',
    obj1_key2: 'obj1_val2',
};

const testObj2 = {
    obj2_key1: 'obj2_val1',
    obj2_key2: 'obj2_val2',
};

describe('Combine', () => {
    const getCombinationsCount = (...objects: object[]) => objects.reduce((acc, obj) => Object.keys(obj).length * acc, 1);
    const dataFnMock = jest.fn((...args) => ({ ...args }));

    beforeEach(() => dataFnMock.mockClear());

    it('Should create tree from one enum with data generated callback', () => {
        const result = combine(dataFnMock, TestEnum1);

        expect(dataFnMock).toHaveBeenCalledTimes(getCombinationsCount(TestEnum1));

        // Check generated tree structure
        Object.keys(TestEnum1).forEach(enumKey => expect(result).toHaveProperty(enumKey));

        // Check passed data to final tree node
        expect(result.TestEnum1Key1).toEqual({
            0: 'TestEnum1Key1',
        });
    });

    it('Should create tree from four enums with data generated callback', () => {
        const result = combine(dataFnMock, TestEnum1, TestEnum2, TestEnum3, TestEnum4);

        expect(dataFnMock).toHaveBeenCalledTimes(getCombinationsCount(TestEnum1, TestEnum2, TestEnum3, TestEnum4));

        // Check generated tree structure
        Object.keys(TestEnum4).forEach(enumKey =>
            expect(result.TestEnum1Key1.TestEnum2Key1.TestEnum3Key3).toHaveProperty(enumKey)
        );

        // Check passed data to final tree node
        expect(result.TestEnum1Key1.TestEnum2Key1.TestEnum3Key1.TestEnum4Key1).toEqual({
            0: 'TestEnum1Key1',
            1: 'TestEnum2Key1',
            2: 'TestEnum3Key1',
            3: 'TestEnum4Key1',
        });
    });

    it('Should create tree from two objects with data generated callback', () => {
        const result = combine(dataFnMock, testObj1, testObj2);

        expect(dataFnMock).toHaveBeenCalledTimes(getCombinationsCount(testObj1, testObj2));

        // Check generated tree structure
        Object.keys(testObj2).forEach(enumKey => expect(result.obj1_key1).toHaveProperty(enumKey));

        // Check passed data to final tree node
        expect(result.obj1_key1.obj2_key1).toEqual({
            0: 'obj1_key1',
            1: 'obj2_key1',
        });
    });
});