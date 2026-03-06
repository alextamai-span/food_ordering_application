// Guest order queries
// -------------------
export const addOrderQueryGuest = `
  INSERT INTO orders (user_id, total_price, order_status)
  VALUES ($1, $2, $3)
  RETURNING *;
`;

export const orderListQueryGuest = `
  SELECT id, total_price, order_status
  FROM orders
  WHERE user_id = $1;
`;

// Employee order queries
// ----------------------
export const createOrderQueryEmp = `
  INSERT INTO orders (user_id, order_status, total_price)
  VALUES ($1, $2, $3)
  RETURNING *;
`;

export const updateOrderQueryEmp = `
  UPDATE orders
  SET order_status = $2, completed_at = $3
  WHERE id = $1
  RETURNING *;
`;

export const deleteOrderQueryEmp = `
  UPDATE orders
  SET order_status = 'deleted', total_price = 0
  WHERE id = $1
  RETURNING *;
`;

export const orderListQueryEmp = `
  SELECT * FROM orders;
`;