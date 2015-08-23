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

describe('Schema', function () {
    beforeEach(function () {
        this.namespace = {};

        this.namespace.SimpleClass = Barricade.create({
            $type: String
        });

        this.instance = this.namespace.SimpleClass.create('foo');
    });

    it('exists as a member of instances', function () {
        expect(this.instance.schema().instanceof(Barricade.Schema)).toBe(true);
    });
});
