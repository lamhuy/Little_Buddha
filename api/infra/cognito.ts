import * as aws from "@pulumi/aws";

export function createCognitoPool() {
    const userPool = new aws.cognito.UserPool("littleBuddhaUsers", {
        passwordPolicy: {
            minimumLength: 8,
            requireLowercase: true,
            requireNumbers: true,
            requireSymbols: false,
            requireUppercase: true,
        },
        autoVerifiedAttributes: ["email"],
        schemas: [
            {
                attributeDataType: "String",
                name: "name",
                required: true,
                mutable: true,
            },
            {
                attributeDataType: "Number",
                name: "birth_year",
                required: false,
                mutable: true,
            }
        ]
    });

    const userPoolClient = new aws.cognito.UserPoolClient("littleBuddhaClient", {
        userPoolId: userPool.id,
        generateSecret: false,
        explicitAuthFlows: ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"],
    });

    return { userPool, userPoolClient };
}
