import fromAsync from "array-from-async";
import ky from "ky";
import {
  assertEquals,
  assertExists,
  assertNotEquals,
  assertStrictEquals,
} from "testing/asserts.ts";
import { assertSpyCalls, spy } from "testing/mock.ts";
import { v1 as uuid } from "uuid";
import { config } from "../config.ts";
import { ExistClient } from "./exist.ts";
import { ExistAttribute } from "./mod.ts";

Deno.test("authentication", async (t) => {
  assertEquals(config.exist.type, "user:pass"); // this test only works with a user:pass auth
  const client = new ExistClient(config.exist);
  assertStrictEquals(client._auth, config.exist);
  const httpSpy = spy(ky, "post");

  await t.step("fetches token from user:pass", async () => {
    await client._fetchToken();
    assertStrictEquals(client._auth.type, "token");
    assertSpyCalls(httpSpy, 1);

    if (client._auth.type !== "token") {
      throw new Error("Auth type is not token");
    }
    assertExists(client._auth.token);
  });

  await t.step("caches token", async () => {
    if (client._auth.type !== "token") {
      throw new Error("Auth type is not token");
    }
    const testingToken = uuid.generate().toString();
    const oldToken = client._auth.token;
    client._auth.token = testingToken;
    await client._fetchToken();
    assertSpyCalls(httpSpy, 1); // dit not call again
    assertNotEquals(client._auth.token, oldToken);
    assertEquals(client._auth.token, testingToken);
  });
});

Deno.test("attributes::fetching", async (t) => {
  const client = new ExistClient(config.exist);

  await t.step("fetches attributes", async () => {
    const attributes: ExistAttribute[] = await fromAsync(client.attributes());
    console.log(attributes);
  });
});
