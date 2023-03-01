import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { validateRequest } from "../middleware/validate-request";

const router = express.Router();


router.post('/api/users/signup',
    [
        body('email')
            .isEmail()
            .withMessage("Email must be vaild"),
        body("password")
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be between 4 and 20 characters')
    ],
    validateRequest
    ,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log(`Email ${email} is already in use.`);
            throw new BadRequestError(`Email is already in use.`);
        }

        const user = User.build({ email, password });
        await user.save();

        // generate JWT

        const userJWT = jwt.sign({
            id: user.id,
            email: user.email
        },
            //we check everything in the index.ts --> start()
            process.env.JWT_KEY!
        );

        // store it in the session obj

        req.session = { ...req.session, jwt: userJWT }
        // Original code.... but with my version i'm preserving other cookies :P 
        // req.session = {
        //     jwt: userJWT
        // };

        res.status(201).send(user);

    });

export { router as signupRouter };