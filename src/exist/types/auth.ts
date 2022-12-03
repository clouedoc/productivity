type ExistAuthType = "user:pass" | "token";
interface IExistAuthBase {
  type: ExistAuthType;
}

interface IExistAuthUserPass extends IExistAuthBase {
  type: "user:pass";
  user: string;
  pass: string;
}

interface IExistAuthToken extends IExistAuthBase {
  type: "token";
  token: string;
}

export type IExistAuth = IExistAuthUserPass | IExistAuthToken;
