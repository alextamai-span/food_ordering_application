export const listCartItemsQuery = `
  SELECT
    c.id, c.user_id, c.menu_item_id,
    m.item_name, m.price, c.quantity,
    (m.price * c.quantity) AS line_total
  FROM cart_items c
  JOIN menu_items m ON m.id = c.menu_item_id
  WHERE c.user_id = $1
  ORDER BY c.created_at DESC;
`;

export const addToCartQuery = `
    INSERT INTO cart_items (user_id, menu_item_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, menu_item_id)
    DO UPDATE SET
    quantity = cart_items.quantity + EXCLUDED.quantity,
    updated_at = NOW()
    RETURNING *;
`;

export const updateCartItemQuery = `
    UPDATE cart_items
    SET quantity = $3, updated_at = NOW()
    WHERE user_id = $1 AND menu_item_id = $2
    RETURNING *;
`;

export const removeCartItemQuery = `
    DELETE FROM cart_items
    WHERE user_id = $1 AND menu_item_id = $2
    RETURNING *;
`;

export const clearCartQuery = `
    DELETE FROM cart_items 
    WHERE user_id = $1
    RETURNING *;
`;

export const afterCheckoutMenuQuery = `
    UPDATE menu_items
    SET quantity = quantity - $2
    WHERE id = $1 AND quantity >= $2
    RETURNING *;
`;