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

describe('Identifiable', function () {
    beforeEach(function () {
        this.namespace = {};

        this.namespace.ImmutableClass = Barricade.define({
            $type: Object,
            'a': {
                $type: Number
            },
            'b': {
                $type: String
            }
        });

        this.instance = this.namespace
            .ImmutableClass
            .create({a: 42, b: 'some string'});

        this.namespace.outerContainerClass = Barricade.define({
            $type: Array,
            '*': {
                $class: this.namespace.ImmutableClass
            }
        });

        this.outerContainer = this.namespace.outerContainerClass.create(
          [this.instance]);
    });

    it('is always instance of Identifiable mixin', function () {
        expect(this.instance.instanceof(Barricade.Identifiable)).toBe(true);
    });

    it('initially the IDs are not set for values', function () {
        expect(this.instance.get('a').hasID()).toBe(false);
        expect(this.instance.get('b').hasID()).toBe(false);
    });

    it('once set manually, ID will be returned', function () {
        this.instance.get('a').setID('someNewID');

        expect(this.instance.get('a').hasID()).toBe(true);
        expect(this.instance.get('a').getID()).toBe('someNewID');
    });

    describe('UID properties', function() {
        it('an arbitrary object has a unique UID', function() {
            expect(this.instance.uid).toBeDefined();
            expect(this.instance.uid()).toBeDefined();
            expect(this.instance.uid()).not.toEqual(
              this.instance.get('a').uid());
        });

        it('objects with same contents have different UIDs', function() {
            var instanceContents = this.instance.toJSON(),
              secondInstance = this.namespace.ImmutableClass.create(
                instanceContents);

            expect(this.instance.uid()).not.toEqual(
              secondInstance.uid());
        });

        it("changing container's contents doesn't change its UID", function() {
            var currentContainerHash = this.outerContainer.uid();

            this.outerContainer.push(this.namespace.ImmutableClass.create({
                'a': 10, 'b': 'some string'}));

            expect(currentContainerHash).toEqual(
              this.outerContainer.uid());
        });
    });
});
