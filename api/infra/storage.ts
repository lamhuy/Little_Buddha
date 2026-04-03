import * as aws from "@pulumi/aws";

export function createStorage() {
    const bucket = new aws.s3.Bucket("audioBucket", {
        acl: "private",
    });

    const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity("oai", {
        comment: "OAI for Little Buddha audio",
    });

    const bucketPolicy = new aws.s3.BucketPolicy("bucketPolicy", {
        bucket: bucket.id,
        policy: bucket.arn.apply(arn => JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Principal: {
                        AWS: originAccessIdentity.iamArn
                    },
                    Action: "s3:GetObject",
                    Resource: `${arn}/*`
                }
            ]
        }))
    });

    const distribution = new aws.cloudfront.Distribution("audioDistribution", {
        origins: [{
            domainName: bucket.bucketRegionalDomainName,
            originId: bucket.arn,
            s3OriginConfig: {
                originAccessIdentity: originAccessIdentity.cloudfrontAccessIdentityPath
            }
        }],
        enabled: true,
        defaultCacheBehavior: {
            allowedMethods: ["GET", "HEAD"],
            cachedMethods: ["GET", "HEAD"],
            targetOriginId: bucket.arn,
            forwardedValues: {
                queryString: false,
                cookies: { forward: "none" }
            },
            viewerProtocolPolicy: "redirect-to-https",
            minTtl: 0,
            defaultTtl: 3600,
            maxTtl: 86400,
        },
        restrictions: {
            geoRestriction: {
                restrictionType: "none"
            }
        },
        viewerCertificate: {
            cloudfrontDefaultCertificate: true
        }
    });

    return { bucket, distribution };
}
