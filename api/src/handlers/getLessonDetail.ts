import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);
const TABLE_NAME = process.env.TABLE_NAME || 'lessonsTable';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const authHeader = event.headers.Authorization || event.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
        }

        const lessonId = event.pathParameters?.id;
        if (!lessonId) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Lesson ID is required' }) };
        }

        const data = await docClient.send(new GetCommand({
            TableName: TABLE_NAME,
            Key: { id: lessonId }
        }));

        if (!data.Item) {
            return { statusCode: 404, body: JSON.stringify({ error: 'Lesson not found' }) };
        }

        const cloudFrontDist = process.env.CLOUDFRONT_URL || '';
        const lesson = {
            ...data.Item,
            audioUrl: cloudFrontDist ? `https://${cloudFrontDist}/${data.Item.audioUrl}` : data.Item.audioUrl
        };

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: lesson })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
