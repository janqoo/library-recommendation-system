import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

// Initialize DynamoDB client
const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    try {
        // Parse the request body
        const body = JSON.parse(event.body || '{}');
        
        // For now, we'll use a hardcoded userId since we don't have Cognito yet
        // In Week 3, this will come from the JWT token
        const userId = body.userId || '1';
        
        // Validate required fields
        if (!body.name) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    error: 'Missing required field: name'
                })
            };
        }
        
        // Create the reading list object
        const now = new Date().toISOString();
        const readingList = {
            id: randomUUID(),
            userId: userId,
            name: body.name,
            description: body.description || '',
            bookIds: body.bookIds || [],
            createdAt: now,
            updatedAt: now
        };
        
        // Save to DynamoDB
        const command = new PutCommand({
            TableName: 'ReadingLists',
            Item: readingList
        });
        
        await docClient.send(command);
        
        console.log(`Created reading list: ${readingList.name} for user ${userId}`);
        
        // Return successful response
        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            body: JSON.stringify({
                readingList: readingList,
                message: 'Reading list created successfully'
            })
        };
        
    } catch (error) {
        console.error('Error creating reading list:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Failed to create reading list',
                message: error.message
            })
        };
    }
};