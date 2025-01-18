# **Setup Guide: Laravel Backend and React.js Frontend**

## **Prerequisites**

Ensure the following tools are installed on your system:

* PHP (>= 8.2) and Composer
* Node.js (>= 18.x) and `pnpm`/`npm`
* MySQL or any preferred database
* A web server like Apache/Nginx
* Git (optional, for version control)

---

## **1. Clone the Repository**

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/Alvalens/fullstack-jagoan-hosting.git
   ```
2. The repository should have the following structure:

   ```bash
   repository-folder/
   ├── backend/  # Laravel backend
   └── frontend/ # React frontend
   ```

---

## **2. Set Up the Laravel Backend**

1. Navigate to the `backend` folder:

   ```bash
   cd backend
   ```
2. Install PHP dependencies:

   ```bash
   composer install
   ```
3. If there compatibility issues try running:

   ```bash
   composer update
   ```

4. Create a `.env` file:

   ```bash
   cp .env.example .env
   ```

5. Configure the `.env` file:

   * Update the database credentials:

     ```bash
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=your_database_name
     DB_USERNAME=your_username
     DB_PASSWORD=your_password
     ```
   * Update sanctum stateful domain and cors allowed url

     ```bash
     SANCTUM_STATEFUL_DOMAINS=localhost
     CORS_ALLOWED_ORIGINS=http://localhost:5173
     ```
6. Generate the application key:

   ```bash
   php artisan key:generate
   ```
7. Run migrations and seeders (if applicable):

   ```bash
   php artisan migrate --seed
   ```
8. Run storage link:

   ```
   php artisan storage:link
   ```

9. Start the Laravel development server:

   Laravel backend will run on [http://127.0.0.1:8000]().

---

## **3. Set Up the React Frontend**

1. Navigate to the `frontend` folder:

   ```bash
   cd ../frontend
   ```
2. Install Node.js dependencies:

   ```bash
   pnpm install
   ```

   If you don't have pnpm you can install it with:

   ```bash
   npm install -g pnpm@latest-10
   ```
3. Update the API base URL in the React configuration file, often located in `src/utils/axios.js` or `.env`:

   ```javascript
   const axiosInstance = axios.create({
       baseURL: "http://127.0.0.1:8000/api",
   });
   ```
4. Start the React development server:

   ```bash
   pnpm run dev
   ```

   React will run on [http://localhost:5173]().

---

## **4. Handling CORS Issues**

If React cannot communicate with Laravel, ensure CORS is properly configured in Laravel:

1. Open `backend/config/cors.php` and confirm:

   ```php
   'paths' => ['api/*', 'sanctum/csrf-cookie'],
   'allowed_methods' => ['*'],
   'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:5173')),
   ```
2. Restart the Laravel server:

   ```bash
   php artisan config:clear
   php artisan serve
   ```

Alternatively, set up a proxy in the React app by editing `vite.config.js`:

---

## **5. Testing the Fullstack Application**

1. Start both servers:

   * Laravel backend:

     ```bash
     cd backend
     php artisan serve
     ```
   * React frontend:
   * ```bash
     cd ../frontend
     pnpm run dev
     ```
2. Access the React app at [http://localhost:5173](), and test API calls to ensure everything works.
3. Login with username `admin `and password `password`
