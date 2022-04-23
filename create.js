const { PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const db = require("./db");

const createPost = async (event) => {
    const response = { statusCode: 201 };

    try {
        const body = JSON.parse(event.body);
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: marshall(body || {}),
        };

        const result = await db.send(new PutItemCommand(params));

        console.log({ result });

        response.body = JSON.stringify({
            message: "Successful",
            result,
        });

    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to create the post",
            error: error.message,
            stack: error.stack,
        });
    }

    return response;
};

module.exports = {
    createPost,
};