// Guest menu queries
// ------------------
export const listGuestMenuQuery = `
  SELECT id, item_name, price
  FROM menu_items
  WHERE is_deleted = false AND quantity > 0
  ORDER BY id
;`;

// Employee menu queries
// ---------------------
export const updateMenuItemQueryEmp = `
  UPDATE menu_items
  SET item_name = $1, price = $2, quantity = $3, available = $4
  WHERE id = $5
  RETURNING *
;`;

export const deleteMenuItemQueryEmp = `
  UPDATE menu_items
  SET available = false, is_deleted = true
  WHERE id = $1
  RETURNING *
;`;

export const addMenuItemQueryEmp = `
  INSERT INTO menu_items (item_name, price, quantity, available)
    VALUES ($1, $2, $3, $4)
    RETURNING *
;`;

export const ListMenuQueryEmp = `
  SELECT * FROM menu_items
  ORDER BY id
;`;