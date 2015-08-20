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
    Extendable = Blueprint.create(function () {
        function deepClone(object) {
            if (isPlainObject(object)) {
                return forInKeys(object).reduce(function (clone, key) {
                    clone[key] = deepClone(object[key]);
                    return clone;
                }, {});
            }
            return object;
        }

        function forInKeys(obj) {
            var key, keys = [];
            for (key in obj) { keys.push(key); }
            return keys;
        }

        function isPlainObject(obj) {
            return getType(obj) === Object &&
                Object.getPrototypeOf(Object.getPrototypeOf(obj)) === null;
        }

        function merge(target, source) {
            forInKeys(source).forEach(function (key) {
                if (Object.prototype.hasOwnProperty.call(target, key) &&
                        isPlainObject(target[key]) &&
                        isPlainObject(source[key])) {
                    merge(target[key], source[key]);
                } else {
                    target[key] = deepClone(source[key]);
                }
            });
        }

        /**
        * Extends the object, returning a new object with the original object as
          its prototype.
        * @method extend
        * @memberof Barricade.Extendable
        * @instance
        * @param {Object} extension A set of properties to add to the new
                 object.
        * @param {Object} [schema] Barricade schema.
        * @returns {Object}
        */
        return Object.defineProperty(this, 'extend', {
            enumerable: false,
            writable: false,
            value: function (extension, schema) {
                var self = Object.create(this);

                if (getType(extension) === Function) {
                    self = extension.call(self);
                    extension = {};
                }

                if (schema) {
                    extension._schema = deepClone(self._schema) || {};
                    merge(extension._schema, schema);
                }
                return Extendable.addProps(self, extension);
            }
        });
    });

    Extendable.addProps = function (target, props) {
        return Object.keys(props).reduce(function (object, prop) {
            return Object.defineProperty(object, prop, {
                enumerable: true,
                writable: true,
                configurable: true,
                value: props[prop]
            });
        }, target);
    };
