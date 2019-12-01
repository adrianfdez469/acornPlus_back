const {body} = require('express-validator');

const nameValidator = body('name')
                    .trim()
                    .isAlphanumeric()
                    .isLength({
                        max: 25,
                        min: 3
                    }).not().isEmpty({ignore_whitespace:true});
const passwordValidator = body('password')
                            .isLength({max: 25, min: 8})
                            .not().isEmpty();

module.exports = [nameValidator, passwordValidator];                    