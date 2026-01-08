# Library Recommendation System - Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  React + TypeScript + Tailwind CSS                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │    Books    │  │Recommenda-  │  │ Reading     │  │    Auth     │       │
│  │    Page     │  │   tions     │  │   Lists     │  │   Pages     │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS API Calls
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DEPLOYMENT LAYER                               │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                         │
│  │   GitHub    │  │ CodePipeline│  │     S3      │                         │
│  │ Repository  │──│   CI/CD     │──│Static Website│                        │
│  └─────────────┘  └─────────────┘  └─────────────┘                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ API Requests
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY LAYER                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  API Gateway (REST API)                                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │GET /books   │  │POST /reading│  │POST /recom- │  │   Cognito   │       │
│  │GET /books/id│  │-lists       │  │mendations   │  │ Authorizer  │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Lambda Invocations
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              COMPUTE LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  AWS Lambda Functions (Node.js 20)                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │library-get- │  │library-get- │  │library-     │  │library-get- │       │
│  │books        │  │reading-lists│  │create-      │  │recommenda-  │       │
│  │             │  │             │  │reading-list │  │tions        │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│  ┌─────────────┐  ┌─────────────┐                                          │
│  │library-     │  │library-     │                                          │
│  │update-      │  │delete-      │                                          │
│  │reading-list │  │reading-list │                                          │
│  └─────────────┘  └─────────────┘                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Database Queries
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  DynamoDB Tables                                                            │
│  ┌─────────────┐  ┌─────────────┐                                          │
│  │    Books    │  │ ReadingLists│                                          │
│  │             │  │             │                                          │
│  │ PK: id      │  │ PK: userId  │                                          │
│  │ title       │  │ SK: id      │                                          │
│  │ author      │  │ name        │                                          │
│  │ genre       │  │ bookIds[]   │                                          │
│  │ description │  │ createdAt   │                                          │
│  └─────────────┘  └─────────────┘                                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              AI/ML LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐                                          │
│  │   Amazon    │  │   Cognito   │                                          │
│  │   Bedrock   │  │ User Pool   │                                          │
│  │             │  │             │                                          │
│  │Claude Haiku │  │Users & Auth │                                          │
│  │AI Model     │  │JWT Tokens   │                                          │
│  └─────────────┘  └─────────────┘                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend (React + TypeScript)
- **Technology**: React 19, TypeScript, Vite, Tailwind CSS
- **Deployment**: S3 Static Website Hosting
- **CI/CD**: GitHub → CodePipeline → CodeBuild → S3
- **Features**: Books browsing, AI recommendations, reading lists, authentication

### API Gateway
- **Type**: REST API
- **Endpoints**: 
  - `GET /books` - List all books
  - `GET /books/{id}` - Get book details  
  - `GET /reading-lists` - Get user's reading lists
  - `POST /reading-lists` - Create reading list
  - `PUT /reading-lists/{id}` - Update reading list
  - `DELETE /reading-lists/{id}` - Delete reading list
  - `POST /recommendations` - Get AI recommendations
- **Security**: Cognito Authorizer for protected endpoints
- **CORS**: Enabled for frontend domain

### Lambda Functions
- **Runtime**: Node.js 20
- **Architecture**: Serverless, event-driven
- **Functions**:
  - `library-get-books` - Fetch books from DynamoDB
  - `library-get-reading-lists` - Fetch user's reading lists
  - `library-create-reading-list` - Create new reading list
  - `library-update-reading-list` - Update existing reading list
  - `library-delete-reading-list` - Delete reading list
  - `library-get-recommendations` - Generate AI recommendations

### DynamoDB Tables
- **Books Table**:
  - Partition Key: `id` (String)
  - Attributes: title, author, genre, description, coverImage, rating, publishedYear, isbn
  - Pricing: On-demand
  
- **ReadingLists Table**:
  - Partition Key: `userId` (String)
  - Sort Key: `id` (String)
  - Attributes: name, description, bookIds[], createdAt, updatedAt
  - Global Secondary Index: `id-index` for direct list access

### Authentication (AWS Cognito)
- **User Pool**: `us-east-1_yeEUsuvJj`
- **App Client**: `3enb5l75s3s8524rvqh2lhtsti` (SPA type)
- **Features**: Sign up, sign in, password reset, email verification
- **Integration**: AWS Amplify v6

### AI Recommendations (Amazon Bedrock)
- **Model**: Claude 3 Haiku
- **Input**: User query (e.g., "I like discipline books and motivations")
- **Output**: Structured book recommendations with titles, authors, and reasons
- **Cost**: ~$0.01 per recommendation

## Data Flow

### 1. User Authentication Flow
```
User → Frontend → Cognito → JWT Token → Stored in Context → Used in API calls
```

### 2. Books Browsing Flow
```
User → Books Page → API Gateway → library-get-books Lambda → DynamoDB → Response
```

### 3. AI Recommendations Flow
```
User Query → Frontend → API Gateway → library-get-recommendations Lambda → Bedrock → AI Response
```

### 4. Reading Lists Flow
```
User Action → Frontend → API Gateway → Cognito Auth → Lambda Function → DynamoDB → Response
```

### 5. CI/CD Deployment Flow
```
Git Push → GitHub → CodePipeline → CodeBuild → npm build → S3 Deployment → Live Website
```

## Security Architecture

### Authentication & Authorization
- **Frontend**: AWS Amplify handles Cognito integration
- **API**: Cognito Authorizer validates JWT tokens
- **Lambda**: Receives user context from API Gateway
- **Database**: User isolation via userId in queries

### CORS Configuration
- **API Gateway**: Configured to allow frontend domain
- **Headers**: Authorization, Content-Type allowed
- **Methods**: GET, POST, PUT, DELETE, OPTIONS

### IAM Roles & Permissions
- **Lambda Execution Role**: DynamoDB read/write, CloudWatch logs
- **CodeBuild Role**: S3 deployment permissions
- **Cognito**: User pool and identity pool permissions

## Performance & Scalability

### Caching Strategy
- **API Gateway**: Caching enabled for GET /books (300s TTL)
- **Frontend**: Browser caching for static assets
- **DynamoDB**: On-demand scaling

### Monitoring & Logging
- **CloudWatch**: Lambda function logs and metrics
- **API Gateway**: Request/response logging
- **DynamoDB**: Performance metrics

### Cost Optimization
- **Lambda**: Pay-per-request, optimized for cold starts
- **DynamoDB**: On-demand pricing for variable workloads
- **S3**: Standard storage class for static website
- **Free Tier**: Most usage covered under AWS Free Tier

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 19 + TypeScript | User interface |
| Styling | Tailwind CSS | Responsive design |
| Build Tool | Vite | Fast development and builds |
| Deployment | S3 + CodePipeline | Static hosting and CI/CD |
| API | API Gateway | REST API management |
| Compute | Lambda (Node.js 20) | Serverless functions |
| Database | DynamoDB | NoSQL data storage |
| Authentication | Cognito | User management |
| AI/ML | Bedrock (Claude) | Book recommendations |
| Monitoring | CloudWatch | Logging and metrics |
| Version Control | GitHub | Source code management |

## Deployment URLs

- **Frontend**: [Your S3 Static Website URL]
- **API Base**: `https://dm4c45d6xd.execute-api.us-east-1.amazonaws.com/dev`
- **Repository**: `https://github.com/janqoo/library-recommendation-system`

## Environment Configuration

```env
VITE_API_BASE_URL=https://dm4c45d6xd.execute-api.us-east-1.amazonaws.com/dev
VITE_COGNITO_USER_POOL_ID=us-east-1_yeEUsuvJj
VITE_COGNITO_CLIENT_ID=3enb5l75s3s8524rvqh2lhtsti
VITE_AWS_REGION=us-east-1
```

This architecture provides a scalable, secure, and cost-effective solution for the library recommendation system, leveraging AWS serverless technologies for optimal performance and maintainability.