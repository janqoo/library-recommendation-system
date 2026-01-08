// Optimized Lambda function for getting a single book
// Performance improvements:
// - Connection reuse with keep-alive
// - Optimized DynamoDB client configuration
// - Better error handling and logging
// - Client-side caching headers

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

// Initialize DynamoDB client outside handler for connection reuse
const client = new DynamoDBClient({ 
  region: process.env.AWS_REGION || 'us-east-1',
  maxAttempts: 3,
  // Connection pooling for better performance
  requestHandler: {
    httpsAgent: new (require('https')).Agent({
      keepAlive: true,
      maxSockets: 50,
      rejectUnauthorized: true
    })
  }
});
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Optimized Lambda function to get a single book by ID from DynamoDB
 * 
 * Expects book ID in path parameters: /books/{id}
 * Used by: GET /books/{id} API endpoint
 */
exports.handler = async (event) => {
    console.log('📖 Getting single book - Event:', JSON.stringify(event, null, 2));
    
    // Performance monitoring
    const startTime = Date.now();
    
    try {
        // Extract book ID from path parameters
        const bookId = event.pathParameters?.id;
        
        if (!bookId) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'GET,OPTIONS'
                },
                body: JSON.stringify({
                    error: 'Missing book ID',
                    message: 'Book ID is required in path parameters'
                })
            };
        }
        
        // Get the specific book from DynamoDB with optimized parameters
        const command = new GetCommand({
            TableName: process.env.BOOKS_TABLE_NAME || 'Books',
            Key: {
                id: bookId
            },
            ConsistentRead: false // Eventually consistent reads are faster
        });
        
        console.log(`🔍 Fetching book with ID: ${bookId}`);
        const result = await docClient.send(command);
        
        if (!result.Item) {
            console.log(`❌ Book not found: ${bookId}`);
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'GET,OPTIONS'
                },
                body: JSON.stringify({
                    error: 'Book not found',
                    message: `Book with ID ${bookId} does not exist`
                })
            };
        }
        
        console.log(`✅ Found book: ${result.Item.title}`);
        console.log(`⏱️ Query took ${Date.now() - startTime}ms`);
        
        // Return successful response with caching headers
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'GET,OPTIONS',
                // Add aggressive caching for individual books (they rarely change)
                'Cache-Control': 'public, max-age=600', // 10 minutes client cache
                'ETag': `"${bookId}-${Date.now()}"` // ETag for cache validation
            },
            body: JSON.stringify({
                book: result.Item,
                performance: {
                    queryTime: Date.now() - startTime,
                    timestamp: new Date().toISOString()
                }
            })
        };
        
    } catch (error) {
        console.error('❌ Error getting book:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            body: JSON.stringify({
                error: 'Failed to retrieve book',
                message: error.message,
                requestId: event.requestContext?.requestId
            })
        };
    }
};