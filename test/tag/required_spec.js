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

describe('$required', function () {
    beforeEach(function () {
        this.namespace = {};

        this.namespace.FixedKeyClass = Barricade.define({
            $type: Object,

            'stringKeyExplicit': {
                $type: String,
                $required: true
            },
            'stringKeyImplicit': {
                $type: String
            },
            'booleanKey': {
                $type: Boolean,
                $required: false
            },
            'numberKey': {
                $type: Number,
                $required: false
            }
        });

        this.instance = this.namespace.FixedKeyClass.create({
            'stringKeyExplicit': "foo",
            'stringKeyImplicit': "bar",
            'booleanKey': true
        });
    });

    it('should set .isRequired() correctly', function () {
        var inst = this.instance;
        expect(inst.get('stringKeyExplicit').isRequired()).toBe(true);
        expect(inst.get('stringKeyImplicit').isRequired()).toBe(true);
        expect(inst.get('booleanKey').isRequired()).toBe(false);
        expect(inst.get('numberKey').isRequired()).toBe(false);
    });

    it('should set .isUsed() correctly', function () {
        var inst = this.instance;
        expect(inst.get('stringKeyExplicit').isUsed()).toBe(true);
        expect(inst.get('stringKeyImplicit').isUsed()).toBe(true);
        expect(inst.get('booleanKey').isUsed()).toBe(true);
        expect(inst.get('numberKey').isUsed()).toBe(false);
    });
});
