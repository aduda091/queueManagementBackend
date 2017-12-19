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
GET /users/me         // Needs json web token to authorize
```

```bash
GET /facilities         // Returns facilities array
```

```bash
POST /facilities         // Creates a facility
```

## JSON Format (Schema)
### User
{firstName, lastName, mail, password}
### Facility
{name, address, mail, telephone}
