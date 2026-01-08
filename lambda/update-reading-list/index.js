import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

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
        
        // Parse the request body
        const body = JSON.parse(event.body || '{}');
        
        // For now, we'll use a hardcoded userId since we don't have Cognito yet
        // In Week 3, this will come from the JWT token
        const userId = body.userId || '1';
        
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
        
        // Build update expression dynamically
        const updateExpressions = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};
        
        if (body.name !== undefined) {
            updateExpressions.push('#name = :name');
            expressionAttributeNames['#name'] = 'name';
            expressionAttributeValues[':name'] = body.name;
        }
        
        if (body.description !== undefined) {
            updateExpressions.push('description = :description');
            expressionAttributeValues[':description'] = body.description;
        }
        
        if (body.bookIds !== undefined) {
            updateExpressions.push('bookIds = :bookIds');
            expressionAttributeValues[':bookIds'] = body.bookIds;
        }
        
        // Always update the updatedAt timestamp
        updateExpressions.push('updatedAt = :updatedAt');
        expressionAttributeValues[':updatedAt'] = new Date().toISOString();
        
        if (updateExpressions.length === 1) { // Only updatedAt
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    error: 'No fields to update'
                })
            };
        }
        
        // Update the reading list
        const updateCommand = new UpdateCommand({
            TableName: 'ReadingLists',
            Key: {
                userId: userId,
                id: readingListId
            },
            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
            ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        });
        
        const result = await docClient.send(updateCommand);
        
        console.log(`Updated reading list: ${readingListId} for user ${userId}`);
        
        // Return successful response
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
                'Access-Control-Allow-Methods': 'PUT,OPTIONS'
            },
            body: JSON.stringify({
                readingList: result.Attributes,
                message: 'Reading list updated successfully'
            })
        };
        
    } catch (error) {
        console.error('Error updating reading list:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Failed to update reading list',
                message: error.message
            })
        };
    }
};