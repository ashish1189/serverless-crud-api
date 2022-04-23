const { GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const db = require("./db");

const getPost = async (event) => {
    const response = { statusCode: 200 };

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ postId: event.pathParameters.postId }),
        };

        const { Item } = await db.send(new GetItemCommand(params));

        console.log({ Item });

        response.body = JSON.stringify({
            message: "Successful",
            data: (Item) ? unmarshall(Item) : {},
        });

    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to retrieve the items from database",
            error: error.message,
            stack: error.stack,
        });
    }

    return response;
};

const getAllPosts = async (event) => {
    const response = { statusCode: 200 };

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
        };

        const { Items } = await db.send(new ScanCommand(params));

        console.log({ Items });

        response.body = JSON.stringify({
            message: "Successful",
            data: Items.map((item) => unmarshall(item)),
            Items
        });

    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to retrieve all the items from database",
            error: error.message,
            stack: error.stack,
        });
    }

    return response;
};

module.exports = {
    getPost,
    getAllPosts
};