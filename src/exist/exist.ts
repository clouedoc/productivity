import ky from "ky";
import {
  ExistAttribute,
  ExistAttributesWithValuesResponseSchema,
} from "./responses/attributes.ts";
import { ExistTokenResponseSchema } from "./responses/token.ts";
import { IExistAuth } from "./types/auth.ts";

/**
 * Requests are currently rate-limited at 300/hr per user token.
 */
export class ExistClient {
  constructor(public _auth: IExistAuth) {}

  public async _fetchToken(): Promise<string> {
    if (this._auth.type === "token") {
      return this._auth.token;
    } else if (this._auth.type === "user:pass") {
      const resp = await ky.post("https://exist.io/api/1/auth/simple-token/", {
        json: {
          username: this._auth.user,
          password: this._auth.pass,
        },
      }).json();

      const { token } = ExistTokenResponseSchema.parse(resp);

      this._auth = {
        type: "token",
        token,
      };
      return token;
    } else {
      throw new Error("Invalid auth type");
    }
  }

  /**
   * Attributes of the exist account.
   */
  public async *attributes(): AsyncIterable<ExistAttribute> {
    const token = await this._fetchToken();
    let url: string | null = "https://exist.io/api/2/attributes/with-values/";

    while (url) {
      const resp = await ky.get(
        url,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      ).json();

      const parsed = ExistAttributesWithValuesResponseSchema.parse(resp);
      url = parsed.next;
      for (const result of parsed.results) {
        yield result;
      }
    }
  }
}
