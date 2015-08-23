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

describe('$enum', function () {
    beforeEach(function () {
        this.stringClass = Barricade.define({
            $type: String,
            $enum: ['foo', 'bar', 'baz']
        });

        this.labelClass = Barricade.define({
            $type: Number,
            $enum: [
                {label: 'one', value: 1},
                {label: 'two', value: 2},
                {label: 'three', value: 3},
                {label: 'four', value: 4}
            ]
        });

        this.functionClass = Barricade.define({
            $type: String,
            $enum: function () { return ['a', 'b', 'c']; }
        });

        this.stringInstance = this.stringClass.create('foo');
        this.labelInstance = this.labelClass.create(1);
        this.functionInstance = this.functionClass.create('b');
    });

    describe('should allow values to be set from the enum', function () {
        it('plain enums', function () {
            this.stringInstance.set('bar');
            expect(this.stringInstance.get()).toBe('bar');
            expect(this.stringInstance.hasError()).toBe(false);

            this.stringInstance.set('baz');
            expect(this.stringInstance.get()).toBe('baz');
            expect(this.stringInstance.hasError()).toBe(false);
        });

        it('enums with labels', function () {
            this.labelInstance.set(3);
            expect(this.labelInstance.get()).toBe(3);
            expect(this.labelInstance.hasError()).toBe(false);
        });

        it('enums from functions', function () {
            this.functionInstance.set('a');
            expect(this.functionInstance.get()).toBe('a');
            expect(this.functionInstance.hasError()).toBe(false);
        });
    });

    describe('should not allow values not from the enum', function () {
        it('plain enums', function () {
            this.stringInstance.set('quux');
            expect(this.stringInstance.get()).toBe('foo');
            expect(this.stringInstance.hasError()).toBe(true);
            expect(this.stringInstance.getError())
                .toBe('Value can only be one of foo, bar, baz');

            this.stringInstance.set('baz');
            expect(this.stringInstance.get()).toBe('baz');
            expect(this.stringInstance.hasError()).toBe(false);
        });

        it('enums with labels', function () {
            this.labelInstance.set(5);
            expect(this.labelInstance.get()).toBe(1);
            expect(this.labelInstance.hasError()).toBe(true);
            expect(this.labelInstance.getError())
                .toBe('Value can only be one of one, two, three, four');
        });

        it('enums from functions', function () {
            this.functionInstance.set('d');
            expect(this.functionInstance.get()).toBe('b');
            expect(this.functionInstance.hasError()).toBe(true);
            expect(this.functionInstance.getError())
                .toBe('Value can only be one of a, b, c');
        });
    });

    describe('labels', function () {
        it('plain enums', function () {
            expect(this.stringInstance.getEnumLabels())
                .toEqual(['foo', 'bar', 'baz']);
        });

        it('enums with labels', function () {
            expect(this.labelInstance.getEnumLabels())
                .toEqual(['one', 'two', 'three', 'four']);
        });

        it('enums from functions', function () {
            expect(this.functionInstance.getEnumLabels())
                .toEqual(['a', 'b', 'c']);
        });
    });

    describe('values', function () {
        it('plain enums', function () {
            expect(this.stringInstance.getEnumValues())
                .toEqual(['foo', 'bar', 'baz']);
        });

        it('enums with labels', function () {
            expect(this.labelInstance.getEnumValues())
                .toEqual([1, 2, 3, 4]);
        });

        it('enums from functions', function () {
            expect(this.functionInstance.getEnumValues())
                .toEqual(['a', 'b', 'c']);
        });
    });

    it('should allow enums from functions to be updatable', function () {
        var myEnum = ['foo'],
            myClass = Barricade.define({
                $type: String,
                $enum: function () { return myEnum; }
            }),
            myInstance = myClass.create('foo');

            myInstance.set('bar');
            expect(myInstance.get()).toBe('foo');
            expect(myInstance.hasError()).toBe(true);
            expect(myInstance.getError())
                .toBe('Value can only be one of foo');

            myEnum.push('bar');
            myInstance.set('bar');
            expect(myInstance.get()).toBe('bar');
            expect(myInstance.hasError()).toBe(false);
    });

    it('should pass object into enum function', function () {
        var myEnum = ['foo'],
            myClass = Barricade.define({
                $type: String,
                $enum: function () {
                    expect(this).toBe(myInstance);
                    return myEnum;
                }
            }),
            myInstance = myClass.create('foo');

            myInstance.set('bar');
    });
});
