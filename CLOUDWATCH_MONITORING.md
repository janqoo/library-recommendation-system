# CloudWatch Monitoring Setup

## 🔍 **Performance Monitoring Implementation**

### **1. Lambda Function Monitoring**

#### **A. Set Up Lambda Alarms**

**Go to CloudWatch Console → Alarms → Create Alarm:**

#### **Error Rate Alarm**
1. **Select Metric**: AWS/Lambda → By Function Name
2. **Choose your functions**: `library-get-books`, `library-get-book`, etc.
3. **Metric**: `Errors`
4. **Statistic**: Sum
5. **Period**: 5 minutes
6. **Threshold**: Greater than 5 errors in 5 minutes
7. **Actions**: Send SNS notification (optional)

#### **Duration Alarm (Cold Starts)**
1. **Select Metric**: AWS/Lambda → By Function Name
2. **Metric**: `Duration`
3. **Statistic**: Average
4. **Period**: 5 minutes
5. **Threshold**: Greater than 3000ms (3 seconds)
6. **Actions**: Send SNS notification

#### **Throttle Alarm**
1. **Select Metric**: AWS/Lambda → By Function Name
2. **Metric**: `Throttles`
3. **Statistic**: Sum
4. **Period**: 5 minutes
5. **Threshold**: Greater than 0
6. **Actions**: Send SNS notification

### **2. API Gateway Monitoring**

#### **A. Set Up API Gateway Alarms**

#### **4XX Error Rate Alarm**
1. **Select Metric**: AWS/ApiGateway → By API Name
2. **Metric**: `4XXError`
3. **Statistic**: Sum
4. **Period**: 5 minutes
5. **Threshold**: Greater than 10 errors in 5 minutes

#### **5XX Error Rate Alarm**
1. **Select Metric**: AWS/ApiGateway → By API Name
2. **Metric**: `5XXError`
3. **Statistic**: Sum
4. **Period**: 5 minutes
5. **Threshold**: Greater than 1 error in 5 minutes

#### **Latency Alarm**
1. **Select Metric**: AWS/ApiGateway → By API Name
2. **Metric**: `Latency`
3. **Statistic**: Average
4. **Period**: 5 minutes
5. **Threshold**: Greater than 2000ms (2 seconds)

#### **Cache Hit Rate Monitoring**
1. **Select Metric**: AWS/ApiGateway → By API Name
2. **Metric**: `CacheHitCount` and `CacheMissCount`
3. **Create Dashboard** to monitor cache effectiveness

### **3. DynamoDB Monitoring**

#### **A. Set Up DynamoDB Alarms**

#### **Throttled Requests Alarm**
1. **Select Metric**: AWS/DynamoDB → Table Metrics
2. **Table**: `Books`, `ReadingLists`
3. **Metric**: `ThrottledRequests`
4. **Statistic**: Sum
5. **Period**: 5 minutes
6. **Threshold**: Greater than 0

#### **Consumed Capacity Alarm**
1. **Select Metric**: AWS/DynamoDB → Table Metrics
2. **Metric**: `ConsumedReadCapacityUnits`
3. **Statistic**: Sum
4. **Period**: 5 minutes
5. **Threshold**: Greater than 80% of provisioned capacity

### **4. Custom Dashboard Creation**

#### **Create Performance Dashboard:**

1. **Go to CloudWatch → Dashboards → Create Dashboard**
2. **Add Widgets**:

#### **Lambda Performance Widget**
- **Widget Type**: Line Graph
- **Metrics**: 
  - Lambda Duration (all functions)
  - Lambda Errors (all functions)
  - Lambda Invocations (all functions)

#### **API Gateway Performance Widget**
- **Widget Type**: Line Graph
- **Metrics**:
  - API Gateway Latency
  - API Gateway 4XX/5XX Errors
  - API Gateway Count (requests)

#### **Cache Performance Widget**
- **Widget Type**: Stacked Area
- **Metrics**:
  - CacheHitCount
  - CacheMissCount
- **Calculate**: Cache Hit Rate = CacheHitCount / (CacheHitCount + CacheMissCount)

#### **DynamoDB Performance Widget**
- **Widget Type**: Line Graph
- **Metrics**:
  - ConsumedReadCapacityUnits
  - ConsumedWriteCapacityUnits
  - ThrottledRequests

### **5. Log Insights Queries**

#### **A. Useful CloudWatch Logs Insights Queries**

#### **Lambda Performance Analysis**
```sql
fields @timestamp, @duration, @billedDuration, @memorySize, @maxMemoryUsed
| filter @type = "REPORT"
| stats avg(@duration), max(@duration), min(@duration) by bin(5m)
```

#### **Lambda Error Analysis**
```sql
fields @timestamp, @message
| filter @message like /ERROR/
| sort @timestamp desc
| limit 100
```

#### **API Gateway Access Logs**
```sql
fields @timestamp, requestId, status, responseTime, requestTime
| filter status >= 400
| sort @timestamp desc
```

#### **Performance Bottleneck Detection**
```sql
fields @timestamp, @duration, @message
| filter @message like /Query took/
| parse @message "Query took *ms" as queryTime
| stats avg(queryTime), max(queryTime) by bin(5m)
```

### **6. Performance Optimization Alerts**

#### **A. Create SNS Topic for Alerts**

1. **Go to SNS Console → Topics → Create Topic**
2. **Name**: `library-performance-alerts`
3. **Type**: Standard
4. **Create Subscription**:
   - **Protocol**: Email
   - **Endpoint**: Your email address

#### **B. Configure Alert Actions**

**For each alarm created above:**
1. **Actions**: Send notification to SNS topic
2. **Topic**: `library-performance-alerts`
3. **Message**: Custom message with performance context

### **7. Automated Performance Reports**

#### **A. Create Lambda for Daily Reports**

```javascript
// Lambda function for daily performance reports
const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch();

exports.handler = async (event) => {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
    
    // Get Lambda metrics
    const lambdaMetrics = await cloudwatch.getMetricStatistics({
        Namespace: 'AWS/Lambda',
        MetricName: 'Duration',
        Dimensions: [{ Name: 'FunctionName', Value: 'library-get-books' }],
        StartTime: startTime,
        EndTime: endTime,
        Period: 3600, // 1 hour
        Statistics: ['Average', 'Maximum']
    }).promise();
    
    // Get API Gateway metrics
    const apiMetrics = await cloudwatch.getMetricStatistics({
        Namespace: 'AWS/ApiGateway',
        MetricName: 'Latency',
        StartTime: startTime,
        EndTime: endTime,
        Period: 3600,
        Statistics: ['Average', 'Maximum']
    }).promise();
    
    // Generate report
    const report = {
        date: endTime.toISOString().split('T')[0],
        lambda: {
            averageDuration: lambdaMetrics.Datapoints.reduce((sum, dp) => sum + dp.Average, 0) / lambdaMetrics.Datapoints.length,
            maxDuration: Math.max(...lambdaMetrics.Datapoints.map(dp => dp.Maximum))
        },
        api: {
            averageLatency: apiMetrics.Datapoints.reduce((sum, dp) => sum + dp.Average, 0) / apiMetrics.Datapoints.length,
            maxLatency: Math.max(...apiMetrics.Datapoints.map(dp => dp.Maximum))
        }
    };
    
    console.log('Daily Performance Report:', JSON.stringify(report, null, 2));
    
    // Send report via SNS (optional)
    // await sns.publish({
    //     TopicArn: 'arn:aws:sns:us-east-1:123456789012:library-performance-alerts',
    //     Message: JSON.stringify(report, null, 2),
    //     Subject: 'Daily Performance Report'
    // }).promise();
    
    return report;
};
```

### **8. Performance Metrics to Monitor**

#### **Key Performance Indicators (KPIs)**

1. **Response Time**:
   - API Gateway Latency < 2 seconds
   - Lambda Duration < 3 seconds
   - DynamoDB Query Time < 100ms

2. **Error Rates**:
   - API 4XX Error Rate < 5%
   - API 5XX Error Rate < 1%
   - Lambda Error Rate < 1%

3. **Throughput**:
   - API Requests per minute
   - Lambda Invocations per minute
   - DynamoDB Read/Write Capacity Usage

4. **Cache Performance**:
   - Cache Hit Rate > 70%
   - Cache Miss Rate < 30%

5. **Cost Optimization**:
   - Lambda Cost per Invocation
   - DynamoDB Cost per Request
   - API Gateway Cost per Request

### **9. Automated Scaling Triggers**

#### **A. Lambda Concurrency Alarms**
```javascript
// CloudWatch Alarm for Lambda Concurrency
{
    "AlarmName": "Lambda-High-Concurrency",
    "MetricName": "ConcurrentExecutions",
    "Namespace": "AWS/Lambda",
    "Statistic": "Maximum",
    "Period": 300,
    "EvaluationPeriods": 2,
    "Threshold": 100,
    "ComparisonOperator": "GreaterThanThreshold"
}
```

#### **B. DynamoDB Auto Scaling**
```javascript
// Enable Auto Scaling for DynamoDB
{
    "TableName": "Books",
    "BillingMode": "PROVISIONED",
    "ProvisionedThroughput": {
        "ReadCapacityUnits": 5,
        "WriteCapacityUnits": 5
    },
    "GlobalSecondaryIndexes": [{
        "IndexName": "genre-index",
        "ProvisionedThroughput": {
            "ReadCapacityUnits": 5,
            "WriteCapacityUnits": 5
        }
    }]
}
```

### **10. Performance Testing Integration**

#### **A. Load Testing with CloudWatch**
```bash
# Use Artillery.js for load testing
npm install -g artillery

# Create load test config
cat > load-test.yml << EOF
config:
  target: 'https://your-api-gateway-url.amazonaws.com/dev'
  phases:
    - duration: 60
      arrivalRate: 10
  defaults:
    headers:
      Authorization: 'Bearer your-jwt-token'

scenarios:
  - name: "Get Books"
    requests:
      - get:
          url: "/books"
  - name: "Get Single Book"
    requests:
      - get:
          url: "/books/1"
EOF

# Run load test
artillery run load-test.yml
```

This comprehensive monitoring setup will give you complete visibility into your application's performance and help you identify bottlenecks before they impact users.