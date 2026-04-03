import * as aws from "@pulumi/aws";
import { createCognitoPool } from "./cognito";
import { createStorage } from "./storage";

// DynamoDB Table for Lessons
const lessonsTable = new aws.dynamodb.Table("lessonsTable", {
    attributes: [
        { name: "id", type: "S" },
        { name: "targetAgeTier", type: "S" }
    ],
    hashKey: "id",
    globalSecondaryIndexes: [{
        name: "AgeTierIndex",
        hashKey: "targetAgeTier",
        projectionType: "ALL"
    }],
    billingMode: "PAY_PER_REQUEST",
});

// Auth & Storage
const auth = createCognitoPool();
const storage = createStorage();

// API Gateway (Placeholder for now, routes added in US phases)
const api = new aws.apigatewayv2.Api("little-buddha-api", {
    protocolType: "HTTP",
});

export const apiEndpoint = api.apiEndpoint;
export const userPoolId = auth.userPool.id;
export const userPoolClientId = auth.userPoolClient.id;
export const cloudFrontUrl = storage.distribution.domainName;
export const tableName = lessonsTable.name;
