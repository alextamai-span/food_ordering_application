// Guest order queries
// -------------------
export const addOrderQueryGuest = `
  INSERT INTO orders (guest_id, total_price, order_status)
  VALUES ($1, $2, $3)
  RETURNING *;
`;

export const orderListQueryGuest = `
  SELECT id, total_price, order_status
  FROM orders
  WHERE customer_id = $1;
`;

// Employee order queries
// ----------------------
export const updateOrderQueryEmp = `
  UPDATE orders
  SET guest_id = $1, status = $2, total_price = $3, completed_at = $4
  WHERE id = $5
  RETURNING *;
`;

export const deleteOrderQueryEmp = `
  UPDATE orders
  SET order_status = 'cancelled'
  WHERE id = $1
  RETURNING *;
`;

export const orderListQueryEmp = `
  SELECT * FROM orders;
`;