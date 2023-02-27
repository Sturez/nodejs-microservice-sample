import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validationResult } from "express-validator/src/validation-result";
import { RequestValidationError } from "../errors/request-validation-error";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../models/user";

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
    async (req: Request, res: Response) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array());

        }

        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log(`Email ${email} is already in use.`);
            throw new BadRequestError(`Email is already in use.`);
        }

        const user = User.build({ email, password });
        await user.save();

        res.status(201).send(user);

    });

export { router as signupRouter };