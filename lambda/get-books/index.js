const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

// Initialize DynamoDB client
const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Lambda function to get all books from DynamoDB
 * 
 * Returns all books in the Books table
 * Used by: GET /books API endpoint
 */
exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    try {
        // Scan the Books table to get all books
        const command = new ScanCommand({
            TableName: process.env.BOOKS_TABLE_NAME || 'Books'
        });
        
        const result = await docClient.send(command);
        
        console.log(`Found ${result.Items.length} books`);
        
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
                books: result.Items || [],
                count: result.Items ? result.Items.length : 0
            })
        };
        
    } catch (error) {
        console.error('Error getting books:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            body: JSON.stringify({
                error: 'Failed to retrieve books',
                message: error.message
            })
        };
    }
};