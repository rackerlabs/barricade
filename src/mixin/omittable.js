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
    * Tracks whether an object is being "used" or not, which is a state that
      updates whenever the object changes, but also can be explicitly set.
    * @mixin
    * @memberof Barricade
    */
    Omittable = Blueprint.create(function () {
        var self = this,
            isUsed;

        function onChange(changeType) {
            if (changeType !== 'isUsed') {
                isUsed = !self.isEmpty();
            }
        }

        /**
        * Returns whether object is being used or not.
        * @method isUsed
        * @memberof Barricade.Omittable
        * @instance
        * @returns {Boolean}
        */
        this.isUsed = function () {
            return this.isRequired() || isUsed;
        };

        /**
        * Explicitly sets whether object is being used or not.
        * @method setIsUsed
        * @memberof Barricade.Omittable
        * @instance
        * @param {Boolean} newUsedValue
        * @returns {self}
        */
        this.setIsUsed = function (newUsedValue) {
            isUsed = !!newUsedValue;
            return this.emit('change', 'isUsed');
        };

        this.on('change', onChange);
        this.on('childChange', onChange);
        onChange();
    });
