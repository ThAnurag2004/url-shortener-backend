import express from "express";
import { signUpUser } from "../services/signup.service.js";
import { signUpPostValidationBodySchema, loginPostValidationBodySchema } from "../validation/request.validation.js";
import { getUserByEmail } from "../services/user.service.js";
import { createHashedPassword } from "../utils/hash.js";
import {createUserToken} from '../utils/token.js'

const router = express.Router();

// SignUp Route
router.post("/signup", async (req, res) => {
  try {
    // getting validated data from body via zod validation
    const validationResult =
      await signUpPostValidationBodySchema.safeParseAsync(req.body);

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.format() });
    }

    const { firstname, lastname, email, password } = validationResult.data;

    // Fetching the existing user from getUserByEmail Service
    const existingUser = await getUserByEmail(email);

    // Checking if any user exists with the given email and returning error
    if (existingUser) {
      return res
        .status(409)
        .json({ error: `User with email ${email} already exists` });
    }

    // fetching salt and hashed password from createHashedPassword function
    const { salt, password: hashed } = createHashedPassword(password);

    // Adding user to the database and returning id of that user
    const user = await signUpUser(email, firstname, lastname, hashed, salt);

    return res.status(200).json({ data: { userId: user.id } });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Login Route
router.post('/login', async(req,res)=>{
    const validationResult = await loginPostValidationBodySchema.safeParseAsync(req.body);

    if(validationResult.error){
        return res.status(400).json({error : validationResult.error.format()})
    }

    const {email, password} = validationResult.data;

    const user = await getUserByEmail(email);

    if(!user){
        return res.status(404)
        .json({ error: `User with email ${email} does not exists` });
    }

    const {password : hashed} = createHashedPassword(password, user.salt);

    if(user.password !== hashed){
      return res.status(409).json({error : 'Please enter correct password'})
    }

    const token = await createUserToken({ id: user.id})

    return res.json({token})
})

export default router;
