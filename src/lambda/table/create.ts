
import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    
    const dynamoDb = new DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
        secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
    });

    try {
        const timestamp = new Date().getTime();
        console.log(1)
        const data = JSON.parse(event.body);
        if (typeof data.text !== 'string') {
            console.error('Validation Failed');
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t create the todo item.',
            };
        }
        console.log(`table name ${process.env.DYNAMODB_TABLE}`)
        const params: DocumentClient.PutItemInput = {
            TableName: process.env.DYNAMODB_TABLE as string,
            Item: {
                id: "1",
                text: data.text,
                checked: false,
                createdAt: timestamp,
                updatedAt: timestamp,
            },
        };
        console.log(`params are ${JSON.stringify(params)}`)
        const result = await dynamoDb.put(params).promise();
        console.log(4)
        console.log(` result is ${result} `);

        const response = {
            statusCode: 200,
            body: JSON.stringify(params.Item)
        };

        return response

    } catch (error) {
        console.log(`error is $${JSON.stringify(error)}`)
        return {
            statusCode: 500,
            body: `Something went wrong ${JSON.stringify(error)}`
        };
    }
};
