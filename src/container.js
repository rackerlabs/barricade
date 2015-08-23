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
    * @class
    * @memberof Barricade
    * @extends Barricade.Base
    */
    Container = Blueprint.create(function () {
        var oldCreate = this.create;

        /**
        * Creates a `Container` instance.
        * @memberof Barricade.Container
        * @param {JSON} json
        * @param {Object} parameters
        * @returns {Barricade.Container}
        */
        this.create = function (json, parameters) {
            var self = oldCreate.call(this, json, parameters);

            return self.on('_addedElement', function (key) {
                self._attachListeners(key);
                self._tryResolveOn(self.get(key));
            }).each(function (index, value) {
                self._attachListeners(index);
                value.resolveWith(self);
            });
        };

        /**
        * @memberof Barricade.Container
        * @private
        */
        this._attachListeners = function (key) {
            var self = this,
                element = this.get(key),
                slice = Array.prototype.slice,
                events = {
                    'childChange': function () {
                        self.emit.apply(self,
                          ['childChange'].concat(slice.call(arguments)));
                    },
                    'change': function () {
                        // 'this' is set to callee, no typo
                        events.childChange.apply(events,
                          [this].concat(slice.call(arguments)));
                    },
                    'replace': function (newValue) {
                        self.set(key, newValue);
                        self._tryResolveOn(newValue);
                    },
                    '_resolveUp': function (value) {
                        self._tryResolveOn(value);
                    },
                    'removeFrom': function (container) {
                        if (container === self) {
                            Object.keys(events).forEach(function (eName) {
                                element.off(eName, events[eName]);
                            });
                        }
                    }
                };

            Object.keys(events).forEach(function (eName) {
                element.on(eName, events[eName]);
            });
        };

        /**
        * @memberof Barricade.Container
        * @private
        */
        this._isCorrectType = function (instance, class_) {
            var self = this;

            function isRefTo() {
                var ref = class_.schema().get('ref');
                if (typeof ref.to === 'function') {
                    return self._safeInstanceof(instance, ref.to());
                } else if (typeof ref.to === 'object') {
                    return self._safeInstanceof(instance, ref.to);
                }
                throw new Error('Ref.to was ' + ref.to);
            }

            return this._safeInstanceof(instance, class_) ||
                (class_.schema().has('ref') && isRefTo());
        };

        /**
        * @memberof Barricade.Container
        * @private
        */
        this._keyClassCreate = function (key, keyClass, json, parameters) {
            var keyClassSchema = this.schema().keyClass(key).schema();
            return keyClassSchema.has('factory')
                ? keyClassSchema.get('factory')(json, parameters)
                : keyClass.create(json, parameters);
        };

        /**
        * @memberof Barricade.Container
        * @private
        */
        this._tryResolveOn = function (value) {
            if (!value.resolveWith(this)) {
                this.emit('_resolveUp', value);
            }
        };

        /**
        * @memberof Barricade.Container
        * @instance
        * @param key
        * @param {Element} value
        * @returns {self}
        */
        this.set = function (key, value) {
            this.get(key).emit('removeFrom', this);
            this._doSet(key, value);
            this._attachListeners(key);
            return this;
        };
    });
