# Food Ordering Applicaiton

This is a full stack food ordering project that uses React, NodeJS, PostgreSQL, and Fastify. It includes:
1. Both a frontend and backend.
2. JWT authentication.
3. Redux for state management.
4. Proper validation (frontend + backend).
5. PostgreSQL transactions where required.

# Database Design 

There are 4 tables
1. users - tracks the account that have been created
2. menu_items - tracks the items
3. orders - tracks orders that have been made
4. cart_items - tracks what items the user has entered into their cart

# Authentication & JWT

The first step for a new user is to create an account which is one method to getting a JWT authentication token. The other method is for an existing your to log in to their account. When creating a new account, the password is encrypted using bcrypt before it gets stored in the database. As well, the JWT authentication token is automatically generated. When logging in, the entered password is compared with the stored hashed password using bcrypt to verify that it matches. If the credentials are valid, a JWT authentication token is generated and returned to the user. 

The JWT authentication token is then sent to the frontend service and stored in the Redux store. As long as the token is valid and has not expired, it is included with HTTP requests to the backend. Before processing each request, the backend validates the JWT token to ensure the user is authenticated and authorized to access the requested resources.

# Food & Order APIs

For both account types, once a user successfully logs in, the menu is automatically displayed.

Employees have full management access to the menu. They are able to add, edit, and delete menu items. This allows them to maintain and update the list of available food items.

Guests have view-only access to the menu. They can browse the available items and add them to their cart, but they cannot modify the menu itself.

The cart tracks all items that the user has added. Users can update the quantity of items in their cart, remove individual items, or clear the entire cart.

When the user is ready to complete their purchase, they can checkout. During checkout, a unique order number is generated and the total price is calculated. The items currently in the cart are then saved to the orders table in the database as a completed order.

# Frontend Validation

While creating a new account, the frontend validates that all required fields are filled in correctly. This includes checking that the email address follows a valid format, the password meets minimum security requirements, and that required fields are not left empty.

When a user logs in, the frontend verifies that both the email and password fields are provided before submitting the request to the authentication API.

Validation is also applied when employees manage menu items. Fields such as the item name, price, and quantity must contain valid values before the form can be submitted.

For the cart and checkout process, the frontend ensures that item quantities are valid (for example, not less than one) and that the cart contains items before allowing the user to proceed with checkout.