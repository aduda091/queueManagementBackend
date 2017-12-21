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
```bash
POST /users/register
```

```bash
POST /users/login   // Gives back a token
```

```bash
GET /users/me         // Returns user profile, needs token
```

```bash
PUT /users/me         // Edit logged in user, needs token
```

```bash
GET /facilities         // Returns facilities array
```

```bash
POST /facilities         // Creates a facility, needs token 
```

```bash
GET /facilities/:id         // Returns a facility by ID
```

```bash
PUT /facilities/:id         // Edits a facility by ID, needs token
```

```bash
POST /facilities/:id         // Adds a queue to facility by ID, needs token
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