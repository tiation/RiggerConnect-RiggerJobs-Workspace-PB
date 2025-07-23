# RiggerHireApp API Documentation

## Overview
This documentation provides an overview of the RiggerHireApp microservices architecture, including individual service endpoints, request/response structures, and integration details.

## Authentication Service
- **Base URL**: `/auth`

### Endpoints

#### POST `/auth/login`
- **Description**: Allows users to log in using their credentials.
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "accessToken": "string",
    "refreshToken": "string"
  }
  ```

#### POST `/auth/register`
- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string",
    "role": "string"
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "email": "string"
  }
  ```

## Document Processing Service
- **Base URL**: `/documents`

### Endpoints

#### POST `/documents/verify`
- **Description**: Verifies a provided document.
- **Request Body**:
  ```json
  {
    "documentNumber": "string",
    "documentType": "string",
    "licenseClass": "string"
  }
  ```
- **Response**:
  ```json
  {
    "status": "string",
    "verificationDetails": {}
  }
  ```

## Notification Service
- **Base URL**: `/notifications`

### Endpoints

#### POST `/notifications/send`
- **Description**: Sends a notification to a user.
- **Request Body**:
  ```json
  {
    "recipientId": "string",
    "content": "string",
    "channel": "string"
  }
  ```
- **Response**:
  ```json
  {
    "status": "string"
  }
  ```

## Analytics Service
- **Base URL**: `/analytics`

### Endpoints

#### GET `/analytics/safety-metrics`
- **Description**: Retrieves safety metrics over a time period.
- **Parameters**: `start`, `end`
- **Response**:
  ```json
  {
    "metrics": {}
  }
  ```
