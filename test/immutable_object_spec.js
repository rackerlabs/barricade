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

describe('Immutable Objects', function () {
    beforeEach(function () {
        this.namespace = {};

        this.namespace.CustomString = Barricade.Base.extend({
            _getPrettyJSON: function() {
                return 'pretty ' + this._data;
            }
        }, {
            '@type': String
        });

        this.namespace.FixedKeyClass = Barricade.create({
            '@type': Object,

            'stringKey': {
                '@class': this.namespace.CustomString
            },
            'booleanKey': {
                '@type': Boolean
            },
            'numberKey': {
                '@type': Number
            }
        });

        this.namespace.NestedObject = Barricade.create({
            '@type': Object,
            'a': {
                '@type': Object,
                'aa': {
                    '@type': Object,
                    'aaa': {
                        '@type': String
                    }
                }
            }
        });

        this.nestedInstance = this.namespace.NestedObject.create({
            'a': {
                'aa': {
                    'aaa': 'reallyNested'
                }
            }
        });

        this.instance = this.namespace.FixedKeyClass.create({
            'stringKey': "foo",
            'booleanKey': true,
            'numberKey': 43987
        });
    });

    it('should have correct values on its keys', function () {
        expect(this.instance.get('stringKey').get()).toBe("foo");
        expect(this.instance.get('booleanKey').get()).toBe(true);
        expect(this.instance.get('numberKey').get()).toBe(43987);
    });

    it('should not be empty if keys are defined', function () {
        var noKeys = Barricade.Base.extend(Barricade.ImmutableObject, {
                '@type': Object
            }).create();

        expect(this.instance.isEmpty()).toBe(false);
        expect(noKeys.instanceof(Barricade.ImmutableObject)).toBe(true);
        expect(noKeys.isEmpty()).toBe(true);
    });

    it('should not crash when setting value with null', function () {
        var objectKeyClass = Barricade.create({
                '@type': Object,
                'x': {'@class': this.namespace.FixedKeyClass}
            }),
            instance = objectKeyClass.create();

        instance.set('x', null);
    });

    it('.getKeys() should return array of keys', function () {
        var keys = this.instance.getKeys();

        expect(keys instanceof Array).toBe(true);
        expect(keys.length).toBe(3);
        expect(keys).toContain('stringKey');
        expect(keys).toContain('booleanKey');
        expect(keys).toContain('numberKey');
    });

    it('.each() should be called on each member', function () {
        var keys = [],
            values = [];

        this.instance.each(function (key, value) {
            keys.push(key);
            values.push(value.get());
        });

        expect(keys.length).toBe(3);
        expect(keys).toContain('stringKey');
        expect(keys).toContain('booleanKey');
        expect(keys).toContain('numberKey');
        
        expect(values.length).toBe(3);
        expect(values).toContain("foo");
        expect(values).toContain(true);
        expect(values).toContain(43987);
    });

    it('.each() parameter 2 can be a comparator', function () {
        function tryEach(obj,
                          comparator,
                          expectedKeys,
                          expectedValues) {
            var keys = [],
                values = [];

            obj.each(
                function (key, value) {
                    keys.push(key);
                    values.push(value.get());
                }, 
                comparator
            );

            expect(keys).toEqual(expectedKeys);
            expect(values).toEqual(expectedValues);
        }

        // sort alphabetically
        tryEach(
            this.instance,
            function (key1, key2) {
                return key1.localeCompare(key2);
            },
            ['booleanKey', 'numberKey', 'stringKey'],
            [true, 43987, "foo"]
        );

        // sort reversed alphabetically
        tryEach(
            this.instance,
            function (key1, key2) {
                return key2.localeCompare(key1);
            },
            ['stringKey', 'numberKey', 'booleanKey'],
            ["foo", 43987, true]
        );
    });

    it('.toJSON() should return raw JSON blob', function () {
        expect(this.instance.toJSON()).toEqual({
            stringKey: "foo",
            booleanKey: true,
            numberKey: 43987
        });
    });

    it('.toJSON({pretty: true}) should return prettified JSON blob',
      function () {
        expect(this.instance.toJSON({pretty: true})).toEqual({
            stringKey: "pretty foo",
            booleanKey: true,
            numberKey: 43987
        });
    });

    it('.getPrimitiveType() should return Object', function () {
        expect(this.instance.getPrimitiveType()).toBe(Object);
    });

    it('should work with nested objects', function () {
        expect(this.nestedInstance.get('a').get('aa').get('aaa').get())
            .toBe('reallyNested');
    });

    xit('should not have any other members', function () {
        var key;

        delete this.instance.get;
        delete this.instance.getKeys;
        delete this.instance.each;
        delete this.instance.toJSON;
        delete this.instance.getPrimitiveType;

        for (key in this.instance) {
            // should never be reached, but is sure to error out
            expect(key).toBeUndefined();
        }
    });
});
