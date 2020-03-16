const Joi = require('joi');

module.exports = {

    // GET /v1/rooms
    listRooms: {
        query: {
            page: Joi.number().min(1),
            perPage: Joi.number().min(1).max(100)
        },
    },

    // POST /v1/rooms
    createRoom: {
        body: {
            title: Joi.string().required(),
        },
    },

    // PATCH /v1/rooms/:roomId
    updateRoom: {
        body: {
            title: Joi.string(),
        },
        params: {
            roomId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
        },
    },
};
