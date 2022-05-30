/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

/**
 * State class. States have a class, unique key, and a lifecycle current state
 * the current state is determined by the specific subclass
 */
class State {

    /**
     * @param stateClass
     * @param keyParts
     */
    constructor(stateClass, keyParts) {
        this.class = stateClass;
        this.key = State.makeKey(keyParts);
        //this.currentState = null;
    }

    getClass() {
        return this.class;
    }

    getKey() {
        return this.key;
    }

    getSplitKey(){
        return State.splitKey(this.key);
    }

    // getCurrentState(){
    //     return this.currentState;
    // }

    /**
     * Convert object to buffer containing JSON data serialization
     * Typically used before putState()ledger API
     * @return {buffer} buffer with the data to store
     * @param object
     */
    static serialize(object) {
        // don't write the key:value passed in - we already have a real composite key, issuer and paper Number.
        delete object.key;
        return Buffer.from(JSON.stringify(object));
    }

    /**
     * Deserialize object into one of a set of supported JSON classes
     * i.e. Covert serialized data to JSON object
     * Typically used after getState() ledger API
     * @param {data} data to deserialize into JSON object
     * @param (supportedClasses) the set of classes data can be serialized to
     * @return {json} json with the data to store
     */
    static deserialize(data, supportedClasses) {
        let json = JSON.parse(data.toString());
        let objClass = supportedClasses[json.class];
        if (!objClass) {
            throw new Error(`Unknown class of ${json.class}`);
        }
        return new (objClass)(json);
    }

    /**
     * Deserialize object into specific object class
     * Typically used after getState() ledger API
     * @param {data} data to deserialize into JSON object
     * @param objClass
     * @return {json} json with the data to store
     */
    static deserializeClass(data, objClass) {
        let json = JSON.parse(data.toString());
        return new (objClass)(json);
    }

    /**
     * Join the keyParts to make a unififed string
     * @param keyParts
     */
    static makeKey(keyParts) {
        // return keyParts.map(part => JSON.stringify(part)).join(':');
        return keyParts.map(part => part).join(':');
    }

    static splitKey(key){
        return key.split(':');
    }

}

module.exports = State;
