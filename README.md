[![Build Status](https://travis-ci.org/iakhator/document-manager.svg?branch=staging)](https://travis-ci.org/iakhator/document-manager)
[![Coverage Status](https://coveralls.io/repos/github/iakhator/document-manager/badge.svg?branch=staging)](https://coveralls.io/github/iakhator/document-manager?branch=staging)
[![Code Climate](https://codeclimate.com/github/iakhator/document-manager/badges/gpa.svg)](https://codeclimate.com/github/iakhator/document-manager)

# document-manager
Document manager provides REST API endpoints for a document management system. It allows create, retrieve, update and delete actions to be carried out.
It also ensures that users are authorized.

# API Documentation
The API has predictable, resource-oriented URLs, and uses HTTP response codes to indicate API status and errors.

## Features

**Users**:
A created user will have a role, either an admin or a fellow.
- A Fellow User can:
    - Create an account
    - Search users
    - Create a document
    - Edit a document
    - Retrieve a document
    - Delete a document
    - Limit access to a document by specifying an access group `i.e. public, private or role`.
    - View public documents created by other users.
    - View documents created by his access group with access level set as `role`.
    - Search documents.
    - View `public` and `role` access level documents of other regular users.

- An Admin User can:
    - View all users
    - View all created documents
    - Delete any user
    - Update any user's role
    - Create a new role
    - View all created roles
    - Search for any user
    - Search for any document

**Documents**:
Documents can be created and must have:
  - Published date
  - Title
  - Content
  - Access (`private, public or role`)

**Roles**:
Roles can also be created, the default roles are `admin` and `fellow`.
Only an admin user can create and manage role(s)

**Authentication**:
Users are authenticated and validated using JSON web token (JWT).
By generating a token on login, API endpoints and documents are protected from unauthorized access.
Requests to protected routes are validated using the generated token.

## Endpoints

**Users**

Request type | Endpoint | Action
------------ | -------- | ------
POST | [/users](#create-user) | Create a new user
GET | [/users](#get-all-users) | Get all users
GET | [/users/:id](#get-user) | Get details of a specific user
GET | [/users/login](#login) | To log a user in
GET | [/users/?limit={integer}&offset={integer}](#pagination) | Pagination for users
GET | [/search/users/?query=new](#search-user) | To search for a user
GET | [/users/:id/documents](#user-documents) | Retrieve all documents created by a user
PUT | [/users/:id](#edit-user) | Edit user details
DELETE | [/users/:id](#delete-user) | Delete a user from database

**Roles**

Request type | Endpoint | Action
------------ | -------- | ------
POST | [/roles](#create-role) | Create a new role
GET | [/roles](#get-all-roles) | Get all created roles
GET | [/role/:id](#get-role) | Get a specific role
PUT | [/role/:id](#edit-role) | Edit a specific role
DELETE | [/role/:id](#delete-role) | Delete a specific role

**Documents**

Request type | Endpoint | Action
------------ | -------- | ------
POST | [/documents](#create-document) | Create a new document
GET | [/documents](#get-all-documents) | Retrieve all documents
GET | [/documents/:id](#get-document) | Retrieve a specific document
GET | [/documents/?limit={integer}&offset={integer}](#pagination) | Pagination for documents
GET | [/search/documents/?query=new](#search-document) | Search documents using key terms
PUT | [/documents/:id](#edit-document) | Update a specific document
DELETE | [/documents/:id](#delete-document) | Remove a specific document from storage

## Development
Document Management System API is built with the following technologies;
- EcmaScript6 (ES6)
- [NodeJs](https://nodejs.org)
- [Express](http://expressjs.com/)
- [Postgresql](https://www.postgresql.org/)
- [Sequelize ORM](http://docs.sequelizejs.com/en/v3/)

## Installation
  - Install [NodeJs](https://nodejs.org/en/) and [Postgres](https://www.postgresql.org/) on your machine
  - Clone the repository `$ git clone https://github.com/iakhator/document-manager.git`
  - Change into the directory `$ cd /document-manager`
  - Install all required dependencies with `$ npm install`
  - Create a `.env` file in your root directory as described in `.env.sample` file
  - Start the app with `npm start`
  - Run Test `npm test`

## Contributing
- Fork this repository to your GitHub account
- Clone the forked repository
- Create your feature branch
- Commit your changes
- Push to the remote branch
- Open a Pull Request

## Limitations
The limitations of the API are:
- Users cannot delete themselves using the API
- Documents are not unique (A user can create a document with the same title)
- User cannot login on two different platform

## LICENSE
 This project is authored by [Itua Akhator](https://github.com/iakhator) it is licensed under the MIT license.
