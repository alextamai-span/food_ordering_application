import bcrypt from 'bcrypt';

// hashes password
export const hashPassword = async (password: string): Promise<string> => {
  // salt rounds determines the computational cost of hashing
  // to low ~ 5 - fast to hash and brute force for attackers
  // to high ~ 15 - very slow to hash and can cause performance issues
  // default ~ 10 - good balance for security and performance
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// comparing text and hashed password
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};