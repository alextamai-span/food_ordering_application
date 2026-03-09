export const softDeleteAccountQuery = `
  UPDATE users
  SET is_deleted = TRUE
  WHERE id = $1 AND is_deleted = FALSE
  RETURNING *;
`;

export const updateAccountQuery = `
  UPDATE users
  SET name = $1, email = $2, account_type = $3
  WHERE id = $4 AND is_deleted = FALSE
  RETURNING *;
`;