
# Loxur Admin API

Professional admin panel backend API for the Loxur hotel booking platform.

## Features

- **Dashboard Analytics**: Real-time stats and insights
- **User Management**: Complete CRUD operations for users
- **Booking Management**: View and manage all bookings
- **Hotel Management**: Manage hotel properties and rooms
- **Newsletter Management**: Handle newsletter subscribers
- **Authentication**: Secure login/logout functionality

## Quick Start

1. **Install Dependencies**
   ```bash
   cd backend-api
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file with:
   ```
   MONGODB_URI=mongodb+srv://user:<password>@cluster0.ln4g5.mongodb.net/loxur?retryWrites=true&w=majority&appName=Cluster0
   PORT=6000
   NODE_ENV=development
   ```

3. **Start Server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Admin Routes (`/api/admin`)
- `GET /dashboard/stats` - Dashboard statistics
- `GET /users` - Get all users (with pagination & search)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /bookings` - Get all bookings
- `GET /bookings/:id` - Get booking details
- `PUT /bookings/:id/status` - Update booking status
- `GET /hotels` - Get all hotels
- `GET /hotels/:id` - Get hotel details
- `PUT /hotels/:id` - Update hotel
- `DELETE /hotels/:id` - Delete hotel
- `GET /newsletter` - Get newsletter subscribers
- `DELETE /newsletter/:id` - Remove subscriber

### Public Routes (`/api`)
- `GET /hotels` - Public hotel listings
- `GET /hotels/:id` - Hotel details with rooms
- `POST /bookings` - Create new booking
- `POST /newsletter/subscribe` - Subscribe to newsletter

### Auth Routes (`/api/auth`)
- `POST /login` - Admin login
- `POST /register` - Register new user

## Database Models

- **User**: User accounts and profiles
- **Hotel**: Hotel properties
- **Room**: Hotel rooms and availability
- **Booking**: Reservation records
- **Newsletter**: Email subscriptions
- **Auth**: Authentication records

## Server Configuration

- **Port**: 6000 (configurable via PORT env var)
- **CORS**: Configured for localhost:5173 and localhost:3000
- **Database**: MongoDB Atlas
- **Authentication**: bcrypt password hashing

## Health Check

```bash
curl http://localhost:6000/health
```

## Production Deployment

1. Set environment variables
2. Ensure MongoDB connection string has correct password
3. Run `npm start`
4. Configure reverse proxy (nginx) if needed

## Security Features

- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Error handling middleware
- Environment variable protection
