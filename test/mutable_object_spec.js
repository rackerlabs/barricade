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

describe('Mutable Objects', function () {
    beforeEach(function () {
        this.namespace = {};

        this.namespace.CustomString = Barricade.Base.extend({
            _getPrettyJSON: function() {
                return 'pretty ' + this._data;
            },
            $type: String
        });

        this.namespace.WildClass = Barricade.define({
            $type: Object,

            $$: {
                $class: this.namespace.CustomString
            }
        });

        this.instance = this.namespace.WildClass.create({
            foo: "abcd",
            bar: "efgh",
            baz: "ijkl"
        });
    });

    it('should provide arraylike interface', function () {
        var values = [];

        expect(this.instance.length()).toBe(3);
        expect(this.instance.get(0).get()).toBe("abcd");
        expect(this.instance.get(1).get()).toBe("efgh");
        expect(this.instance.get(2).get()).toBe("ijkl");

        this.instance.each(function (i, value) {
            values.push(value.get());
        });

        expect(values).toEqual(["abcd", "efgh", "ijkl"]);
    });

    it('element.getID() should return its id', function () {
        expect(this.instance.get(0).getID()).toBe('foo');
        expect(this.instance.get(1).getID()).toBe('bar');
        expect(this.instance.get(2).getID()).toBe('baz');
    });

    it('element.setID() should change its id', function () {
        this.instance.get(0).setID('foofoo');
        this.instance.get(1).setID('barbar');
        this.instance.get(2).setID('bazbaz');

        expect(this.instance.get(0).getID()).toBe('foofoo');
        expect(this.instance.get(1).getID()).toBe('barbar');
        expect(this.instance.get(2).getID()).toBe('bazbaz');
    });

    it('.getIDs() should return array with ids', function () {
        expect(this.instance.getIDs()).toEqual(['foo', 'bar', 'baz']);
    });

    it('.getPosByID() should return index of element with ID', function () {
        expect(this.instance.getPosByID('foo')).toBe(0);
        expect(this.instance.getPosByID('bar')).toBe(1);
        expect(this.instance.getPosByID('baz')).toBe(2);
    });

    it('.getByID() should return element with that ID', function () {
        expect(this.instance.getByID('foo').getID()).toBe('foo');
        expect(this.instance.getByID('bar').getID()).toBe('bar');
        expect(this.instance.getByID('baz').getID()).toBe('baz');
    });

    it('.push() should add element with JSON and ID', function () {
        this.instance.push('new value', {id: 'new id'});

        expect(this.instance.get(3).getID()).toBe('new id');
        expect(this.instance.get(3).get()).toBe('new value');
    });

    it('.push() should take existing elements without needing id', function () {
        this.instance.push(this.instance.get(2));

        expect(this.instance.length()).toBe(4);
        expect(this.instance.get(3)).toBe(this.instance.get(2));
    });

    it('.toJSON() should return raw JSON blob', function () {
        expect(this.instance.toJSON()).toEqual({
            foo: "abcd",
            bar: "efgh",
            baz: "ijkl"
        });
    });

    it('.toJSON({pretty: true}) should return prettified JSON blob',
      function () {
        expect(this.instance.toJSON({pretty: true})).toEqual({
            foo: "pretty abcd",
            bar: "pretty efgh",
            baz: "pretty ijkl"
        });
    });

    it('nested class should accept id in parameters', function () {
        this.namespace.NestedClass = Barricade.define({
            $type: String
        });

        this.namespace.WildClass2 = Barricade.define({
            $type: Object,
            $$: {$class: this.namespace.NestedClass}
        });

        this.instance2 = this.namespace.WildClass2.create({
            foo2: "mnop",
            bar2: "qrst",
            baz2: "uvwx"
        });

        expect(this.instance2.get(0).getID()).toBe('foo2');
        expect(this.instance2.get(2).get()).toBe('uvwx');
    });
});
