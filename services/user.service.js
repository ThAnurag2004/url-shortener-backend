import { userTable } from "../model/index.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";

export async function getUserByEmail(email){
    // Fetching the existing user
      const [existingUser] = await db
        .select({
          id: userTable.id,
          fistname: userTable.firstname,
          lastname: userTable.lastname,
          email: userTable.email,
          salt: userTable.salt,
          password: userTable.password
        })
        .from(userTable)
        .where(eq(userTable.email, email));
    
      return existingUser;
}