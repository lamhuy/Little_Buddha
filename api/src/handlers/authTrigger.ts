import { PreTokenGenerationV2TriggerEvent, PreTokenGenerationV2TriggerHandler } from 'aws-lambda';

/**
 * Cognito Pre Token Generation Trigger
 * Injects the custom specific attributes (name, birth_year) into the idToken claims
 */
export const handler: PreTokenGenerationV2TriggerHandler = async (event: PreTokenGenerationV2TriggerEvent) => {
    
    const { userAttributes } = event.request;
    const name = userAttributes['custom:name'] || userAttributes['name'] || 'Seeker';
    const birthYear = userAttributes['custom:birth_year'] ? parseInt(userAttributes['custom:birth_year'], 10) : new Date().getFullYear();

    event.response = {
        claimsAndScopeOverrideDetails: {
            idTokenGeneration: {
                claimsToAddOrOverride: {
                    name: name,
                    birth_year: birthYear.toString()
                }
            },
            accessTokenGeneration: {
                claimsToAddOrOverride: {
                    name: name,
                    birth_year: birthYear.toString()
                }
            }
        }
    };

    return event;
};
