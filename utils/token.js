import jwt from "jsonwebtoken";
import { userTokenSchema } from "../validation/token.validation.js";

const JWT_SECRET = process.env.JWT_SECRET;

export async function createUserToken(payload) {
  const validatedUserToken = await userTokenSchema.safeParseAsync(payload);

  if (validatedUserToken.error) throw new Error(validatedUserToken.error.format());

  const payloadValidatedData = validatedUserToken.data;

  const token = jwt.sign(payloadValidatedData, JWT_SECRET);
  return token;
}

export function tokenValidation(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}
