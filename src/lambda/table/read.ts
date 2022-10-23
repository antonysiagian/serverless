import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const dynamoDb = new DocumentClient();

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const params: DocumentClient.GetItemInput = {
        TableName: process.env.DYNAMODB_TABLE as string,
        Key: {
            id: event.pathParameters.id,
        },
    };

    const result = await dynamoDb.get(params).promise()
    const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item),
    }

    return response
};
