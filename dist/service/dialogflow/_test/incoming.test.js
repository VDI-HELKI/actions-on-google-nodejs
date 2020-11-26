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
const incoming_1 = require("../incoming");
const common_1 = require("../../../common");
const actionssdk_1 = require("../../actionssdk");
ava_1.default('incoming parse when undefined input', t => {
    const incoming = new incoming_1.Incoming(undefined);
    t.deepEqual(incoming.parsed, []);
});
ava_1.default('incoming parse when empty array', t => {
    const incoming = new incoming_1.Incoming([]);
    t.deepEqual(incoming.parsed, []);
});
ava_1.default('incoming parse when one text', t => {
    const text1 = 'text1';
    const incoming = new incoming_1.Incoming([{
            text: {
                text: [text1],
            },
        }]);
    t.deepEqual(incoming.parsed, [text1]);
});
ava_1.default('incoming parse when two text', t => {
    const text1 = 'text1';
    const text2 = 'text2';
    const incoming = new incoming_1.Incoming([{
            text: {
                text: [text1, text2],
            },
        }]);
    t.deepEqual(incoming.parsed, [text1, text2]);
});
ava_1.default('incoming parse when image', t => {
    const url = 'text1';
    const alt = 'alt1';
    const incoming = new incoming_1.Incoming([{
            image: {
                accessibilityText: alt,
                imageUri: url,
            },
        }]);
    t.deepEqual(common_1.clone(incoming.parsed[0]), {
        accessibilityText: alt,
        url,
    });
});
ava_1.default('incoming parse when quickReplies', t => {
    const suggestions = ['1', '2', '3'];
    const incoming = new incoming_1.Incoming([{
            quickReplies: {
                quickReplies: suggestions,
            },
        }]);
    const parsed = incoming.parsed[0];
    t.true(parsed instanceof actionssdk_1.Suggestions);
    t.deepEqual(parsed.suggestions, [{
            title: suggestions[0],
        }, {
            title: suggestions[1],
        }, {
            title: suggestions[2],
        }]);
});
ava_1.default('incoming.get string', t => {
    const text1 = 'text1';
    const incoming = new incoming_1.Incoming(undefined);
    incoming.parsed.push(text1);
    t.is(incoming.get('string'), text1);
});
ava_1.default('incoming.get Suggestions', t => {
    const texts = ['1', '2', '3'];
    const incoming = new incoming_1.Incoming([{
            quickReplies: {
                quickReplies: texts,
            },
        }]);
    const suggestions = incoming.get(actionssdk_1.Suggestions);
    const parsed = incoming.parsed[0];
    t.is(suggestions, parsed);
    t.true(suggestions instanceof actionssdk_1.Suggestions);
    t.deepEqual(suggestions.suggestions, texts.map(t => ({ title: t })));
});
//# sourceMappingURL=incoming.test.js.map