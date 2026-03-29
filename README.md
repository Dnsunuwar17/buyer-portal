# Buyer Portal Junior Full-Stack Assessment

A full-stack real-estate buyer portal where buyers can register, log in,
browse available properties, and manage their personal favourites list

## Tech Stack
- **Backend**: Node.js + Express
- **Database**: SQLite (via better-sqlite3)
- **Auth**: JWT Auth(jsonwebtoken) + bcrypt password hashing
- **Frontend**: Basic HTML, CSS, JavaScript

## Key Features and Funtion
- Authentication:
   - Buyer Registration (Name, email, password)
   - JWT implementation for Secure Login
   - Bcrypt for password hashing (Preventing raw passwords)
   - Routes Protected by Token Security

- Dashboard
   - Shows user name and role
   - Displays all available properties
   - Allows users to Add/Remove a property to/from favourites
   - Lists "My Favourite" properties stored against that user

- Favourites 
   - Allows adding and removing property
   - Prevents duplicate favourites
   - Users access only their own data

- Validation and Security
   - Input Validation and Sanitization using express-validator
   - Protected API Routes with middleware
   - JWT secret stored in '.env' not hardcoded
   - Foreign Key constraints enforced in database
   - Duplicate favourites prevented by UNIQUE constraint at database level

- Database Schema
   - Uses SQLite with three main tables (Users, Properties, Favourites)
   - Enabled Foreign Key for relational integrity
   - Unique fields like (user_id, property_id) prevents duplicate favourites

## How to Run

1. Install dependencies:
   npm install

2. Create .env file:
   JWT_SECRET="put_secret_here"

3. Start the server:
   npm start

4. Open your browser and go to:
   http://localhost:3000/login.html

## Example Flow

1. **Buyer-Registration** — click "Register", enter your name, email and a password.
2. **Buyer-Login** — Once you register you are redirected to the dashboard automatically or you can login if already have an account.
3. **Dashboard** — Shows all available properties with option to favourite(like) any property.
4. **Favourite** — click "Add to favourites" on any property and it will be shown below in "My favourites" list.
5. **Remove** — click "Remove from favourites" to unlist it
6. **Logout** — click "Log out" in the top bar to return back to login portal.

## API Endpoints (Postman Collection Avaliable)

### Auth (public)

| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| POST   | /api/auth/register    | Register a new user |
| POST   | /api/auth/login       | Log in, receive JWT |

### Favourites (JWT required)

| Method | Endpoint                      | Description                          |
|--------|-------------------------------|--------------------------------------|
| GET    | /api/favourites/properties    | All properties with favourite status |
| GET    | /api/favourites               | Current user's favourites only       |
| POST   | /api/favourites/:propertyId   | Add a property to favourites         |
| DELETE | /api/favourites/:propertyId   | Remove a property from favourites    |

All protected routes require an `Authorization: Bearer <token>` header.(Postman Collection Provided)

## Security Notes
- Passwords are hashed with bcrypt (never stored as plain text)
- All protected routes require a valid JWT token
- Users can only view and modify their own favourites

## Known Limitations

- No rate limiting on auth endpoints — a production app would use express-rate-limit
- JWT tokens are not blacklisted on logout — they remain valid until expiry
- SQLite is not suitable for multi-server deployments — PostgreSQL would be used in production
- No database migrations system — schema changes require manual intervention