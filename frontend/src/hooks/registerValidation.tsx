
// Validation function
export const useRegisterValidation = (
  data: any,
  setErrors: (errors: any) => void
  ) => {
  const validateRegisterForm = () => {
    const newErrors: any = {};
    let hasError = false;

    // Company Name validation
    const nameRegex = /^[A-Za-z\s'-]+$/;
    if (!data.name.trim()) {
        newErrors.name = "Name is required.";
        hasError = true;
    }
    else if (data.name.length < 2 || data.name.length > 50) {
        newErrors.name = "Name must be 2-50 characters long.";
        hasError = true;
    }
    else if (!nameRegex.test(data.name)) {
        newErrors.name = "Name can only contain letters, spaces, hyphens, and apostrophes.";
        hasError = true;
    }
    else {
        newErrors.name = "";
    }


    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
        newErrors.email = 'Email is required.';
        hasError = true;
    }
    else if (!emailRegex.test(data.email)) {
        newErrors.email = 'Email is not valid.';
        hasError = true;
    }
    else {
        newErrors.email = '';
    }


    // Password validation
    if (!data.password) {
        newErrors.password = 'Password is required.';
        hasError = true;
    }
    else if (data.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long.';
        hasError = true;
    }
    else {
        newErrors.password = '';
    }


    // Account Type validation
    if (!data.account_type) {
        newErrors.account_type = 'Account Type is required.';
        hasError = true;
    }
    else if (data.account_type !== 'guest' && data.account_type !== 'employee') {
        newErrors.account_type = 'Account Type must be either "guest" or "employee".';
        hasError = true;
    }
    else {
        newErrors.account_type = '';
    }

    setErrors(newErrors);
    return hasError;
  };

  return { validateRegisterForm };
};

