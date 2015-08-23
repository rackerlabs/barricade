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

describe('$default', function () {
    beforeEach(function () {
        this.namespace = {};

        this.namespace.a = Barricade.define({
            $type: String,
            $default: 'a'
        });

        this.a = this.namespace.a.create();
        this.b = this.namespace.a.create('b');
    });

    it('should use defaults when arguments are not supplied', function () {
        expect(this.a.get()).toBe('a');
    });

    xit('should use defaults when arguments are wrong', function () {
        var instance = this.namespace.a.create(3);
        expect(instance.get()).toBe('a');
    });

    it('should not use default otherwise', function () {
        expect(this.b.get()).toBe('b');
    });

    describe('Using functions', function () {
        beforeEach(function () {
            this.namespace.defaultArray = Barricade.define({
                $type: Array,
                $default: function () {
                    return [1, 2, 3];
                }
            });

            this.array1 = this.namespace.defaultArray.create();
            this.array2 = this.namespace.defaultArray.create();
        });

        it('should allow functions to be used', function () {
            expect(this.array1.get()).toEqual([1, 2, 3]);
            expect(this.array2.get()).toEqual([1, 2, 3]);
        });

        it('should call the function each time it is needed', function () {
            expect(this.array1.get() === this.array2.get()).toBe(false);
        });
    });
});
