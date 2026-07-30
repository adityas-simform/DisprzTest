# Server API reference

The Express server provides an in-memory REST API for managing **User** resources.

## Table of contents

- [Base URL](#base-url)
- [Data model](#data-model)
- [Error responses](#error-responses)
- [Endpoints](#endpoints)
  - [List users](#list-users)
  - [Get user](#get-user)
  - [Create user](#create-user)
  - [Update user](#update-user)
  - [Delete user](#delete-user)

---

## Base URL

```text
http://localhost:3000
```

Override the port with the `PORT` environment variable before starting the server:

```sh
PORT=8080 npm run dev
```

---

## Data model

### User

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Auto-incremented unique identifier. |
| `name` | `string` | Full name of the user. |
| `email` | `string` | Email address of the user. |
| `createdAt` | `string` | ISO 8601 timestamp of when the record was created. |

**Example**

```json
{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "createdAt": "2024-01-15T09:00:00.000Z"
}
```

---

## Error responses

All error responses share the same shape:

```json
{ "error": "<human-readable message>" }
```

| HTTP status | Meaning |
|-------------|---------|
| `400 Bad Request` | A request parameter or body field failed validation. |
| `404 Not Found` | No user exists for the given ID. |

---

## Endpoints

### List users

Returns all users stored in memory.

```
GET /users
```

#### Request

No parameters or body required.

#### Response

`200 OK` — array of [User](#user) objects.

```json
[
  {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "createdAt": "2024-01-15T09:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Bob Smith",
    "email": "bob@example.com",
    "createdAt": "2024-02-20T14:30:00.000Z"
  }
]
```

#### curl example

```sh
curl -s http://localhost:3000/users | jq
```

---

### Get user

Returns a single user by numeric ID.

```
GET /users/:id
```

#### Path parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | positive integer | The unique ID of the user. |

#### Response

`200 OK` — the matching [User](#user) object.

```json
{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "createdAt": "2024-01-15T09:00:00.000Z"
}
```

`400 Bad Request` — `id` is not a positive integer.

`404 Not Found` — no user with that ID exists.

#### curl example

```sh
# Fetch user with id 1
curl -s http://localhost:3000/users/1 | jq

# Non-existent user
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/users/999
```

---

### Create user

Creates a new user and persists it in memory.

```
POST /users
```

#### Request body

`Content-Type: application/json`

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | `string` | Yes | 2–100 characters |
| `email` | `string` | Yes | Valid email format |

```json
{
  "name": "Carol White",
  "email": "carol@example.com"
}
```

#### Response

`201 Created` — the newly created [User](#user) object.

```json
{
  "id": 3,
  "name": "Carol White",
  "email": "carol@example.com",
  "createdAt": "2026-04-24T11:00:00.000Z"
}
```

`400 Bad Request` — validation failed for `name` or `email`.

#### curl example

```sh
curl -s -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Carol White","email":"carol@example.com"}' | jq
```

---

### Update user

Partially updates the `name` and/or `email` of an existing user.
At least one field must be provided.

```
PUT /users/:id
```

#### Path parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | positive integer | The unique ID of the user to update. |

#### Request body

`Content-Type: application/json`

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | `string` | No | 2–100 characters |
| `email` | `string` | No | Valid email format |

```json
{
  "name": "Alicia Johnson"
}
```

#### Response

`200 OK` — the updated [User](#user) object.

```json
{
  "id": 1,
  "name": "Alicia Johnson",
  "email": "alice@example.com",
  "createdAt": "2024-01-15T09:00:00.000Z"
}
```

`400 Bad Request` — validation failed.

`404 Not Found` — no user with that ID exists.

#### curl example

```sh
curl -s -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Alicia Johnson"}' | jq
```

---

### Delete user

Permanently removes a user from the in-memory store.

```
DELETE /users/:id
```

#### Path parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | positive integer | The unique ID of the user to delete. |

#### Response

`204 No Content` — the user was deleted successfully. The response body is empty.

`400 Bad Request` — `id` is not a positive integer.

`404 Not Found` — no user with that ID exists.

#### curl example

```sh
# Delete user with id 2
curl -s -o /dev/null -w "%{http_code}" -X DELETE http://localhost:3000/users/2
# Prints: 204

# Attempt to delete a non-existent user
curl -s -X DELETE http://localhost:3000/users/999 | jq
```
