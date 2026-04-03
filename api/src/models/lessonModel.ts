import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

export interface LessonPage {
    text: string;
    audioUrl: string;
    imageRef?: string;
}

export interface EducationalModule {
    id: string;
    title: string;
    pages: LessonPage[];
    targetAgeTier: '0-7' | '8-12' | '13-18';
    summaryPoints: string[];
    discussionQuestions: string[];
}

const TABLE_NAME = process.env.TABLE_NAME || 'lessonsTable';

export async function getLessonsByAgeTier(tier: string): Promise<EducationalModule[]> {
    const params = {
        TableName: TABLE_NAME,
        IndexName: 'AgeTierIndex',
        KeyConditionExpression: 'targetAgeTier = :tier',
        ExpressionAttributeValues: {
            ':tier': tier
        }
    };

    try {
        const data = await docClient.send(new QueryCommand(params));
        return (data.Items as EducationalModule[]) || [];
    } catch (err) {
        console.error("Error fetching lessons", err);
        return [];
    }
}
