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

describe('Extendable', function () {
    beforeEach(function () {
        this.BaseClass = Barricade.define({});
        this.ArraySubclass = this.BaseClass.extend({}, {$type: Array});
        this.ObjectSubclass = this.BaseClass.extend({}, {$type: Object});

        this.RealArraySubclass = this.ArraySubclass.extend({}, {
            $$: {$type: Object}
        });
        this.ImmutableSubclass = this.ObjectSubclass.extend({}, {
            $$key: {$type: String}
        });
        this.MutableSubclass = this.ObjectSubclass.extend({}, {
            $$: {$type: Array}
        });

        this.ArrayIntermediate = this.RealArraySubclass.extend({
            push: function () {}
        }, {
            $$: {$required: false}
        });
        this.ImmutableIntermediate = this.ImmutableSubclass.extend({
            getKeys: function () {}
        }, {
            $$key: {$required: false}
        });
        this.MutableIntermediate = this.MutableSubclass.extend({
            push: function () {}
        }, {
            $$: {$required: false}
        });
        this.ArraySubSub = this.ArrayIntermediate.extend({}, {
            $$: {$default: {}}
        });
        this.ImmutableSubSub = this.ImmutableIntermediate.extend({}, {
            $$key: {$default: ''}
        });
        this.MutableSubSub = this.MutableIntermediate.extend({}, {
            $$: {$default: []}
        });

        this.arrayInstance = this.ArraySubclass.create(['a', 'b', 'c']);
        this.objectInstance = this.ObjectSubclass.create({foo: 3, bar: 4});

        this.realArrayInstance = this.RealArraySubclass.create([{}, {foo: 2}]);
        this.immutableInstance = this.ImmutableSubclass.create({key: 'foo'});
        this.mutableInstance = this.MutableSubclass.create({baz: [], quux: []});
    });

    it('should allow schema to be extended', function () {
        var ObjectClass = Barricade.define({
            $type: Object,
            $$a: {$type: String},
            $$c: {$type: Object}
        }),
        ExtendedClass = ObjectClass.extend({}, {
            $$b: {$type: Number},
            $$c: {$$cc: {$type: Boolean}}
        }),
        instance = ExtendedClass.create({
            'a': 'foo',
            'b': 6,
            'c':{'cc': true}
        });

        expect(instance.getKeys().sort()).toEqual(['a', 'b', 'c']);
        expect(instance.get('a').get()).toEqual('foo');
        expect(instance.get('b').get()).toEqual(6);
    });

    it('should not affect base classes', function () {
        var classes = [this.BaseClass, this.ArraySubclass, this.ObjectSubclass],
            blueprints = [Barricade.Array,
                          Barricade.MutableObject,
                          Barricade.ImmutableObject];

        classes.forEach(function (class_) {
            blueprints.forEach(function (blueprint) {
                expect(class_.instanceof(blueprint)).toBe(false);
            });
        });
    });

    it('should not affect instances created from base classes', function () {
        var instances = [this.objectInstance, this.arrayInstance],
            blueprints = [Barricade.Array,
                          Barricade.MutableObject,
                          Barricade.ImmutableObject];

        instances.forEach(function (instance) {
            blueprints.forEach(function (blueprint) {
                expect(instance.instanceof(blueprint)).toBe(false);
            });
        });
    });

    it('should only apply the correct blueprint based on keys', function () {
        expect(this.RealArraySubclass.instanceof(Barricade.Array))
            .toBe(true);
        expect(this.RealArraySubclass.instanceof(Barricade.ImmutableObject))
            .toBe(false);
        expect(this.RealArraySubclass.instanceof(Barricade.MutableObject))
            .toBe(false);

        expect(this.ImmutableSubclass.instanceof(Barricade.Array))
            .toBe(false);
        expect(this.ImmutableSubclass.instanceof(Barricade.ImmutableObject))
            .toBe(true);
        expect(this.ImmutableSubclass.instanceof(Barricade.MutableObject))
            .toBe(false);

        expect(this.MutableSubclass.instanceof(Barricade.Array))
            .toBe(false);
        expect(this.MutableSubclass.instanceof(Barricade.ImmutableObject))
            .toBe(false);
        expect(this.MutableSubclass.instanceof(Barricade.MutableObject))
            .toBe(true);
    });

    it('should have correct blueprints on instances of subclass', function () {
        expect(this.realArrayInstance.instanceof(Barricade.Array))
            .toBe(true);
        expect(this.realArrayInstance.instanceof(Barricade.ImmutableObject))
            .toBe(false);
        expect(this.realArrayInstance.instanceof(Barricade.MutableObject))
            .toBe(false);

        expect(this.immutableInstance.instanceof(Barricade.Array))
            .toBe(false);
        expect(this.immutableInstance.instanceof(Barricade.ImmutableObject))
            .toBe(true);
        expect(this.immutableInstance.instanceof(Barricade.MutableObject))
            .toBe(false);

        expect(this.mutableInstance.instanceof(Barricade.Array))
            .toBe(false);
        expect(this.mutableInstance.instanceof(Barricade.ImmutableObject))
            .toBe(false);
        expect(this.mutableInstance.instanceof(Barricade.MutableObject))
            .toBe(true);
    });

    it('should not apply blueprints multiple times', function () {
        expect(this.ArraySubSub.push).toBe(this.ArrayIntermediate.push);
        expect(this.ImmutableSubSub.getKeys)
            .toBe(this.ImmutableIntermediate.getKeys);
        expect(this.MutableSubSub.push).toBe(this.MutableIntermediate.push);
    });

    it('should preserve the prototype chain', function () {
        expect(this.ArraySubSub.instanceof(this.BaseClass))
            .toBe(true);
        expect(this.ImmutableSubSub.instanceof(this.BaseClass))
            .toBe(true);
        expect(this.MutableSubSub.instanceof(this.BaseClass))
            .toBe(true);

        expect(this.ArraySubSub.instanceof(this.ArraySubclass))
            .toBe(true);
        expect(this.ImmutableSubSub.instanceof(this.ObjectSubclass))
            .toBe(true);
        expect(this.MutableSubSub.instanceof(this.ObjectSubclass))
            .toBe(true);

        expect(this.ArraySubSub.instanceof(this.RealArraySubclass))
            .toBe(true);
        expect(this.ImmutableSubSub.instanceof(this.ImmutableSubclass))
            .toBe(true);
        expect(this.MutableSubSub.instanceof(this.MutableSubclass))
            .toBe(true);

        expect(this.ArraySubSub.instanceof(this.ArrayIntermediate))
            .toBe(true);
        expect(this.ImmutableSubSub.instanceof(this.ImmutableIntermediate))
            .toBe(true);
        expect(this.MutableSubSub.instanceof(this.MutableIntermediate))
            .toBe(true);
    });
});
