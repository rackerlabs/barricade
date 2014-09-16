// Copyright 2014 Drago Rosson
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

var GLOBAL_COPY;

function SAVE_GLOBAL_STATE() {
    GLOBAL_COPY = {};
    for (var key in window) {
        GLOBAL_COPY[key] = window[key];
    }
}

function ENSURE_GLOBAL_OBJECT_UNPOLLUTED() {
    for (var key in window) {
        if (!GLOBAL_COPY.hasOwnProperty(key)) {
            throw new Error('window[' + key + '] should be undefined');
        } else if (GLOBAL_COPY[key] !== window[key]) {
            throw new Error('window[' + key + '] was changed');
        }
    }
}
