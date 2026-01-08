# Libra AI - AI-Powered Book Recommendation System

![AWS](https://img.shields.io/badge/AWS-Serverless-orange)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Bedrock](https://img.shields.io/badge/Bedrock-Claude%203%20Haiku-purple)
![DynamoDB](https://img.shields.io/badge/DynamoDB-NoSQL-red)

An intelligent library book recommendation system built with React, TypeScript, and AWS serverless architecture. This project demonstrates modern full-stack development with AI integration for CENG413 Software Quality Standards course.

## 🌐 Live Application

**🎉 DEPLOYED APPLICATION**: https://d11aq44bewncft.cloudfront.net

**Status**: ✅ **FULLY DEPLOYED AND WORKING!**
- ✅ Frontend deployed via CloudFront to global CDN
- ✅ Backend API running on AWS Lambda + DynamoDB  
- ✅ Authentication working with AWS Cognito
- ✅ AI Recommendations powered by Amazon Bedrock
- ✅ HTTPS secure and mobile-responsive

## 🎯 Project Overview

This project provides a complete AI-powered book recommendation system with modern serverless architecture. Users can browse books, get personalized AI recommendations, manage reading lists, and enjoy a seamless authentication experience.

## 🚀 Features

- **AI-Powered Recommendations**: Integration with Amazon Bedrock for intelligent book suggestions
- **User Authentication**: Secure login/signup with AWS Cognito and email verification
- **Reading Lists**: Create, manage, and organize personal book collections
- **Book Management**: Browse extensive catalog with search and filtering
- **Admin Dashboard**: Book management and system metrics
- **Responsive Design**: Mobile-first approach optimized for all devices
- **Real-time Updates**: Dynamic content with instant synchronization

## 🏗️ Architecture

### Frontend
- **React 19** with TypeScript for type safety
- **Tailwind CSS** for responsive design
- **Vite** for fast development and optimized builds
- **AWS Amplify** for Cognito integration

### Backend (AWS Serverless)
- **API Gateway** - RESTful API endpoints
- **AWS Lambda** - Serverless compute functions
- **DynamoDB** - NoSQL database for books and reading lists
- **Amazon Cognito** - User authentication and management
- **Amazon Bedrock** - AI-powered book recommendations

### Infrastructure
- **CloudFront** - Global CDN for fast content delivery
- **S3** - Static website hosting
- **HTTPS** - Secure communication with SSL/TLS

## 📋 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/books` | GET | Retrieve all books |
| `/books/{id}` | GET | Get specific book details |
| `/reading-lists` | GET | Get user's reading lists |
| `/reading-lists` | POST | Create new reading list |
| `/reading-lists/{id}` | PUT | Update reading list |
| `/reading-lists/{id}` | DELETE | Delete reading list |
| `/recommendations` | POST | Get AI-powered book recommendations |

**Base URL**: `https://dm4c45d6xd.execute-api.us-east-1.amazonaws.com/dev`

## 👥 Team Contributions

### **Mohamed Ibrahim**
- **Primary Responsibility**: AWS Cognito Authentication (Week 3)
- **Key Contributions**:
  - Implemented user authentication system with AWS Cognito
  - Configured email verification and password reset functionality
  - Developed new features and system enhancements
  - Led maintenance and bug fixing throughout the project
  - Collaborated on system architecture and deployment

### **Amro Aboalofa**
- **Primary Responsibility**: DynamoDB Database Design and Implementation
- **Key Contributions**:
  - Designed and implemented DynamoDB table structures
  - Developed database schemas for books and reading lists
  - Implemented data access patterns and optimization
  - Collaborated with Omar Isam on database integration

### **Omar Elbess**
- **Primary Responsibility**: AWS Lambda Functions Development
- **Key Contributions**:
  - Developed serverless Lambda functions for all API endpoints
  - Implemented business logic for books and reading lists management
  - Collaborated extensively on Cognito authentication integration
  - Contributed to system architecture and API design

### **Omar Isam**
- **Primary Responsibility**: DynamoDB Integration and Data Management
- **Key Contributions**:
  - Implemented DynamoDB integration with Lambda functions
  - Developed data persistence and retrieval mechanisms
  - Collaborated with Amro Aboalofa on database optimization
  - Ensured data consistency and performance

### **Faiyz**
- **Primary Responsibility**: Frontend Development and User Interface
- **Key Contributions**:
  - Developed complete React frontend with TypeScript
  - Implemented responsive design with Tailwind CSS
  - Created user interface components and user experience flows
  - Integrated frontend with AWS backend services
  - Implemented AI recommendations interface

## 🛠️ Technology Stack

### Frontend
- React 19 with TypeScript
- Tailwind CSS for styling
- Vite for build tooling
- AWS Amplify for authentication
- React Router for navigation

### Backend
- AWS Lambda (Node.js 20.x)
- Amazon DynamoDB
- Amazon API Gateway
- Amazon Cognito
- Amazon Bedrock (Claude 3 Haiku)

### DevOps & Deployment
- AWS CloudFront
- Amazon S3
- AWS CodePipeline (CI/CD)
- AWS CodeBuild

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ and npm 10+
- AWS Account with appropriate permissions
- Git for version control

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd library-recommendation-system

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=https://dm4c45d6xd.execute-api.us-east-1.amazonaws.com/dev
VITE_AWS_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=us-east-1_yeEUsuvJj
VITE_COGNITO_CLIENT_ID=3enb5l75s3s8524rvqh2lhtsti
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

## 📦 Deployment

The application is deployed using AWS services:

1. **Frontend**: Built with `npm run build` and deployed to S3 + CloudFront
2. **Backend**: Lambda functions deployed via AWS Console
3. **Database**: DynamoDB tables configured in AWS
4. **Authentication**: Cognito User Pool configured

## 🔒 Security Features

- HTTPS encryption via CloudFront
- JWT-based authentication with Cognito
- CORS configuration for secure API access
- Input validation and sanitization
- Secure password policies

## 📱 Mobile Support

- Responsive design optimized for mobile devices
- Touch-friendly interface elements
- Progressive Web App (PWA) capabilities
- Cross-browser compatibility

## 📊 Performance

- Global CDN delivery via CloudFront
- Optimized bundle sizes with code splitting
- Lazy loading for improved performance
- Efficient caching strategies

## 🎓 Academic Context

**Course**: CENG413 - Software Quality Standards  
**Institution**: Istanbul Okan University  
**Semester**: Fall 2024  
**Project Duration**: 4 weeks intensive development

## 📄 License

This project is developed for academic purposes as part of CENG413 coursework.

---

**Built with ❤️ by Team Libra AI for CENG413 - Software Quality Standards**