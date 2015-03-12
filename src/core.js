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

    var getType = (function () {
        var toString = Object.prototype.toString,
            types = {
                'boolean': Boolean,
                'number': Number,
                'string': String,
                '[object Array]': Array,
                '[object Date]': Date,
                '[object Function]': Function,
                '[object RegExp]': RegExp
            };

        return function (val) {
            return types[typeof val] || 
                   types[toString.call(val)] ||
                   (val ? Object : null);
        };
    }());

    function logError() {
        console.error.apply(console, Array.prototype.slice.call(arguments)
                                          .unshift('Barricade: '));
    }

    BarricadeMain = {
        'Array': Array_,
        'Arraylike': Arraylike,
        'Base': Base,
        'Blueprint': Blueprint,
        'Container': Container,
        'Deferrable': Deferrable,
        'Enumerated': Enumerated,
        'Extendable': Extendable,
        'getType': getType, // Very helpful function
        'Identifiable': Identifiable,
        'ImmutableObject': ImmutableObject,
        'InstanceofMixin': InstanceofMixin,
        'MutableObject': MutableObject,
        'Observable': Observable,
        'Omittable': Omittable,
        'Primitive': Primitive,
        'create': function (schema) {
            function schemaIsMutable() {
                return schema.hasOwnProperty('?');
            }

            function schemaIsImmutable() {
                return Object.keys(schema).some(function (key) {
                    return key.charAt(0) !== '@' && key !== '?';
                });
            }

            if (schema['@type'] === Object && schemaIsImmutable()) {
                return ImmutableObject.extend({}, schema);
            } else if (schema['@type'] === Object && schemaIsMutable()) {
                return MutableObject.extend({}, schema);
            } else if (schema['@type'] === Array && '*' in schema) {
                return Array_.extend({}, schema);
            }
            return Primitive.extend({}, schema);
        }
    };

    return BarricadeMain;
