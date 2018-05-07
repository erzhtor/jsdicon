import { inject } from "../inject";
import { Constants } from "../constants";

describe('inject', () => {
    it('should throw an Error when wrapping an empty object', () => {
        expect.assertions(1);
        expect(() =>
            inject()({})
        ).toThrow('Expected function or class. Provided "object"');
    })

    it('should add special array property when wrapping function. Empty typeIds', () => {
        expect.assertions(2);
        const injectedFoo = inject()(
            function foo(){}
        );
        expect(typeof injectedFoo).toBe('function');
        expect(injectedFoo[Constants.__inject__]).toBeInstanceOf(Array);
    })

    it('should add special property when wrapping around class. Empty typeIds', () => {
        expect.assertions(2);
        const injectedBar = inject()(
            class Bar{}
        );
        expect(typeof injectedBar).toBe('function');
        expect(injectedBar[Constants.__inject__]).toBeInstanceOf(Array);
    })

    it('should throw an Error when passing object typedIds', () => {
        expect.assertions(1);
        expect(() => inject({})(
            class Bar{}
        )).toThrow('Expected "number" or "string". Received "object"');
    })

    it('should throw an Error when passing empty string as typedId', () => {
        expect.assertions(1);
        expect(() => inject('')(
            class Bar{}
        )).toThrow('Expected non falsy typeId. Provided ""');
    })

    it('should throw an Error when passing "0" as typedId', () => {
        expect.assertions(1);
        expect(() => inject(0)(
            class Bar{}
        )).toThrow('Expected non falsy typeId. Provided "0"');
    })

    it('should add special array property when wrapping class. Pass "1, \'One\'" as typeIds', () => {
        expect.assertions(2);

        const typeIds = [1, 'One'];

        const injectedBar = inject(...typeIds)(
            class Bar{}
        );

        expect(typeof injectedBar).toBe('function');
        expect(injectedBar[Constants.__inject__]).toEqual(typeIds);
    })
})