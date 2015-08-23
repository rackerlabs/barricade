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

describe('$constraints', function () {
    beforeEach(function () {
        this.namespace = {};

        this.namespace.a = Barricade.create({
            $type: String,
            $constraints: [function (val) { 
                return val.toLowerCase() === 'a' ||
                    'Value must be "a" or "A"';
            }]
        });

        this.namespace.str = Barricade.create({
            $type: String,
            $constraints: [
                function (s) {
                    return s.length > 3 ||
                        'Value must be more than 3 letters';
                },
                function (s) {
                    return s.length < 5 ||
                        'Value must be less than 5 letters';
                },
                function (s) {
                    return s.toLowerCase() === s ||
                        'Value must be lowercase';
                }
            ]
        });

        this.a = this.namespace.a.create('a');
        this.str = this.namespace.str.create('abcd');
    });

    it('should have error when incorrect value is supplied', function () {
        this.a.set('b');

        expect(this.a.hasError()).toBe(true);
        expect(this.a.getError()).toBe('Value must be "a" or "A"');
        expect(this.a.get()).toBe('a');

        this.a.set('A');
        expect(this.a.hasError()).toBe(false);
        expect(this.a.getError()).toBe('');
        expect(this.a.get()).toBe('A');

        this.a.set('a');
        expect(this.a.hasError()).toBe(false);
        expect(this.a.getError()).toBe('');
        expect(this.a.get()).toBe('a');
    });

    it('should emit validationError only with invalid value', function () {
        var successes = 0,
            failures = 0;

        this.a.on('validation', function (type) {
            if (type === 'succeeded') {
                successes++;
            } else if (type === 'failed') {
                failures++;
            }
        });

        this.a.set('b');
        expect(successes).toBe(0);
        expect(failures).toBe(1);

        this.a.set('a');
        expect(successes).toBe(1);
        expect(failures).toBe(1);

        this.a.set('c');
        expect(successes).toBe(1);
        expect(failures).toBe(2);
    });

    describe('should work with multiple constraints', function () {
        beforeEach(function () {
            var self = this;

            this.successes = 0;
            this.failures = 0;

            this.str.on('validation', function (type) {
                if (type === 'succeeded') {
                    self.successes++;
                } else if (type === 'failed') {
                    self.failures++;
                }
            });
        });

        it('stops on first failure', function () {
            this.str.set('z');
            expect(this.str.hasError()).toBe(true);
            expect(this.str.getError())
                .toBe('Value must be more than 3 letters');
            expect(this.str.get()).toBe('abcd');
            expect(this.successes).toBe(0);
            expect(this.failures).toBe(1);
        });

        it('stops on first failure (2)', function () {
            this.str.set('Z');
            expect(this.str.hasError()).toBe(true);
            expect(this.str.getError())
                .toBe('Value must be more than 3 letters');
            expect(this.str.get()).toBe('abcd');
            expect(this.successes).toBe(0);
            expect(this.failures).toBe(1);
        });

        it('stops on first failure (3)', function () {
            this.str.set('ZZZZ');
            expect(this.str.hasError()).toBe(true);
            expect(this.str.getError())
                .toBe('Value must be lowercase');
            expect(this.str.get()).toBe('abcd');
            expect(this.successes).toBe(0);
            expect(this.failures).toBe(1);
        });

        it('stops on first failure (4)', function () {
            this.str.set('ZZZZZ');
            expect(this.str.hasError()).toBe(true);
            expect(this.str.getError())
                .toBe('Value must be less than 5 letters');
            expect(this.str.get()).toBe('abcd');
            expect(this.successes).toBe(0);
            expect(this.failures).toBe(1);
        });

        it('works if all constraints pass', function () {
            this.str.set('zzzz');
            expect(this.str.hasError()).toBe(false);
            expect(this.str.get()).toBe('zzzz');
            expect(this.successes).toBe(1);
            expect(this.failures).toBe(0);
        });
    });
});
