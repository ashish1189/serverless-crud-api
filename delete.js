const { DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const db = require("./db");

const deletePost = async (event) => {
    const response = { statusCode: 201 };

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ postId: event.pathParameters.postId }),
        };

        const result = await db.send(new DeleteItemCommand(params));

        console.log({ result });

        response.body = {
            message: "Successful",
            result,
        };

    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.body = {
            message: "Failed to delete the post",
            error: error.message,
            stack: error.stack,
        };
    }

    return response;
};

module.exports = {
    deletePost,
};