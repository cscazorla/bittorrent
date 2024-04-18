const { encode, decode } = require("./../app/bencode");

test('Encode a positive integer', () => {
    const value = 52;
    const bencoded = encode(value);
    expect(bencoded).toBe("i52e");
});

test('Decode a positive integer', () => {
    const bencoded = "i52e";
    const bdecoded = decode(bencoded);
    expect(bdecoded.value).toBe(52);
});

test('Encode a negative integer', () => {
    const value = -52;
    const bencoded = encode(value);
    expect(bencoded).toBe("i-52e");
});

test('Decode a negative integer', () => {
    const bencoded = "i-52e";
    const bdecoded = decode(bencoded);
    expect(bdecoded.value).toBe(-52);
});

test('Encode a string', () => {
    const value = "hello";
    const bencoded = encode(value);
    expect(bencoded).toBe("5:hello");
});

test('Decode a string', () => {
    const bencoded = "10:hello12345";
    const bdecoded = decode(bencoded);
    expect(bdecoded.value).toBe("hello12345");
});

test('Encode an array', () => {
    const value = [
        "hello",
        52
    ];
    const bencoded = encode(value);
    expect(bencoded).toBe("l5:helloi52ee");
});

test('Decode an array', () => {
    const bencoded = "l5:helloi52ee";
    const bdecoded = decode(bencoded);
    expect(bdecoded.value).toContain("hello");
    expect(bdecoded.value).toContain(52);
});

test('Encode a dictionari', () => {
    const value = {
        foo: "bar",
        hello: 52
    }
    const bencoded = encode(value);
    expect(bencoded).toBe("d3:foo3:bar5:helloi52ee");
});

test('Decode a dictionary', () => {
    const bencoded = "d3:foo3:bar5:helloi52ee";
    const bdecoded = decode(bencoded);
    expect(bdecoded.value.foo).toBe("bar");
    expect(bdecoded.value.hello).toBe(52);
});