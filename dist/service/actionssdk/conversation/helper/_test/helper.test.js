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
const __1 = require("..");
const common_1 = require("../../../../../common");
ava_1.default('Helper class creates an ExpectedIntent', t => {
    const helper = new __1.Helper({
        intent: 'actions.intent.COMPLETE_PURCHASE',
        type: 'type.googleapis.com/google.actions.transactions.v3.CompletePurchaseValueSpec',
        data: {
            developerPayload: 'test1',
            skuId: {
                id: 'test2',
                packageName: 'test3',
                skuType: 'SKU_TYPE_IN_APP',
            },
        },
    });
    t.deepEqual(common_1.clone(helper), {
        intent: 'actions.intent.COMPLETE_PURCHASE',
        inputValueData: {
            '@type': 'type.googleapis.com/google.actions.transactions.v3.CompletePurchaseValueSpec',
            developerPayload: 'test1',
            skuId: {
                id: 'test2',
                packageName: 'test3',
                skuType: 'SKU_TYPE_IN_APP',
            },
        },
    });
});
//# sourceMappingURL=helper.test.js.map