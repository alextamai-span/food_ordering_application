// Guest menu queries
// ------------------
export const listGuestMenuQuery = `
  SELECT name, price
  FROM menu_items
  WHERE available = true AND account_type = $1
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
  SET available = false
  WHERE id = $1
  RETURNING *
;`;

export const addMenuItemQueryEmp = `
  INSERT INTO menu_items (item_name, price, quantity, available, account_type)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
;`;

export const ListMenuQueryEmp = `
  SELECT * FROM menu_items
  WHERE account_type = $1
;`;