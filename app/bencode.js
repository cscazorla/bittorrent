const crypto = require("crypto");

const INTEGER_START = "i";
const STRING_DELIM = ":";
const DICTIONARY_START = "d";
const LIST_START = "l";
const END_OF_TYPE = "e";

const getType = (value) => {
    if (typeof value === "string") return "string";
    if (typeof value === "number") return "integer";
    if (Array.isArray(value)) return "list";
    if (typeof value === "object") return "dictionary";
    return "unknown";
};

function calculateSHA1(inputString) {
    const sha1Hash = crypto.createHash("sha1");
    sha1Hash.update(inputString);
    return sha1Hash.digest("hex");
}

const encodeString = (value) => {
    return `${value.length}${STRING_DELIM}${value}`;
};

const encodeInteger = (value) => {
    return `${INTEGER_START}${value}${END_OF_TYPE}`;
};

const encodeList = (value) => {
    return `${LIST_START}${value.map(encode).join("")}${END_OF_TYPE}`;
};

const encodeDictionary = (value) => {
    return `${DICTIONARY_START}${Object.keys(value)
        .sort()
        .map((key) => {
            return encodeString(key) + encode(value[key]);
        })
        .join("")}${END_OF_TYPE}`;
};

const encode = (value) => {
    const type = getType(value);
    if (type === "string") return encodeString(value);
    if (type === "integer") return encodeInteger(value);
    if (type === "list") return encodeList(value);
    if (type === "dictionary") return encodeDictionary(value);
    return ;
};

function decode(buffer, offset = 0, isBinaryField = false) {
    const type = buffer[offset];
    switch (type) {
        case INTEGER_START:
            return decodeInteger(buffer, offset);
        case DICTIONARY_START:
            return decodeDictionary(buffer, offset);
        case LIST_START:
            return decodeList(buffer, offset);
        default:
            return decodeString(buffer, offset, isBinaryField);
    }
}

/**
 * Integers are encoded as i<Integer>e
 * - i52e -> 52
 * - i-52e -> -52
 * @param buffer {string}
 * @param offset {number}
 * @returns {{value: number, length: number}}
 */
function decodeInteger(buffer, offset) {
    let end = offset + 1;
    while (buffer[end] !== END_OF_TYPE) {
        end++;
    }
    return {
        value: parseInt(buffer.slice(offset + 1, end).toString()),
        length: end + 1
    };
}

/**
 * Strings are encoded as <length>:<contents>
 * - "5:hello" -> "hello"
 * - "10:hello12345" -> "hello12345"
 * @param buffer {string}
 * @param offset {number}
 * @param isBinaryField {bool}
 * @returns {{value: string, length: number}}
 */
function decodeString(buffer, offset, isBinaryField) {
    let end = offset;
    while (buffer[end] !== STRING_DELIM) {
        end++;
    }
    const length = parseInt(buffer.slice(offset, end).toString());
    const buf = buffer.slice(end + 1, end + 1 + length);
    const value = isBinaryField ? buf : buf.toString();
    return {
        value,
        length: end + 1 + length,
    };
}

/**
 * Lists are encoded as l<bencoded_elements>e
 * where elements can be strings (<length>:<contents>), integers (i<number>e) or Lists (l<bencoded_elements>e).
 * There are no separators between the elements.
 * - l5:helloi52ee -> ["hello", 52]
 * - li52e5:helloe -> [52, "hello"]
 * - lli243e6:orangeee -> [[243,"orange"]]
 * - lli707e9:pineappleee -> [[707,"pineapple"]]
 * @param buffer {string}
 * @param offset {number}
 * @returns {{value: list, length: number}}
 */
function decodeList(buffer, offset) {
    let length = offset + 1;
    const value = [];
    while (buffer[length] !== END_OF_TYPE) {
        const { value: val, length: endOffset } = decode(buffer, length);
        value.push(val);
        length = endOffset;
    }
    return {
        value,
        length: length + 1,
    };
}

/**
 * Dictionaries are encoded as d<key1><value1>...<keyN><valueN>e
 * "d3:foo3:bar5:helloi52ee" -> {foo: "bar", hello: 52}
 * @param buffer {string}
 * @param offset {number}
 * @returns {{length: number, value: Object}}
 */
function decodeDictionary(buffer, offset) {
    let length = offset + 1;
    const value = {};
    while (buffer[length] !== END_OF_TYPE) {
        const { value: key, length: endKey } = decodeString(buffer, length);
        const isBinaryField = key.toString() === "pieces";
        const { value: val, length: endVal } = decode(buffer, endKey, isBinaryField);
        value[key.toString()] = val;
        length = endVal;
    }
    return {
        value,
        length: length + 1,
    };
}

module.exports = {
    encode,
    decode,
    decodeInteger,
    decodeString,
    decodeList,
    calculateSHA1
};