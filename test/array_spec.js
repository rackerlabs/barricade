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

describe('Arrays', function () {
    function tryEach(array, comparator, expectedIndexes, expectedValues) {
        var indexes = [],
            values = [];

        if (comparator) {
            array.each(
                function (index, value) {
                    indexes.push(index);
                    values.push(value.get());
                }, 
                comparator
            );
        } else {
            array.each(function (index, value) {
                indexes.push(index);
                values.push(value.get());
            });
        }

        expect(indexes).toEqual(expectedIndexes);
        expect(values).toEqual(expectedValues);
    }

    beforeEach(function () {
        this.namespace = {};

        this.namespace.CustomString = Barricade.define({
            _getPrettyJSON: function() {
                return 'pretty ' + this._data;
            },
            $type: String
        });

        this.namespace.ArrayClass = Barricade.define({
            $type: Array,

            $$: {
                $class: this.namespace.CustomString
            }
        });

        this.instance1 = this.namespace.ArrayClass.create(['a', 'b', 'c']);

        this.instance2 = this.namespace.ArrayClass.create([
            'string element 1',
            'string element 2',
            'string element 3',
            'string element 4',
            'string element 5',
            'string element 6'
        ]);

        this.instance3 = this.namespace.ArrayClass.create();
    });

    it('.length() should return number of elements', function () {
        expect(this.instance1.length()).toBe(3);
        expect(this.instance2.length()).toBe(6);
        expect(this.instance3.length()).toBe(0);
    });

    it('.isEmpty() should return true if elements present', function () {
        expect(this.instance1.isEmpty()).toBe(false);
        expect(this.instance2.isEmpty()).toBe(false);
        expect(this.instance3.isEmpty()).toBe(true);
    });

    it('.get(index) should return element at index', function () {
        var i,
            length;

        expect(this.instance1.get(0).get()).toBe('a');

        for (i = 0, length = this.instance2.length(); i < length; i++) {
            expect(this.instance2.get(i).get())
                .toBe('string element ' + (i + 1));
        }

        expect(this.instance1.get(3)).toBeUndefined();
        expect(this.instance2.get(6)).toBeUndefined();
        expect(this.instance3.get(0)).toBeUndefined();
    });

    it('.push() should insert element at the end', function () {
        this.instance1.push('d');
        this.instance2.push('string element 7');
        this.instance3.push('qwertyuiop');

        expect(this.instance1.length()).toBe(4);
        expect(this.instance1.get(3).get()).toBe('d');

        expect(this.instance2.length()).toBe(7);
        expect(this.instance2.get(6).get()).toBe('string element 7');

        expect(this.instance3.length()).toBe(1);
        expect(this.instance3.get(0).get()).toBe('qwertyuiop');
    });

    it('.push() should accept instances of element\'s class', function () {
        this.namespace.ArrayElement = Barricade.define({
            $type: String
        });

        this.namespace.ArrayWithElementClass = Barricade.define({
            $type: Array,
            $$: {$class: this.namespace.ArrayElement}
        });

        this.instance4 = this.namespace.ArrayWithElementClass.create();
        this.elementInstance = this.namespace.ArrayElement.create('x');
        this.instance4.push(this.elementInstance);
        this.instance4.push(this.elementInstance);

        expect(this.instance4.length()).toBe(2);
        expect(this.instance4.get(0)).toBe(this.elementInstance);
        expect(this.instance4.get(1)).toBe(this.elementInstance);
        expect(this.instance4.get(0).get()).toBe('x');
        expect(this.instance4.get(1).get()).toBe('x');
    });

    it('.each() should be called on each element', function () {
        tryEach(this.instance1, null, [0, 1, 2], ['a', 'b', 'c']);

        tryEach(this.instance2,
                 null,
                 [0, 1, 2, 3, 4, 5],
                 [
                     'string element 1',
                     'string element 2',
                     'string element 3',
                     'string element 4',
                     'string element 5',
                     'string element 6',
                 ]);

        tryEach(this.instance3, null, [], []);
    });

    it('.each() parameter 2 can be a comparator', function () {
        function alphaCompare(val1, val2) {
            return val1.get().localeCompare(val2.get());
        }

        function alphaCompareRev(val1, val2) {
            return val2.get().localeCompare(val1.get());
        }

        tryEach(this.instance1,
                 alphaCompare,
                 [0, 1, 2],
                 ['a', 'b', 'c']);

        tryEach(this.instance1,
                 alphaCompareRev,
                 [0, 1, 2],
                 ['c', 'b', 'a']);

        tryEach(this.instance2,
                 alphaCompare,
                 [0, 1, 2, 3, 4, 5],
                 [
                     'string element 1',
                     'string element 2',
                     'string element 3',
                     'string element 4',
                     'string element 5',
                     'string element 6',
                 ]);

        tryEach(this.instance2,
                 alphaCompareRev,
                 [0, 1, 2, 3, 4, 5],
                 [
                     'string element 6',
                     'string element 5',
                     'string element 4',
                     'string element 3',
                     'string element 2',
                     'string element 1',
                 ]);

        tryEach(this.instance3, alphaCompare, [], []);
        tryEach(this.instance3, alphaCompareRev, [], []);
    });

    it('.toArray() should return native array copy', function () {
        var that = this;

        expect(this.instance1.toArray().reduce(function (prev, cur) {
            return prev + cur.get();
        }, '')).toBe('abc');

        expect(this.instance2.toArray()
                             .reduce(function (prev, cur, index) {
            return prev + index;
        }, 0)).toBe(15);

        // test lack of initial value (should set prev to element 0)
        this.instance1.toArray().reduce(function (prev, cur, index) {
            if (index === 0) {
                expect(prev).toBe(that.instance1.get(0));
            }
            return 0;
        });

        expect(this.instance1.length()).toBe(3);
        this.instance1.toArray().push('d');
        expect(this.instance1.length()).toBe(3);
    });

    it('.toJSON() should return raw JSON blob', function () {
        expect(this.instance1.toJSON()).toEqual(['a', 'b', 'c']);
        expect(this.instance2.toJSON()).toEqual([
            'string element 1',
            'string element 2',
            'string element 3',
            'string element 4',
            'string element 5',
            'string element 6',
        ]);
        expect(this.instance3.toJSON()).toEqual([]);
    });

    it('.toJSON({pretty: true}) should return prettified JSON blob',
      function () {
        expect(this.instance1.toJSON({pretty: true})).toEqual(
          ['pretty a', 'pretty b', 'pretty c']);
        expect(this.instance2.toJSON({pretty: true})).toEqual([
            'pretty string element 1',
            'pretty string element 2',
            'pretty string element 3',
            'pretty string element 4',
            'pretty string element 5',
            'pretty string element 6',
        ]);
        expect(this.instance3.toJSON({pretty: true})).toEqual([]);
    });
});
