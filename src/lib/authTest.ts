/**
 * Auth configuration test utility
 * This file verifies that the JWT environment variables are properly set
 */

export function verifyAuthConfiguration() {
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    console.error("❌ JWT_SECRET environment variable is not set");
    console.error("Please ensure your .env.local file includes a JWT_SECRET value");
    return false;
  }
  
  if (jwtSecret === "roomzoom_dev_secret_key_replace_in_production" && process.env.NODE_ENV === 'production') {
    console.warn("⚠️ You are using the default JWT_SECRET in production");
    console.warn("This is insecure. Please generate a strong random secret for production use.");
  }
  
  // Check that JWT_EXPIRES_IN is set (optional)
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d'; // Default to 7 days
  console.log(`ℹ️ JWT tokens will expire after: ${jwtExpiresIn}`);
  
  return true;
}

/**
 * Test token generation with environment variables
 */
export function testTokenGeneration() {
  try {
    const jwt = require('jsonwebtoken');
    const testPayload = { userId: 'test', email: 'test@example.com', role: 'STUDENT' };
    const token = jwt.sign(testPayload, process.env.JWT_SECRET || 'fallback_secret', { 
      expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
    });
    
    // Verify the token can be decoded
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    if (decoded && decoded.userId === testPayload.userId) {
      console.log('✅ JWT token generation and verification successful');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ JWT token generation test failed:', error);
    return false;
  }
} 