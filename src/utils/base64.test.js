import { encode, decode } from "./base64";

it("encodes object into base64", () => {
  const object = {
    test: "Hello World",
  };

  const encoded = Buffer.from(JSON.stringify(object)).toString("base64");

  expect(encode(object)).toBe(encoded);
});

it("decodes into an object", () => {
  const description = "😳😳😳😳 hahaha +{} ***";

  const object = { description };

  const encoded = encode(object);

  decode(encoded).then((data) => expect(data).toStrictEqual(object));
});

it("rejects on error", () => {
  const badString = "I failed 😢";

  expect.assertions(1);
  decode(badString).catch((error) => expect(error).toBeDefined());
});
