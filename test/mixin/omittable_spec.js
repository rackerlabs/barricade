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

describe('Omittable', function () {
    beforeEach(function () {
        this.ObjectClass = Barricade.create({
            '@type': Object,
            'a': {'@type': String},
            'b': {
                '@type': Number,
                '@required': false
            }
        });

        this.ArrayClass = Barricade.create({
            '@type': Array,
            '@required': false,
            '*': {'@type': String}
        });

        this.instance = this.ObjectClass.create({
            'a': 'foo',
            'b': 5
        });

        this.instance2 = this.ObjectClass.create({});

        this.arrayInstance = this.ArrayClass.create();
    });

    it('instances with supplied values should be used', function () {
        expect(this.instance.get('a').isUsed()).toBe(true);
        expect(this.instance.get('b').isUsed()).toBe(true);
    });

    it('instances that are required should be used always', function () {
        expect(this.instance.get('a').isUsed()).toBe(true);
        expect(this.instance2.get('a').isUsed()).toBe(true);

        this.instance.get('a').setIsUsed(false);
        this.instance2.get('a').setIsUsed(false);

        expect(this.instance.get('a').isUsed()).toBe(true);
        expect(this.instance2.get('a').isUsed()).toBe(true);
    });

    it('instances that are optional should allow used to be set', function () {
        expect(this.instance.get('b').isUsed()).toBe(true);
        expect(this.instance2.get('b').isUsed()).toBe(false);

        this.instance.get('b').setIsUsed(false);
        this.instance2.get('b').setIsUsed(true);

        expect(this.instance.get('b').isUsed()).toBe(false);
        expect(this.instance2.get('b').isUsed()).toBe(true);
    });

    it('changing a value should update isUsed', function () {
        this.instance.get('b').set(0);
        this.instance2.get('b').set(3);

        expect(this.instance.get('b').isUsed()).toBe(false);
        expect(this.instance2.get('b').isUsed()).toBe(true);
    });

    it('arrays should become used when a value is added to them', function () {
        expect(this.arrayInstance.isUsed()).toBe(false);
        this.arrayInstance.push('foo');
        expect(this.arrayInstance.isUsed()).toBe(true);
    });
});
