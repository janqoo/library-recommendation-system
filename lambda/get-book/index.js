const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

// Initialize DynamoDB client
const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Lambda function to get a single book by ID from DynamoDB
 * 
 * Expects book ID in path parameters: /books/{id}
 * Used by: GET /books/{id} API endpoint
 */
exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    try {
        // Extract book ID from path parameters
        const bookId = event.pathParameters?.id;
        
        if (!bookId) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
                    'Access-Control-Allow-Methods': 'GET,OPTIONS'
                },
                body: JSON.stringify({
                    error: 'Missing book ID',
                    message: 'Book ID is required in path parameters'
                })
            };
        }
        
        // Get the specific book from DynamoDB
        const command = new GetCommand({
            TableName: process.env.BOOKS_TABLE_NAME || 'Books',
            Key: {
                id: bookId
            }
        });
        
        const result = await docClient.send(command);
        
        if (!result.Item) {
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
                    'Access-Control-Allow-Methods': 'GET,OPTIONS'
                },
                body: JSON.stringify({
                    error: 'Book not found',
                    message: `Book with ID ${bookId} does not exist`
                })
            };
        }
        
        console.log(`Found book: ${result.Item.title}`);
        
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
                book: result.Item
            })
        };
        
    } catch (error) {
        console.error('Error getting book:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            body: JSON.stringify({
                error: 'Failed to retrieve book',
                message: error.message
            })
        };
    }
};