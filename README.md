# Grade Recheck Microservice

## Setup
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file with the following content:
   ```
   JWT_SECRET=your_secret_key
   ```
4. Start the microservice with `npm start`.

## Endpoints
- `GET /api/recheck`: Retrieve all grade recheck requests (secured).
- `POST /api/recheck/apply`: Submit a new grade recheck request (secured).