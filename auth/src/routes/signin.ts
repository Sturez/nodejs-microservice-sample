import express, { Request, Response } from "express";
import { body } from 'express-validator';
import { BadRequestError } from "../errors/bad-request-error";
import { validateRequest } from "../middleware/validate-request";
import { User } from "../models/user";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post('/api/users/signin',
    [body('email')
        .isEmail()
        .withMessage('You must provide a valid email address.'),
    body('password')
        .trim()
        .notEmpty()
        .isLength({ min: 4, max: 20 })
        .withMessage('You should provide a 4 to 20 charachters long password.')
    ]
    , validateRequest
    , async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            throw new BadRequestError('Login attempt failed');
        }

        const passwordMatch = await Password.compare(existingUser.password, password);
        if (!passwordMatch) {
            throw new BadRequestError('Login attempt failed');
        }

        const userJWT = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
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

        res.status(201).send(existingUser);
    });

export { router as signinRouter };