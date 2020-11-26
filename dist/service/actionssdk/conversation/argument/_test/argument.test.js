"use strict";
/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const argument_1 = require("../argument");
ava_1.default('arguments array is parsed', (t) => {
    const arg1 = {
        name: 'foo',
        intValue: '1000',
    };
    const arg2 = {
        name: 'bar',
        rawText: 'hello',
    };
    const args = new argument_1.Arguments([arg1, arg2]);
    t.is(args.get('foo'), '1000');
    t.is(args.get('bar'), 'hello');
    t.falsy(args.get('some.other.name'));
});
//# sourceMappingURL=argument.test.js.map