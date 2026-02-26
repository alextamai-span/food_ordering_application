export const guestsTableQuery = `
  CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

export const ordersTableQuery = `
  CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    guest_id INTEGER REFERENCES guests(id) ON DELETE CASCADE,
    total_price DECIMAL(10, 2) NOT NULL,
    order_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
  );
`;

export const orderItemsTableQuery = `
  CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    food_item_id INTEGER REFERENCES food_items(id) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_order DECIMAL(10, 2) NOT NULL
  );
`;

export const foodItemsTableQuery = `
  CREATE TABLE IF NOT EXISTS food_items (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    available BOOLEAN DEFAULT TRUE
  );
`;