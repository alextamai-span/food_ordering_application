export const newAccount = `
  INSERT INTO users (name, email, password, account_type)
  VALUES ($1, $2, $3, $4)
  RETURNING id, name, email, password, account_type, created_at;`;