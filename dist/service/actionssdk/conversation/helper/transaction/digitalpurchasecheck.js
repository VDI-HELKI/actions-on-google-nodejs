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
const helper_1 = require("../helper");
/**
 * Check to confirm digital purchase eligibility.
 *
 * @example
 * ```javascript
 *
 * const app = dialogflow()
 *
 * app.intent('Default Welcome Intent', conv => {
 *   // Immediately invoke digital purchase check intent to confirm
 *   // purchase eligibility.
 *   conv.ask(new DigitalPurchaseCheck())
 * })
 *
 * app.intent('Digital Purchase Check', conv => {
 *   const arg = conv.arguments.get('DIGITAL_PURCHASE_CHECK_RESULT')
 *   console.log(arg)
 * })
 * ```
 *
 * @public
 */
class DigitalPurchaseCheck extends helper_1.SoloHelper {
    /**
     * @param options The raw {@link GoogleActionsTransactionsV3DigitalPurchaseCheckSpec}
     * @public
     */
    constructor(options) {
        super({
            intent: 'actions.intent.DIGITAL_PURCHASE_CHECK',
            type: 'type.googleapis.com/google.actions.transactions.v3.DigitalPurchaseCheckSpec',
            data: options,
        });
    }
}
exports.DigitalPurchaseCheck = DigitalPurchaseCheck;
//# sourceMappingURL=digitalpurchasecheck.js.map