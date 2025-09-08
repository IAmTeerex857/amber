const fs = require('fs');

let content = fs.readFileSync('src/components/auth/AuthForm.tsx', 'utf8');

// Replace the handleUserTypeSelect function
const oldFunction = `  const handleUserTypeSelect = (selectedUserType: UserRole) => {
    setUserType(selectedUserType);
    setAuthStep('credentials');
  };`;

const newFunction = `  const handleUserTypeSelect = async (selectedUserType: UserRole) => {
    setUserType(selectedUserType);
    
    // Continue with authentication automatically after user type selection
    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setAuthStep('credentials');
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setAuthStep('credentials');
          return;
        }
        await signup(formData.email, formData.password, formData.name, selectedUserType);
      } else {
        await login(formData.email, formData.password, selectedUserType);
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAuthStep('credentials');
    }
  };`;

content = content.replace(oldFunction, newFunction);

fs.writeFileSync('src/components/auth/AuthForm.tsx', content);
console.log('✅ Fixed user type selection flow');
