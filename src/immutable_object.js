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
    * @extends Barricade.Container
    */
    ImmutableObject = Blueprint.create(function () {
        Container.call(this);

        /**
        * @memberof Barricade.ImmutableObject
        * @private
        */
        this._sift = function (json) {
            var self = this;
            return this.getKeys().reduce(function (objOut, key) {
                objOut[key] = self._keyClassCreate(key,
                                                   self.schema().keyClass(key),
                                                   json[key]);
                return objOut;
            }, {});
        };

        /**
        * @memberof Barricade.ImmutableObject
        * @private
        */
        this._doSet = function (key, newValue, newParameters) {
            var oldVal = this._data[key];

            if (this.schema().hasKeyClass(key)) {
                if (this._isCorrectType(newValue,
                                        this.schema().keyClass(key))) {
                    this._data[key] = newValue;
                } else {
                    this._data[key] =
                        this._keyClassCreate(key, this.schema().keyClass(key),
                                             newValue, newParameters);
                }

                this.emit('change', 'set', key, this._data[key], oldVal);
            } else {
                logError('object does not have key: ', key,
                         ' keys: ', this.schema().keyClassList());
            }
        };

        /**
        * @memberof Barricade.ImmutableObject
        * @private
        */
        this._getJSON = function (options) {
            var data = this._data;
            return this.getKeys().reduce(function (jsonOut, key) {
                if (options.ignoreUnused !== true || data[key].isUsed()) {
                    jsonOut[key] = data[key].toJSON(options);
                }
                return jsonOut;
            }, {});
        };

        /**
        * @callback Barricade.ImmutableObject.eachCB
        * @param {String} key
        * @param {Element} value
                 Instance of the ImmutableObject's Element class at index
        */

        /**
        * @memberof Barricade.ImmutableObject
        * @instance
        * @param {Barricade.ImmutableObject.eachCB} functionIn
                 A function to be called for each element in the array
        * @param {Function} comparatorIn
                 Comparator in the form that JavaScript's Array.sort() expects
        * @returns {self}
        */
        this.each = function (functionIn, comparatorIn) {
            var self = this,
                keys = this.getKeys();

            if (comparatorIn) {
                keys.sort(comparatorIn);
            }

            keys.forEach(function (key) {
                functionIn(key, self._data[key]);
            });

            return this;
        };

        /**
        * @memberof Barricade.Arraylike
        * @instance
        * @param {String} key
        * @returns {Element}
        */
        this.get = function (key) {
            return this._data[key];
        };

        /**
        * Returns all keys in the ImmutableObject
        * @memberof Barricade.ImmutableObject
        * @instance
        * @returns {Array}
        */
        this.getKeys = function () {
            return this.schema().keyClassList();
        };

        /**
        * Returns true if ImmutableObject has no keys, false otherwise.
        * @memberof Barricade.ImmutableObject
        * @instance
        * @returns {Boolean}
        */
        this.isEmpty = function () {
            return !Object.keys(this._data).length;
        };
    });
