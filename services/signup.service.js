import { userTable } from "../model/index.js";
import { db } from "../db/index.js";


export async function signUpUser(email,firstname,lastname,hashedPassword,salt) {
    const [user] = await db
    .insert(userTable)
    .values({
      email,
      firstname,
      lastname,
      password: hashedPassword,
      salt,
    })
    .returning({ id: userTable.id });

    return user;
}