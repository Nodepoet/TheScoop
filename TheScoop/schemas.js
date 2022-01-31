const joi = require('joi');

module.exports.storeSchema = joi.object({
    store : joi.object({
        title: joi.string().required(),
        price: joi.number().required(),
        image: joi.string().required(),
        location: joi.string().required(),
        description: joi.string().required()
    }).required()
});
