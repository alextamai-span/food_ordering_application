export const accountLogin = `
  SELECT * FROM users 
  WHERE email = $1
`;