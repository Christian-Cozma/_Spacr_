const express = require('express');
const asyncHandler = require('express-async-handler');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//? The necessary middleware for getting the auth started
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const router = express.Router();

//TODO: Validation Error handling for Signup:
//? Validate Sign Up:
const validateSignup = [
    check('firstName')
    .notEmpty()
    .withMessage(`Please provide a first name`),
    check('lastName')
    .notEmpty()
    .withMessage(`Please provide a last name`),
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors,
  ];

//TODO: USer Sign up API Route
//TODO: POST /api/users

//? Sign up:
router.post(
    '',
    validateSignup,
    asyncHandler(async (req, res) => {
        //? Destructure the JSON content received from the request body.
        const { firstName, lastName, email, password, username } = req.body;

        const user = await User.signup (
                {
                firstName,
                lastName,
                email,
                username,
                password
            }
        )

        await setTokenCookie(res, user);

        return res.json({ user });
    })
)

module.exports = router;
