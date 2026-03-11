# Food Ordering Applicaiton

That has
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

In this project, the jwt authentication token uses the user's id and email. Whenever the user tries to do anything the token will validate before each HTTP request.

After a user creates an account or logs in, the password that is entered uses bcrypt to encrypt the password that will be saved in the database or used to validate a log in. When logging in the password is bcrypted to verify if the entered password matches the password saved in the database. 

# Food & Order APIs

For both account types, when a user successfully logs in the menu is automatically displayed. An employee will be able to add, edit, and delete any item on the menu. A guest will only be able to see the available items and be able to add them to their cart. 

The cart tracks the items the user has added to their cart. The user can then change the amount(quantity) of the items in their cart. They also have the ability to remove and item or clear their cart. The last thing the cart can do is checkout, where orders uses the unique order number and total price to add what was in the cart to the orders tables. 