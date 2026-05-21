/**
 * Utility functions for validating staff data
 */

/**
 * Validate name fields (allows alphabets, hyphens, apostrophes, and dots)
 */
export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }
  
  // Allow only alphabets, spaces, hyphens, apostrophes, and dots
  const nameRegex = /^[A-Za-z\s\-'.]+$/;
  
  if (!nameRegex.test(name)) {
    return { 
      isValid: false, 
      error: 'Name can only contain alphabets, hyphens (-), apostrophes (\'), and dots (.)' 
    };
  }
  
  return { isValid: true };
};

/**
 * Validate mobile number (10 digits)
 */
export const validateMobileNumber = (mobile: string): { isValid: boolean; error?: string } => {
  // Remove formatting characters
  const digits = mobile.replace(/\D/g, '');
  
  if (digits.length === 0) {
    return { isValid: false, error: 'Mobile number is required' };
  }
  
  if (digits.length !== 10) {
    return { isValid: false, error: 'Mobile number must be exactly 10 digits' };
  }
  
  // Check if starts with valid digit (6-9 in India)
  if (!/^[6-9]/.test(digits)) {
    return { isValid: false, error: 'Mobile number must start with 6, 7, 8, or 9' };
  }
  
  return { isValid: true };
};

/**
 * Validate email address
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

/**
 * Validate Aadhar number (12 digits)
 */
export const validateAadharNumber = (aadhar: string): { isValid: boolean; error?: string } => {
  // Remove formatting characters
  const digits = aadhar.replace(/\D/g, '');
  
  if (digits.length === 0) {
    return { isValid: true }; // Optional field
  }
  
  if (digits.length !== 12) {
    return { isValid: false, error: 'Aadhar number must be exactly 12 digits' };
  }
  
  return { isValid: true };
};

/**
 * Validate PAN number (ABCDE1234F format)
 */
export const validatePANNumber = (pan: string): { isValid: boolean; error?: string } => {
  if (!pan || pan.trim().length === 0) {
    return { isValid: true }; // Optional field
  }
  
  // PAN format: 5 uppercase letters + 4 digits + 1 uppercase letter
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  
  if (!panRegex.test(pan.toUpperCase())) {
    return { 
      isValid: false, 
      error: 'PAN must be in format: 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F)' 
    };
  }
  
  return { isValid: true };
};

/**
 * Validate date (no future dates allowed)
 */
export const validateDate = (dateString: string, fieldName: string = 'Date'): { isValid: boolean; error?: string } => {
  if (!dateString || dateString.trim().length === 0) {
    return { isValid: true }; // Optional field
  }
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return { isValid: false, error: `${fieldName} is not a valid date` };
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (date > today) {
    return { isValid: false, error: `${fieldName} cannot be in the future` };
  }
  
  return { isValid: true };
};

/**
 * Validate date of birth (must be at least 18 years old for staff)
 */
export const validateDateOfBirth = (dobString: string): { isValid: boolean; error?: string } => {
  if (!dobString || dobString.trim().length === 0) {
    return { isValid: true }; // Optional field
  }
  
  const dob = new Date(dobString);
  
  if (isNaN(dob.getTime())) {
    return { isValid: false, error: 'Date of birth is not a valid date' };
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (dob > today) {
    return { isValid: false, error: 'Date of birth cannot be in the future' };
  }
  
  // Calculate age
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  if (age < 18) {
    return { isValid: false, error: 'Staff member must be at least 18 years old' };
  }
  
  if (age > 100) {
    return { isValid: false, error: 'Please verify the date of birth' };
  }
  
  return { isValid: true };
};

/**
 * Validate file upload
 */
export const validateFile = (
  file: File | null,
  options: {
    maxSize?: number; // in MB
    allowedTypes?: string[];
    required?: boolean;
  } = {}
): { isValid: boolean; error?: string } => {
  const { maxSize = 2, allowedTypes = [], required = false } = options;
  
  if (!file) {
    if (required) {
      return { isValid: false, error: 'File is required' };
    }
    return { isValid: true };
  }
  
  // Check file size
  const maxSizeBytes = maxSize * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { isValid: false, error: `File size must not exceed ${maxSize}MB` };
  }
  
  // Check file type
  if (allowedTypes.length > 0) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const fileType = file.type.toLowerCase();
    
    const isTypeAllowed = allowedTypes.some(type => {
      const normalizedType = type.toLowerCase().replace('.', '');
      return fileExtension === normalizedType || fileType.includes(normalizedType);
    });
    
    if (!isTypeAllowed) {
      return { 
        isValid: false, 
        error: `File type must be ${allowedTypes.join(', ')}` 
      };
    }
  }
  
  return { isValid: true };
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string; strength?: string } => {
  if (!password || password.length === 0) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return { 
      isValid: false, 
      error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    };
  }
  
  // Calculate strength
  let strength = 'Weak';
  const criteriaCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
  
  if (password.length >= 12 && criteriaCount === 4) {
    strength = 'Strong';
  } else if (password.length >= 8 && criteriaCount >= 3) {
    strength = 'Medium';
  }
  
  return { isValid: true, strength };
};

/**
 * Validate username (alphanumeric and underscores only)
 */
export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  if (!username || username.trim().length === 0) {
    return { isValid: false, error: 'Username is required' };
  }
  
  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters long' };
  }
  
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  
  if (!usernameRegex.test(username)) {
    return { 
      isValid: false, 
      error: 'Username can only contain letters, numbers, and underscores' 
    };
  }
  
  return { isValid: true };
};

/**
 * Validate emergency contact format (Number, Name, Relation)
 */
export const validateEmergencyContact = (contact: string): { isValid: boolean; error?: string } => {
  if (!contact || contact.trim().length === 0) {
    return { isValid: true }; // Optional field
  }
  
  const parts = contact.split(',').map(p => p.trim());
  
  if (parts.length !== 3) {
    return { 
      isValid: false, 
      error: 'Emergency contact must be in format: Number, Name, Relation' 
    };
  }
  
  const [number, name, relation] = parts;
  
  if (!number || number.length === 0) {
    return { isValid: false, error: 'Emergency contact number is required' };
  }
  
  // Validate the mobile number
  const mobileValidation = validateMobileNumber(number);
  if (!mobileValidation.isValid) {
    return { isValid: false, error: `Emergency contact: ${mobileValidation.error}` };
  }
  
  if (!name || name.length === 0) {
    return { isValid: false, error: 'Emergency contact name is required' };
  }
  
  if (!relation || relation.length === 0) {
    return { isValid: false, error: 'Emergency contact relation is required' };
  }
  
  return { isValid: true };
};

/**
 * Validate bank details format
 */
export const validateBankDetails = (details: string): { isValid: boolean; error?: string } => {
  if (!details || details.trim().length === 0) {
    return { isValid: true }; // Optional field
  }
  
  const parts = details.split(',').map(p => p.trim());
  
  if (parts.length !== 4) {
    return { 
      isValid: false, 
      error: 'Bank details must be in format: Bank Name, IFSC, Account Holder Name, Account Number' 
    };
  }
  
  const [bankName, ifsc, accountHolderName, accountNumber] = parts;
  
  if (!bankName || bankName.length === 0) {
    return { isValid: false, error: 'Bank name is required' };
  }
  
  if (!ifsc || ifsc.length === 0) {
    return { isValid: false, error: 'IFSC code is required' };
  }
  
  // Validate IFSC format (4 letters + 7 characters)
  const ifscRegex = /^[A-Z]{4}[0][A-Z0-9]{6}$/;
  if (!ifscRegex.test(ifsc.toUpperCase())) {
    return { isValid: false, error: 'Invalid IFSC code format' };
  }
  
  if (!accountHolderName || accountHolderName.length === 0) {
    return { isValid: false, error: 'Account holder name is required' };
  }
  
  if (!accountNumber || accountNumber.length === 0) {
    return { isValid: false, error: 'Account number is required' };
  }
  
  return { isValid: true };
};
