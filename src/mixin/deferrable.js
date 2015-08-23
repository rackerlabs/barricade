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

    /**
    * @mixin
    * @memberof Barricade
    */
    Deferrable = Blueprint.create(function (schema) {
        var self = this,
            needed,
            deferred = schema.has('ref')
                ? Deferred.create(schema.get('ref').needs, getter, resolver)
                : null;

        if (schema.has('ref') && !schema.get('ref').processor) {
            schema.get('ref').processor = function (o) { return o.val; };
        }

        function getter(neededVal) {
            return schema.get('ref').getter({standIn: self, needed: neededVal});
        }

        function resolver(retrievedValue) {
            self.emit('replace', schema.get('ref').processor({
                val: retrievedValue,
                standIn: self,
                needed: needed
            }));
        }

        this.resolveWith = function (obj) {
            var allResolved = true;

            if (deferred && !deferred.isResolved()) {
                if (deferred.needs(obj)) {
                    needed = obj;
                    deferred.resolve(obj);
                } else {
                    allResolved = false;
                }
            }

            if (this.instanceof(Container)) {
                this.each(function (index, value) {
                    if (!value.resolveWith(obj)) {
                        allResolved = false;
                    }
                });
            }

            return allResolved;
        };

        this.isPlaceholder = function () {
            return !!deferred;
        };
    });
