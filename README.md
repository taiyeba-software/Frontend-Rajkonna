# Rajkonna E-commerce Application

A modern React-based e-commerce platform with user authentication, product management, and cart functionality.

## Features

- **User Authentication**: Login and registration with JWT tokens
- **Product Management**: Browse, view, and add products to cart
- **Shopping Cart**: Add items to cart, view cart contents, and checkout
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **API Integration**: Backend API for products, cart, and user management

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Fetch API
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Animations**: GSAP

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rajkonna
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar with cart link
│   ├── ProductCard.jsx # Product display card
│   └── modals/         # Modal components for auth
├── context/            # React Context for state management
│   ├── AuthContext.jsx # User authentication state
│   ├── ProductContext.jsx # Product and cart state
│   └── ModalContext.jsx # Modal state
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── ProductListing.jsx # Product list page
│   ├── ProductDetail.jsx # Individual product page
│   ├── CartPage.jsx    # Shopping cart page
│   └── NotFound.jsx    # 404 page
├── App.jsx             # Main app component with routing
└── main.jsx            # App entry point
```

## API Endpoints

- `GET /api/products` - Fetch all products
- `GET /api/products/:id` - Fetch single product
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/cart` - Fetch user's cart
- `POST /api/cart/items` - Add item to cart

## Usage

1. **Browse Products**: Visit the home page or products page to see available items
2. **View Details**: Click on any product to see detailed information
3. **Add to Cart**: Click "Add to Cart" on product pages (requires login)
4. **View Cart**: Click the cart icon in the navbar to view cart contents
5. **Checkout**: Use the checkout button in the cart (currently shows success toast)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
