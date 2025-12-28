import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB client
const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    try {
        // Get the reading list ID from path parameters
        const readingListId = event.pathParameters?.id;
        
        if (!readingListId) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    error: 'Missing reading list ID in path'
                })
            };
        }
        
        // For now, we'll use a hardcoded userId since we don't have Cognito yet
        // In Week 3, this will come from the JWT token
        const userId = event.queryStringParameters?.userId || '1';
        
        // First, check if the reading list exists and belongs to the user
        const getCommand = new GetCommand({
            TableName: 'ReadingLists',
            Key: {
                userId: userId,
                id: readingListId
            }
        });
        
        const existingItem = await docClient.send(getCommand);
        
        if (!existingItem.Item) {
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    error: 'Reading list not found'
                })
            };
        }
        
        // Delete the reading list
        const deleteCommand = new DeleteCommand({
            TableName: 'ReadingLists',
            Key: {
                userId: userId,
                id: readingListId
            },
            ReturnValues: 'ALL_OLD'
        });
        
        const result = await docClient.send(deleteCommand);
        
        console.log(`Deleted reading list: ${readingListId} for user ${userId}`);
        
        // Return successful response
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
                'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
            },
            body: JSON.stringify({
                deletedReadingList: result.Attributes,
                message: 'Reading list deleted successfully'
            })
        };
        
    } catch (error) {
        console.error('Error deleting reading list:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Failed to delete reading list',
                message: error.message
            })
        };
    }
};