export const accountLogin = `
  SELECT * FROM accounts 
  WHERE email = $1
`;