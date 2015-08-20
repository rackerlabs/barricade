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
    * Array_ is provided to simply differentiate between Barricade arrays and
    * other classes that are array-like, such as MutableObject.
    * @class
    * @extends Barricade.Arraylike
    * @memberof Barricade
    */
    Array_ = Blueprint.create(function () {
        Arraylike.call(this);
    });
