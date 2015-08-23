// Copyright 2014 Rackspace
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

beforeEach(SAVE_GLOBAL_STATE);
afterEach(ENSURE_GLOBAL_OBJECT_UNPOLLUTED);

describe('Primitives', function () {
    beforeEach(function () {
        this.namespace = {
                existingMember: 1234,
                existingMember2: "foo"
            };

        this.namespace.BooleanClass = Barricade.create({
            $type: Boolean
        });

        this.namespace.NumberClass = Barricade.create({
            $type: Number
        });

        this.namespace.StringClass = Barricade.create({
            $type: String
        });

        this.namespace.ObjectClass = Barricade.create({
            $type: Object
        });
        
        this.namespace.ArrayClass = Barricade.create({
            $type: Array
        });
    });

    it('should create classes on namespace', function () {
        expect(this.namespace.BooleanClass).toBeDefined();
        expect(this.namespace.NumberClass).toBeDefined();
        expect(this.namespace.StringClass).toBeDefined();
        expect(this.namespace.ObjectClass).toBeDefined();
        expect(this.namespace.ArrayClass).toBeDefined();

        expect(typeof this.namespace.BooleanClass).toBe('object');
        expect(typeof this.namespace.NumberClass).toBe('object');
        expect(typeof this.namespace.StringClass).toBe('object');
        expect(typeof this.namespace.ObjectClass).toBe('object');
        expect(typeof this.namespace.ArrayClass).toBe('object');
    });

    it('should not affect existing members in namespace', function () {
        expect(this.namespace.existingMember).toBe(1234);
        expect(this.namespace.existingMember2).toBe("foo");
    });

    it('should not create any extra members on namespace', function () {
        var key;

        delete this.namespace.existingMember;
        delete this.namespace.existingMember2;
        delete this.namespace.BooleanClass;
        delete this.namespace.NumberClass;
        delete this.namespace.StringClass;
        delete this.namespace.ObjectClass;
        delete this.namespace.ArrayClass;

        for (key in this.namespace) {
            // should never be reached, but is sure to error out
            expect(key).toBeUndefined();
        }
    });

    describe('Instantiating normally', function () {
        var types;

        beforeEach(function () {
            types = [
                {
                    'value': true,
                    'value2': false,
                    'constructor': this.namespace.BooleanClass,
                    'primitiveType': Boolean
                }, {
                    'value': 1001,
                    'value2': -256,
                    'constructor': this.namespace.NumberClass,
                    'primitiveType': Number
                }, {
                    'value': "some string 1",
                    'value2': "another string 2",
                    'constructor': this.namespace.StringClass,
                    'primitiveType': String
                }, {
                    'value': {
                        foo: "bar",
                        baz: "quux",
                    },
                    'value2': {
                        lorem: "ipsum",
                        dolor: "sit amet",
                    },
                    'constructor': this.namespace.ObjectClass,
                    'primitiveType': Object
                }, {
                    'value': [0, "a", 1, "b"],
                    'value2': [5, 4, 3, 2, 1],
                    'constructor': this.namespace.ArrayClass,
                    'primitiveType': Array
                }
            ];

            types.forEach(function (type) {
                type.instance = type.constructor.create(type.value);
            });
        });

        it('should create instances of class', function () {
            types.forEach(function (type) {
                // should be instance of own class
                expect(type.instance.instanceof(type.constructor))
                    .toBe(true);
                
                // should not be instance of other classes
                types.forEach(function (otherType) {
                    if (type !== otherType) {
                        expect(type.instance
                                   .instanceof(otherType.constructor))
                            .toBe(false);
                    }
                });
            });
        });

        it('.get() should retrieve value', function () {
            types.forEach(function (type) {
                // toBe does not work with objects (which includes arrays)
                expect(type.instance.get()).toBe(type.value);
            });
        });

        it('.set() should set value', function () {
            types.forEach(function (type) {
                type.instance.set(type.value2);
                expect(type.instance.get()).toBe(type.value2);

                type.instance.set(type.value);
                expect(type.instance.get()).toBe(type.value);
            });
        });

        it('.toJSON() should return JSON blob', function () {
            types.forEach(function (type) {
                expect(type.instance.toJSON()).toBe(type.value);
            });
        });

        it('.toJSON({pretty: true}) should behave like .toJSON()', function () {
            types.forEach(function (type) {
                expect(type.instance.toJSON({pretty: true})).toBe(type.value);
            });
        });

        it('getPrimitiveType() should return type', function () {
            types.forEach(function (type) {
                expect(type.instance.getPrimitiveType())
                    .toBe(type.primitiveType);
            });
        });

        it('should have isEmpty() return false', function () {
            types.forEach(function (type) {
                expect(type.instance.isEmpty()).toBe(false);
            });
        });

        xit('should not have any other members', function () {
            types.forEach(function (type) {
                var key;

                delete type.instance.get;
                delete type.instance.set;
                delete type.instance.toJSON;
                delete type.instance.getPrimitiveType;

                for (key in type.instance) {
                    // should never be reached, but is sure to error out
                    expect(key).toBeUndefined();
                }
            });
        });
    });

    describe('Instantiating with 0 arguments', function () {
        var types;

        beforeEach(function() {
            types = [
                {
                    constructor: this.namespace.BooleanClass,
                    value: false
                }, {
                    constructor: this.namespace.NumberClass,
                    value: 0
                }, {
                    constructor: this.namespace.StringClass,
                    value: ""
                }, {
                    constructor: this.namespace.ArrayClass,
                    value: []
                }, {
                    constructor: this.namespace.ObjectClass,
                    value: {}
                }
            ];

            types.forEach(function (type) {
                type.instance = type.constructor.create();
            });
        });

        it('should create instances with default values', function () {
            types.forEach(function (type) {
                expect(type.instance.get()).toEqual(type.value);
            });
        });

        it('should have isEmpty() return true', function () {
            types.forEach(function (type) {
                expect(type.instance.isEmpty()).toBe(true);
            });
        });
    });
});
