export const accountLogin = `
  SELECT * FROM users 
  WHERE email = $1 AND is_deleted = false
`;