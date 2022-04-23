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

        response.body = {
            message: "Successful",
            data: (Item) ? unmarshall(Item) : {},
        };

    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.body = {
            message: "Failed to retrieve the items from database",
            error: error.message,
            stack: error.stack,
        };
    }

    return response;
};

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

        response.body = {
            message: "Successful",
            result,
        };

    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.body = {
            message: "Failed to create the post",
            error: error.message,
            stack: error.stack,
        };
    }

    return response;
};

const updatePost = async (event) => {
    const response = { statusCode: 200 };

    try {
        const body = JSON.parse(event.body);
        const objKeys = Object.keys(body);
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ postId: event.pathParameters.postId }),
            UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
            ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`#key${index}`]: key,
            }), {}),
            ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`:value${index}`]: body[key],
            }), {})),
        };

        const result = await db.send(new UpdateItemCommand(params));

        console.log({ result });

        response.body = {
            message: "Successful",
            result,
        };

    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.body = {
            message: "Failed to update the post",
            error: error.message,
            stack: error.stack,
        };
    }

    return response;
};

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

const getAllPosts = async (event) => {
    const response = { statusCode: 200 };

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
        };

        const { Items } = await db.send(new ScanCommand(params));

        console.log({ Items });

        response.body = {
            message: "Successful",
            data: (Items) ? unmarshall(Items) : {},
        };

    } catch (error) {
        console.log(error);
        response.statusCode = 500;
        response.body = {
            message: "Failed to retrieve all the items from database",
            error: error.message,
            stack: error.stack,
        };
    }

    return response;
};

module.exports = {
    getPost,
    createPost,
    updatePost,
    deletePost,
    getAllPosts
};