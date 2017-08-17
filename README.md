[![Build Status](https://travis-ci.org/iakhator/document-manager.svg?branch=staging)](https://travis-ci.org/iakhator/document-manager)
[![Coverage Status](https://coveralls.io/repos/github/iakhator/document-manager/badge.svg?branch=staging)](https://coveralls.io/github/iakhator/document-manager?branch=staging)
[![Code Climate](https://codeclimate.com/github/codeclimate/codeclimate/badges/gpa.svg)](https://codeclimate.com/github/codeclimate/codeclimate)

# document-manager
Document manager provides REST API endpoints for a document management system. It allows create, retrieve, update and delete actions to be carried out.
It also ensures that users are authorized.

# API Documentation
The API has predictable, resource-oriented URLs, and uses HTTP response codes to indicate API status and errors.

## Features

**Users**:
A created user will have a role, either an admin or a fellow.
- A Fellow User can:
    - Create an account: User can create a new account.
    - Search users: search for a specific user by Id.
    - Create a document: User can create document and assign an access type to each document created.
    - Edit a document: User can edit/update document by the document Id.
    - Retrieve a document: User can retrieve document based on access type or roles
    - Delete a document: User can delete document by Id if the Id matches the logged in id.
    - Limit access to a document by specifying an access group `i.e. public, private or role`.
    - View public documents created by other user
    - View documents created by his access group with access level set as `role`.
    - Search documents: User can search through document to get all document related to the search query.
    - View `public` and `role` access level documents of other fellows.

- An Admin User can:
    - View all users: An admin has the right to view all users
    - View all created documents: An admin can view all documents
    - Delete any user: An admin can delete any user by the user Id.
    - Update any user's role: An admin can update user Role
    - Create a new role
    - View all created roles
    - Search for any user
    - Search for any document

**Documents**:
Documents can be created and must have:
  - Published date: This is the created date and updated date of new document created
  - Title: This is the required title field of the document to be created.
  - Content: This is the body of the document created
  - Access (`private, public or role`): This is the access type of the document created.

**Roles**:
Roles can also be created, the default roles are `admin` and `fellow`.
Only an admin user can create and manage role(s)

**Authentication**:
Users are authenticated and validated using JSON web token (JWT).
By generating a token on login, API endpoints and documents are protected from unauthorized access.
Requests to protected routes are validated using the generated token.

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
We recommend that commit messages have a Header, Body and Footer.

```
feature(): This feature addresses some particular issue(s)
- implements functionality A.
- implements functionality B.
[Delivers #STORY_ID]

```
- Push to the remote branch
- Open a Pull Request
We recommend that pull requests follow this convention:

```
- Describe what this PR does
- How should this be manually tested?
- Any background context you want to provide?
- Screenshots (if appropriate)
- Questions:

```

## Limitations
The limitations of the API are:
- The application cannot accommodate millions of users for now because the database used only allow limited number of users since it is a free account.
- Users cannot share documents with other users through social sharing

## LICENSE
 This project is authored by [Itua Akhator](https://github.com/iakhator) it is licensed under the MIT license.
