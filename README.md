# Serverless Todo App 📝🚀

A fully serverless Todo application built using **AWS Lambda, API Gateway, DynamoDB, S3**, and **Auth0** for authentication. This project follows the Udacity Cloud Developer Nanodegree requirements and demonstrates best practices for building secure, scalable serverless applications.

---

## 📌 Features

- User authentication and authorization using **Auth0 (JWT + Custom Authorizer)**
- CRUD operations for Todos
- Per-user data isolation
- Image upload support using **S3 pre-signed URLs**
- Serverless backend with **AWS Lambda**
- REST API with **API Gateway**
- Persistent storage using **DynamoDB**
- Observability using **CloudWatch Logs & X-Ray**

---

## 🏗️ Architecture Overview

```
Client (React + Auth0)
        |
        v
API Gateway (REST API)
        |
        v
Custom Lambda Authorizer (Auth0 JWT validation)
        |
        v
Lambda Functions (CRUD / Upload URL)
        |
        +--> DynamoDB (Todos Table)
        +--> S3 (Attachments Bucket)
```

---

## 🛠️ Tech Stack

### Backend
- Node.js 18.x
- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- Amazon S3
- Serverless Framework v3
- Middy middleware

### Authentication
- Auth0
- JWT (RS256)

### Frontend (optional)
- React
- Axios

---

## 📂 Project Structure

```
serverless-todo-app/
├── src/
│   ├── lambda/
│   │   ├── auth/                # Auth0 Custom Authorizer
│   │   └── http/                # API handlers
│   ├── businessLogic/           # Core application logic
│   └── utils/                   # Helpers (JWT, logging)
├── models/                      # Request validation schemas
├── serverless.yml
├── package.json
└── README.md
```

---

## 🔐 Authentication Flow

1. User logs in via Auth0
2. Frontend receives **Access Token (JWT)**
3. Token is sent in API requests:
   ```
   Authorization: Bearer <access_token>
   ```
4. API Gateway invokes **Custom Lambda Authorizer**
5. JWT is verified using Auth0 JWKS
6. API access is granted or denied

---

## 🌐 API Endpoints

Base URL:
```
https://<api-id>.execute-api.us-east-1.amazonaws.com/dev
```

| Method | Endpoint | Description |
|------|---------|-------------|
| GET | /todos | Get all todos for user |
| POST | /todos | Create a new todo |
| PATCH | /todos/{todoId} | Update a todo |
| DELETE | /todos/{todoId} | Delete a todo |
| POST | /todos/{todoId}/attachment | Generate upload URL |

---

## 🧪 Sample cURL Commands

### Get Todos
```bash
curl -X GET \
"https://<api-id>.execute-api.us-east-1.amazonaws.com/dev/todos" \
-H "Authorization: Bearer $TOKEN"
```

### Create Todo
```bash
curl -X POST \
"https://<api-id>.execute-api.us-east-1.amazonaws.com/dev/todos" \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "name": "My first todo",
  "dueDate": "2025-12-31"
}'
```

---

## 🗄️ DynamoDB Schema

**Primary Key**
- Partition key: `userId`
- Sort key: `todoId`

**Local Secondary Index**
- Index name: `CreatedAtIndex`
- Sort key: `createdAt`

---

## 🖼️ S3 Attachments

- Each todo can have an optional image
- Images are uploaded using **pre-signed URLs**
- Bucket CORS enabled for PUT/GET

---

## 📊 Monitoring & Debugging

- **CloudWatch Logs** for Lambda execution
- **AWS X-Ray** enabled for tracing
- API Gateway default 4XX responses configured

---

## 🚀 Deployment

### Prerequisites
- Node.js >= 18
- AWS CLI configured
- Serverless Framework

```bash
npm install -g serverless
```

### Deploy
```bash
npm install
serverless deploy
```

---

## 🧠 Lessons Learned

- Implementing custom JWT authorizers
- Securing serverless APIs
- Managing per-user data isolation
- Debugging with CloudWatch
- Building scalable serverless architectures

---

## 📌 Author

**Arpitha V**  
Udacity Cloud Developer Nanodegree

---

## ✅ Status

✔ Backend complete  
✔ Authentication complete  
✔ CRUD operations verified  
✔ Ready for Udacity submission 🎓

---

Happy coding! 🎉

