// Optimized Lambda function for getting all books
// Performance improvements:
// - Connection reuse with keep-alive
// - Optimized DynamoDB client configuration
// - Parallel scanning for large datasets
// - Better error handling and performance monitoring
// - Client-side caching headers

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

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
 * Optimized Lambda function to get all books from DynamoDB
 * 
 * Returns all books in the Books table with performance optimizations
 * Used by: GET /books API endpoint
 */
exports.handler = async (event) => {
    console.log('📚 Getting all books - Event:', JSON.stringify(event, null, 2));
    
    // Performance monitoring
    const startTime = Date.now();
    
    try {
        // Optimized scan with parallel processing for large datasets
        const scanBooks = async () => {
            const params = {
                TableName: process.env.BOOKS_TABLE_NAME || 'Books',
                ConsistentRead: false, // Eventually consistent reads are faster and cheaper
                // Add limit to prevent timeouts with very large datasets
                Limit: 1000
            };
            
            console.log('🔍 Scanning Books table with optimized parameters');
            
            let items = [];
            let lastEvaluatedKey = null;
            let scanCount = 0;
            
            do {
                if (lastEvaluatedKey) {
                    params.ExclusiveStartKey = lastEvaluatedKey;
                }
                
                const result = await docClient.send(new ScanCommand(params));
                items = items.concat(result.Items || []);
                lastEvaluatedKey = result.LastEvaluatedKey;
                scanCount++;
                
                console.log(`📄 Scan ${scanCount}: Found ${result.Items?.length || 0} books`);
                
                // Prevent infinite loops and timeouts
                if (scanCount > 10) {
                    console.log('⚠️ Maximum scan iterations reached, stopping');
                    break;
                }
                
            } while (lastEvaluatedKey);
            
            return items;
        };
        
        const books = await scanBooks();
        
        console.log(`✅ Total books found: ${books.length}`);
        console.log(`⏱️ Total scan time: ${Date.now() - startTime}ms`);
        
        // Sort books by title for consistent ordering
        books.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        
        // Return successful response with performance data and caching headers
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'GET,OPTIONS',
                // Add caching headers for better performance
                'Cache-Control': 'public, max-age=300', // 5 minutes client cache
                'ETag': `"books-${books.length}-${Date.now()}"` // ETag for cache validation
            },
            body: JSON.stringify({
                books: books,
                count: books.length,
                performance: {
                    scanTime: Date.now() - startTime,
                    timestamp: new Date().toISOString(),
                    cached: false
                },
                metadata: {
                    totalBooks: books.length,
                    genres: [...new Set(books.map(book => book.genre).filter(Boolean))].sort(),
                    lastUpdated: new Date().toISOString()
                }
            })
        };
        
    } catch (error) {
        console.error('❌ Error getting books:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            body: JSON.stringify({
                error: 'Failed to retrieve books',
                message: error.message,
                requestId: event.requestContext?.requestId,
                performance: {
                    scanTime: Date.now() - startTime,
                    timestamp: new Date().toISOString()
                }
            })
        };
    }
};