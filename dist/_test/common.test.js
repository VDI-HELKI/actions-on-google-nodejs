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
const common_1 = require("../common");
ava_1.default('values correctly gets the values of an object', t => {
    const expected = [1, 2, 3];
    expected.sort();
    const obj = {
        a: 1,
        b: 2,
        c: 3,
    };
    const actual = common_1.values(obj);
    actual.sort();
    t.deepEqual(actual, expected);
});
ava_1.default('clone deepEquals original', t => {
    const original = {
        a: 1,
        b: 2,
        c: {
            d: 3,
            e: 4,
        },
    };
    const cloned = common_1.clone(original);
    t.deepEqual(cloned, original);
});
ava_1.default('clone creates an object not the same ref as original', t => {
    const original = {
        a: 1,
        b: 2,
        c: {
            d: 3,
            e: 4,
        },
    };
    const cloned = common_1.clone(original);
    t.not(cloned, original);
});
ava_1.default('stringify results in a string', t => {
    const original = {
        a: 1,
        b: 2,
        c: {
            d: 3,
            e: 4,
        },
    };
    t.is(typeof common_1.stringify(original), 'string');
});
ava_1.default('stringify parsed back is deepEqual to original', t => {
    const original = {
        a: 1,
        b: 2,
        c: {
            d: 3,
            e: 4,
        },
    };
    t.deepEqual(JSON.parse(common_1.stringify(original)), original);
});
ava_1.default('stringify returns pretty formatted string', t => {
    const original = {
        a: 1,
        b: 2,
        c: {
            d: 3,
            e: 4,
        },
    };
    t.is(common_1.stringify(original), `{
  "a": 1,
  "b": 2,
  "c": {
    "d": 3,
    "e": 4
  }
}`);
});
ava_1.default('stringify for top level circular reference works', t => {
    const original = {
        a: null,
        c: {
            d: 3,
        },
    };
    original.a = original;
    const parsed = JSON.parse(common_1.stringify(original));
    t.is(parsed.a, '[Circular]');
    t.is(parsed.c.d, 3);
});
ava_1.default('stringify for lower level circular reference works', t => {
    const original = {
        a: 2,
        c: {
            d: null,
        },
    };
    original.c.d = original.c;
    const parsed = JSON.parse(common_1.stringify(original));
    t.is(parsed.c, '[Circular]');
    t.is(parsed.a, 2);
});
ava_1.default('stringify for exclude works', t => {
    const original = {
        a: 1,
        b: 2,
        c: {
            d: 3,
            e: 4,
        },
    };
    const exclude = 'a';
    const parsed = JSON.parse(common_1.stringify(original, exclude));
    t.deepEqual(parsed, {
        a: '[Excluded]',
        b: 2,
        c: {
            d: 3,
            e: 4,
        },
    });
});
ava_1.default('stringify for two exclude works', t => {
    const original = {
        a: 1,
        b: 2,
        c: {
            d: 3,
            e: 4,
        },
    };
    const exclude = 'a';
    const exclude2 = 'c';
    const parsed = JSON.parse(common_1.stringify(original, exclude, exclude2));
    t.deepEqual(parsed, {
        a: '[Excluded]',
        b: 2,
        c: '[Excluded]',
    });
});
ava_1.default('toArray results in same array when passed in array', t => {
    const original = [1, 2, 3];
    t.is(common_1.toArray(original), original);
});
ava_1.default('toArray results in an array when passed in a single element', t => {
    const original = 1;
    t.true(Array.isArray(common_1.toArray(original)));
});
ava_1.default('toArray results in a correct array when passed in a single element', t => {
    const original = 1;
    t.deepEqual(common_1.toArray(original), [1]);
});
//# sourceMappingURL=common.test.js.map