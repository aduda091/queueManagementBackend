# dustIn Time Queue Management API

Queue management application

### Version
1.0.0

## Usage

```bash
npm install
```

```bash
npm start
```

## Endpoints
### /users
```bash
POST /users/register
```

```bash
POST /users/login   // Returns a token
```

```bash
GET /users/me         // Returns user info and reservations, needs token
```

```bash
PUT /users/me         // Edit logged in user, needs token
```

### /facilities
```bash
GET /facilities         // Returns facilities array
```

```bash
POST /facilities         // Creates a facility, needs admin token 
```

```bash
GET /facilities/:id         // Returns a facility by ID
```

```bash
PUT /facilities/:id         // Edits a facility by ID, needs admin token
```

```bash
POST /facilities/:id         // Adds a queue to facility by ID, needs token
```

### /queues
```bash
GET /queues/:id         // Returns a single queue by ID
```

```bash
PUT /queues/:id         // Edits a single queue by ID, needs admin token
```

```bash
DELETE /queues/:id/reset         // Resets a queue by ID (current:0, next:1, delete belonging reservations), needs admin token
```

```bash
DELETE /queues/:id/next         // Advances a queue by ID, returns next reservation (or first if current==0), needs admin token
```

### /reservations
```bash
GET /reservations/:id         // Returns a single reservation by ID
```

```bash
POST /reservations/queues/:id         // Enter a queue by ID, needs token
```

```bash
GET /reservations/queue/:id         // Returns all reservations in a queue by ID
```

```bash
DELETE /reservations/:id         // Exit a queue (remove reservation) by ID, needs token
```

### /tests
```bash
POST /tests/addRandomUser         // Register a new random user, needs admin token
```

## JSON Format (Schema)
### User
{firstName, lastName, mail, password, role(defaults to 'user')}
### Facility
{name, address, mail, telephone}
### Queue
{name, facility, current, next}
### Reservation
{user, queue, time, number}