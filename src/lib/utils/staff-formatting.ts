/**
 * Utility functions for formatting staff data
 */

/**
 * Format mobile number with hyphens (079-032-4653)
 */
export const formatMobileNumber = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
};

/**
 * Format date input with slashes (01/01/2001)
 * Used for manual typing in text inputs
 */
export const formatDateInput = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Apply formatting for date (DD/MM/YYYY)
  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  } else if (digits.length <= 8) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  }
  
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
};

/**
 * Format Aadhar number with hyphens (1234-7896-1280)
 */
export const formatAadharNumber = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Apply formatting for 12-digit Aadhar
  if (digits.length <= 4) {
    return digits;
  } else if (digits.length <= 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  } else if (digits.length <= 12) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}`;
  }
  
  return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}`;
};

/**
 * Format PAN number (uppercase, ABCDE1234F)
 */
export const formatPANNumber = (value: string): string => {
  // Convert to uppercase and remove spaces/special chars
  const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  // PAN format: 5 letters + 4 digits + 1 letter
  if (cleaned.length <= 10) {
    return cleaned;
  }
  
  return cleaned.slice(0, 10);
};

/**
 * Image compression utility ("auto shrink" like WhatsApp)
 * Reduces image dimensions and quality to fit under 2MB
 */
export const compressImage = async (file: File, maxSizeMB: number = 2): Promise<Blob> => {
  if (file.size <= maxSizeMB * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimensions (keeping aspect ratio)
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress with reduced quality until under limit
        let quality = 0.8;
        const attemptCompression = () => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.2) {
                  resolve(blob);
                } else {
                  quality -= 0.1;
                  attemptCompression();
                }
              } else {
                reject(new Error('Compression failed'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        attemptCompression();
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dobString?: string): number | null => {
  if (!dobString) return null;
  
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return null;
  
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Format employee ID (5 digits with leading zeros)
 */
export const formatEmployeeId = (id: number): string => {
  return id.toString().padStart(5, '0');
};

/**
 * Generate next employee ID
 */
export const generateNextEmployeeId = (lastId?: string): string => {
  if (!lastId) return '12001';
  const nextNumber = parseInt(lastId) + 1;
  return formatEmployeeId(nextNumber);
};

/**
 * Parse emergency contact string into object
 */
export const parseEmergencyContact = (contactString: string) => {
  const parts = contactString.split(',').map(p => p.trim());
  return {
    number: parts[0] || '',
    name: parts[1] || '',
    relation: parts[2] || ''
  };
};

/**
 * Format emergency contact object to string
 */
export const formatEmergencyContact = (contact: { number: string; name: string; relation: string }): string => {
  return `${contact.number}, ${contact.name}, ${contact.relation}`;
};

/**
 * Parse bank details string into object
 */
export const parseBankDetails = (detailsString: string) => {
  const parts = detailsString.split(',').map(p => p.trim());
  return {
    bankName: parts[0] || '',
    ifsc: parts[1] || '',
    accountHolderName: parts[2] || '',
    accountNumber: parts[3] || ''
  };
};

/**
 * Format bank details object to string
 */
export const formatBankDetails = (details: { bankName: string; ifsc: string; accountHolderName: string; accountNumber: string }): string => {
  return `${details.bankName}, ${details.ifsc}, ${details.accountHolderName}, ${details.accountNumber}`;
};

/**
 * Format file size to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format date to display format
 */
export const formatDateDisplay = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return 'N/A';
  }
};

/**
 * Convert date from DD/MM/YYYY to YYYY-MM-DD (for input[type="date"])
 */
export const convertToInputDate = (displayDate: string): string => {
  const parts = displayDate.split('/');
  if (parts.length !== 3) return '';
  
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

/**
 * Convert date from YYYY-MM-DD to DD/MM/YYYY (for display)
 */
export const convertFromInputDate = (inputDate: string): string => {
  if (!inputDate) return '';
  const parts = inputDate.split('-');
  if (parts.length !== 3) return '';
  
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};
