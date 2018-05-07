import { Container } from "../container";
import { inject } from "../inject";

describe('Container', () => {
    let container;

    beforeEach(() => {
        container = new Container();
    })

    it('should throw an Error when registering with non unique typeIds', () => {
        expect.assertions(1);
        container.registerValue('foo', {});
        expect(() => container.registerFunc('foo',
            function foo() {
                return 'tada'}
            )
        ).toThrow('Already registered "foo"');
    })

    it('should throw an Error when calling "resolve" on non existing typeId', () => {
        expect.assertions(1);
        expect(() => container.resolve('foo')).toThrow('Can\'t resolve type "foo". Possibly not registered.');
    });

    it('should throw an Error when registering "undefied", empty object or "null"', () => {
        expect.assertions(6);
        expect(() => container.register('foo')).toThrow('Class or function expected for "foo". Received "undefined"');
        expect(() => container.registerFunc('baz')).toThrow('Function expected. Received "undefined"');

        expect(() => container.register('foo', null)).toThrow('Class or function expected for "foo". Received "object"');
        expect(() => container.registerFunc('baz', null)).toThrow('Function expected. Received "object"');

        expect(() => container.register('foo', {})).toThrow('Class or function expected for "foo". Received "object"');
        expect(() => container.registerFunc('baz', {})).toThrow('Function expected. Received "object"');
    });

    it('should correctly resolve object', () => {
        expect.assertions(1);
        const foo = {
            bar: 'tadaa'
        };
        container.registerValue('foo', foo);
        const resolvedFoo = container.resolve('foo');
        expect(resolvedFoo).toMatchObject(foo);
    })

    it('should resolve class with injected params', () => {
        expect.assertions(2);
        const TYPES = {
            foo: 'foo',
            bar: 'bar',
            baz: 'baz',
        }
        class _Foo {
            constructor(bar, baz){
                this.bar = bar;
                this.baz = baz;
            }
            concat(value) {
                return `${this.bar}${value}${this.baz}`;
            }
        }
        const Foo = inject(TYPES.bar, TYPES.baz)(_Foo)

        container.registerValue(TYPES.bar, 'BAR');
        container.register(TYPES.foo, Foo);
        container.registerValue(TYPES.baz, 'BAZ');

        const resolvedFoo = container.resolve(TYPES.foo);
        expect(resolvedFoo).toBeInstanceOf(Foo);
        expect(resolvedFoo.concat('&')).toBe('BAR&BAZ');
    })

    it('should resolve function with injected params', () => {
        expect.assertions(2);
        const TYPES = {
            foo: 'foo',
            bar: 'bar',
            baz: 'baz',
        }
        const Foo = inject(TYPES.bar, TYPES.baz)(
            function Foo(bar, baz) {
                return `${bar}&${baz}`;
            }
        )

        container.registerValue(TYPES.bar, 'BAR');
        container.registerFunc(TYPES.foo, Foo);
        container.registerValue(TYPES.baz, 'BAZ');

        const resolvedFoo = container.resolve(TYPES.foo);
        expect(typeof resolvedFoo).toBe('string');
        expect(resolvedFoo).toBe('BAR&BAZ');
    })

    it('should resolve function without injected params', () => {
        expect.assertions(2);
        const TYPES = {
            foo: 'foo'
        }

        container.registerFunc(TYPES.foo, function () {
            return 'bar'
        });

        const resolvedFoo = container.resolve(TYPES.foo);
        expect(typeof resolvedFoo).toBe('string');
        expect(resolvedFoo).toBe('bar');
    })

    it('should throw an Error on circular dependencies', () => {
        expect.assertions(1);
        const TYPES = {
            foo: 'FOO',
            bar: 'BAR'
        }

        container.register(TYPES.foo, inject(TYPES.bar)(
            class Foo {}
        ));

        container.registerFunc(TYPES.bar, inject(TYPES.foo)(
            function bar(foo) { }
        ));

        expect(() => container.resolve(TYPES.foo)).
            toThrow(`Cannot resolve circular dependencies for "${TYPES.foo}"`);
    })
})