# Clarity: Authentication & Authorization Design

## 1. Auth Flow Strategy

### Signup & Login
1.  **User** sends credentials (email/password) to `/auth/login`.
2.  **Server** verifies hash (bcrypt/argon2).
3.  **Server** signs a **JWT** containing `{ userId, role }`.
4.  **Server** sends JWT back in an **HTTP-Only, Secure, SameSite Cookie**.
    *   *Why Cookie over LocalStorage?* LocalStorage is accessible by JavaScript. If an attacker injects a script (XSS), they can steal the token. HttpOnly cookies cannot be read by JS, blocking this vector.

### Protected Routes
1.  **Client** makes request to `/api/decisions`. Browser automatically attaches the Cookie.
2.  **Middleware** reads cookie, verifies signature.
3.  **Middleware** attaches `req.user` to the request object.
4.  **Route Handler** executes.

## 2. RBAC Matrix (Role-Based Access Control)

| Action | Member | Manager | Rationale |
| :--- | :---: | :---: | :--- |
| **View Intents/Decisions** | ✅ | ✅ | Transparency is key. Everyone sees strategy. |
| **Create Intent** | ❌ | ✅ | Only leadership defines "Why". |
| **Create Decision** | ❌ | ✅ | Only leadership/seniors define "How". |
| **Create Work Item** | ✅ | ✅ | Engineers define their execution steps. |
| **Execute Work (Move to Done)** | ✅ | ✅ | Everyone does work. |
| **Validate Outcome** | ❌ | ✅ | Managers/Stakeholders verify results. |
| **Delete Data** | ❌ | ✅ | Destructive actions are privileged. |

## 3. Security Considerations
-   **XSS (Cross-Site Scripting)**: Mitigated by **HttpOnly Cookies**.
-   **CSRF (Cross-Site Request Forgery)**: Since we use cookies, we need CSRF protection.
    *   *Strategy*: For this internal tool, we will use `SameSite=Strict` cookies. This prevents the browser from sending the cookie on cross-site requests, effectively killing CSRF for top-level navigations not initiated by the site itself.
-   **Password Storage**: Bcrypt with reasonable work factor (10+).

## 4. REST API Routes (`/auth`)
*   `POST /auth/signup`: Create account (Initial setup only, or Manager-only feature later).
*   `POST /auth/login`: Issue HttpOnly Cookie.
*   `POST /auth/logout`: Clear Cookie.
*   `GET /auth/me`: Return current user context (email, role) for frontend state.

## 5. Middleware Logic

### `authenticate` Middleware
```javascript
function authenticate(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({error: "Unauthorized"});
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id: "...", role: "..." }
    next();
  } catch (err) {
    return res.status(401).json({error: "Invalid Token"});
  }
}
```

### `authorize(role)` Middleware
```javascript
function authorize(requiredRole) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({error: "Unauthorized"});
    
    // Simple hierarchy: MANAGER > MEMBER
    if (requiredRole === 'MANAGER' && req.user.role !== 'MANAGER') {
      return res.status(403).json({error: "Forbidden: Managers only"});
    }
    next();
  };
}
```
