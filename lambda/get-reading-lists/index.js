import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB client
const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    try {
        // For now, we'll use a hardcoded userId since we don't have Cognito yet
        // In Week 3, this will come from the JWT token
        const userId = event.queryStringParameters?.userId || '1';
        
        // Query reading lists by userId
        const command = new QueryCommand({
            TableName: 'ReadingLists',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        });
        
        const result = await docClient.send(command);
        
        console.log(`Found ${result.Items ? result.Items.length : 0} reading lists for user ${userId}`);
        
        // Return successful response
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            body: JSON.stringify({
                readingLists: result.Items || [],
                count: result.Items ? result.Items.length : 0,
                userId: userId
            })
        };
        
    } catch (error) {
        console.error('Error getting reading lists:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Failed to retrieve reading lists',
                message: error.message
            })
        };
    }
};