
// Validation function
export const useLoginValidation = (
  data: any,
  setErrors: (errors: any) => void
  ) => {
  const validateLoginForm = () => {
    const newErrors: any = {};
    let hasError = false;

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

    setErrors(newErrors);
    return hasError;
  };

  return { validateLoginForm };
};

