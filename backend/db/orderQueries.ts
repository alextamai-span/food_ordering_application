// Guest order queries
// -------------------
export const addOrderQueryGuest = `
  INSERT INTO orders (user_id, total_price, order_status, created_at)
  VALUES ($1, $2, $3, NOW())
  RETURNING *;
`;

export const orderListQueryGuest = `
  SELECT id, total_price, order_status
  FROM orders
  WHERE user_id = $1 AND order_status != 'deleted'
  ORDER BY id;
`;

// Employee order queries
// ----------------------
export const createOrderQueryEmp = `
  INSERT INTO orders (user_id, order_status, total_price, created_at)
  VALUES ($1, $2, $3, NOW())
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
  SELECT * FROM orders
  ORDER BY id;
`;
  