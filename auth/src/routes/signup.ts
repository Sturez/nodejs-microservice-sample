import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validationResult } from "express-validator/src/validation-result";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { RequestValidationError } from "../errors/request-validation-error";

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
            //return res.status(400).send(errors.array());
        }

        const { email, password } = req.body;

        console.log("Creating a user");
        throw new DatabaseConnectionError();

        res.send('User Created!');
    });

export { router as signupRouter };