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
    */
    Deferred = {
        /**
        * @memberof Barricade.Deferred
        * @instance
        * @param {Function} classGetter
        * @param {Function} onResolve
                 Callback to execute when resolve happens.
        * @returns {Barricade.Deferred}
        */
        create: function (classGetter, onResolve) {
            var self = Object.create(this);
            self._isResolved = false;
            self._classGetter = classGetter;
            self._onResolve = onResolve;
            return self;
        },

        /**
        * @memberof Barricade.Deferred
        * @instance
        * @returns {Boolean}
        */
        isResolved: function () {
            return this._isResolved;
        },

        /**
        * @memberof Barricade.Deferred
        * @instance
        * @param obj
        * @returns {Boolean}
        */
        needs: function (obj) {
            return obj.instanceof(this._classGetter());
        },

        /**
        * @memberof Barricade.Deferred
        * @instance
        * @param obj
        */
        resolve: function (obj) {
            var ref;

            if (this._isResolved) {
                throw new Error('Deferred already resolved');
            }

            ref = this._onResolve(obj);

            if (ref !== undefined) {
                this._isResolved = true;
                return ref;
            }
        }
    };