import { randomBytes, createHmac } from "crypto";

export function createHashedPassword(password, userSalt = undefined){

    // Creating salt and using it for the hashed password making
    const salt = userSalt ?? randomBytes(256).toString("hex");
    const hashed = createHmac("sha256", salt).update(password).digest("hex");

    return {salt, password : hashed};
    
}