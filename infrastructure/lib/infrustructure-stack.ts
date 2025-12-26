import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class InfrustructureStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;
  public readonly booksTable: dynamodb.Table;
  public readonly readingListsTable: dynamodb.Table;
  public readonly helloWorldFunction: lambda.Function;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Tables
    this.booksTable = new dynamodb.Table(this, 'BooksTable', {
      tableName: 'Books',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development only
    });

    this.readingListsTable = new dynamodb.Table(this, 'ReadingListsTable', {
      tableName: 'ReadingLists',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development only
    });

    // Add Global Secondary Index
    this.readingListsTable.addGlobalSecondaryIndex({
      indexName: 'id-index',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });

    // Lambda Functions
    this.helloWorldFunction = new lambda.Function(this, 'HelloWorldFunction', {
      functionName: 'hello-world-test',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/hello-world'),
      environment: {
        BOOKS_TABLE_NAME: this.booksTable.tableName,
        READING_LISTS_TABLE_NAME: this.readingListsTable.tableName,
      },
    });

    // Grant Lambda permissions to access DynamoDB tables
    this.booksTable.grantReadWriteData(this.helloWorldFunction);
    this.readingListsTable.grantReadWriteData(this.helloWorldFunction);

    // API Gateway
    this.api = new apigateway.RestApi(this, 'LibraryApi', {
      restApiName: 'library-api',
      description: 'Library recommendation system API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    // API Gateway Resources
    const helloResource = this.api.root.addResource('hello');
    helloResource.addMethod('GET', new apigateway.LambdaIntegration(this.helloWorldFunction));

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.url,
      description: 'API Gateway URL',
    });

    new cdk.CfnOutput(this, 'BooksTableName', {
      value: this.booksTable.tableName,
      description: 'DynamoDB Books Table Name',
    });

    new cdk.CfnOutput(this, 'ReadingListsTableName', {
      value: this.readingListsTable.tableName,
      description: 'DynamoDB Reading Lists Table Name',
    });
  }
}