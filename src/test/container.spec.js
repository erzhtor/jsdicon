import { Container } from "../container";
import { inject } from "../inject";

describe('Container', () => {
    let container;

    beforeEach(() => {
        container = new Container();
    })

    it('should throw an error on non unique registrations', () => {
        expect.assertions(1);
        container.register('foo', {});
        expect(() => container.registerFunc('foo', function foo() {
            return 'tada'}
        )).toThrow();
    })

    it('should throw an error on non existing type resolution request', () => {
        expect.assertions(1);
        expect(() => container.resolve('foo')).toThrow();
    });

    it('should resolve object', () => {
        expect.assertions(1);
        const foo = {
            bar: 'tadaa'
        };
        container.register('foo', foo);
        const resolvedFoo = container.resolve('foo');
        expect(resolvedFoo).toMatchObject(foo);
    })

    it('should resolve class wth injected params', () => {
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

        container.register(TYPES.bar, 'BAR');
        container.register(TYPES.foo, Foo);
        container.register(TYPES.baz, 'BAZ');

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

        container.register(TYPES.bar, 'BAR');
        container.registerFunc(TYPES.foo, Foo);
        container.register(TYPES.baz, 'BAZ');

        const resolvedFoo = container.resolve(TYPES.foo);
        expect(typeof resolvedFoo).toBe('string');
        expect(resolvedFoo).toBe('BAR&BAZ');
    })

    it('should resolve function WITHOUT injected params', () => {
        expect.assertions(2);
        const TYPES = {
            foo: 'foo'
        }

        container.registerFunc(TYPES.foo, function () {
            return 'bar'
        });

        const resolvedFoo = container.resolve(TYPES.foo);
        console.log(resolvedFoo);
        expect(typeof resolvedFoo).toBe('string');
        expect(resolvedFoo).toBe('bar');
    })
})