import { inject } from "../inject";
import { Constants } from "../constants";

describe('inject', () => {
    it('should throw an error when wrapped object is not a function', () => {
        expect.assertions(1);
        expect(() =>
            inject()({})
        ).toThrow();
    })

    it('should accept and add special property when wrapped around function', () => {
        expect.assertions(2);
        const injectedFoo = inject()(
            function foo(){}
        );
        expect(typeof injectedFoo).toBe('function');
        expect(injectedFoo[Constants.__inject__]).toBeInstanceOf(Array);
    })

    it('should accept and add special property when wrapped around class', () => {
        expect.assertions(2);
        const injectedBar = inject()(
            class Bar{}
        );
        expect(typeof injectedBar).toBe('function');
        expect(injectedBar[Constants.__inject__]).toBeInstanceOf(Array);
    })
})