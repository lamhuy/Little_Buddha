import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getLessonsByAgeTier } from '../models/lessonModel';
import * as jwt from 'jsonwebtoken';

// In reality, this would use jwks-rsa to verify the Cognito JWT properly
function decodeTokenAndGetAgeTier(token: string): string {
    try {
        const decoded = jwt.decode(token) as any;
        if (!decoded || !decoded.birth_year) return '0-7'; // Safe fallback
        
        const birthYear = parseInt(decoded.birth_year, 10);
        const age = new Date().getFullYear() - birthYear;
        
        if (age <= 7) return '0-7';
        if (age <= 12) return '8-12';
        return '13-18';
    } catch (e) {
        return '0-7';
    }
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const authHeader = event.headers.Authorization || event.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
        }

        const token = authHeader.split(' ')[1];
        const ageTier = decodeTokenAndGetAgeTier(token);
        
        const lessons = await getLessonsByAgeTier(ageTier);
        
        // Append CloudFront distribution prefix to audioUrl paths if required
        const cloudFrontDist = process.env.CLOUDFRONT_URL || '';
        const resolvedLessons = lessons.map(lesson => ({
            ...lesson,
            audioUrl: cloudFrontDist ? `https://${cloudFrontDist}/${lesson.audioUrl}` : lesson.audioUrl
        }));

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: resolvedLessons })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
