const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

/**
 * Unified JWT Auth Middleware
 * Accepts tokens from both Dialogue backend (userId) and Exchange backend (user_id)
 * This allows a single auth system across all services
 */
async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Support both Dialogue (userId) and Exchange (user_id) JWT formats
    const userId = payload.userId || payload.user_id;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }
    
    // Check if user account exists and is active
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      // User might exist in Dialogue DB but not in Exchange DB
      // Allow the request but mark as external user
      req.user = { 
        user_id: userId, 
        role: payload.role || 'user',
        isExternalUser: true 
      };
      return next();
    }
    
    if (user.account_status !== 'active') {
      return res.status(403).json({ 
        error: `Account is ${user.account_status}. Please contact support.` 
      });
    }
    
    // Normalize to user_id for internal consistency
    req.user = {
      user_id: userId,
      role: user.role || payload.role || 'user',
      isExternalUser: false
    };
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Helper for ownership checks
function requireSelf(req, res, next) {
  const { user_id } = req.user;
  const targetUserId = req.params.userId || req.body.user_id || req.body.seller_id;
  if (!targetUserId || targetUserId !== user_id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

module.exports = { requireAuth, requireSelf };
