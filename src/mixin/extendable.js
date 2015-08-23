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
        /**
        * Extends the object, returning a new object with the original object as
          its prototype. This does not modify the original object.
        * @method extend
        * @memberof Barricade.Extendable
        * @instance
        * @param {Object} props
                 A set of properties and/or schema keywords to add to the new
                 object or schema, respectively.
        * @returns {Object}
        */
        return Object.defineProperty(this, 'extend', {
            enumerable: false,
            writable: false,
            value: function (props) {
                var self = Object.create(this),
                    schema = {};

                if (getType(props) === Function) {
                    self = props.call(self);
                    props = {};
                }

                props = Object.keys(props).reduce(function (objOut, key) {
                    if (key[0] === '$') {
                        schema[key] = props[key];
                    } else {
                        objOut[key] = props[key];
                    }
                    return objOut;
                }, {});

                self._schema = self._schema.extend(self, schema);

                return Extendable.addProps(self, props);
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
