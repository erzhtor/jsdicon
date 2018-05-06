import { Container } from "../container";

describe('Container', () => {
    it('should throw an error on non unique registrations', () => {
        expect.assertions(1);
        const container = new Container();
        container.register('foo', {});
        expect(() => container.register('foo', 'tada')).toThrow();
    })

    it('should throw an error on non existing type resolution request', () => {
        expect.assertions(1);
        const container = new Container();
        expect(() => container.resolve('foo')).toThrow();
    });
})