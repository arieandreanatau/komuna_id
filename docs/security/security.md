# KomunaID Security Guidelines

## 1. Authentication

### Token-Based Authentication
- All API requests require a valid bearer token (JWT).
- Tokens expire after a configurable TTL (default: 60 minutes).
- Refresh tokens are issued alongside access tokens and expire after 7 days.

### Password Policy
- Minimum 12 characters, must include uppercase, lowercase, number, and special character.
- Passwords are hashed using Argon2id.
- Previous 5 passwords are disallowed on change.

### Multi-Factor Authentication (MFA)
- TOTP-based MFA is supported for all user accounts.
- Recovery codes are generated and stored encrypted at rest.
- Admin accounts enforce mandatory MFA.

### Session Management
- Sessions are invalidated on password change.
- Concurrent session limits are enforced per role.
- Idle sessions are locked after 15 minutes of inactivity.

---

## 2. Role-Based Access Control (RBAC)

### Role Hierarchy
```
super-admin
├── admin
│   ├── manager
│   │   ├── employee
│   │   └── viewer
│   └── auditor
└── support
```

### Permission Model
- Permissions follow the format `resource:action` (e.g., `user:create`, `report:export`).
- Roles are assigned zero or more permissions.
- Users inherit permissions from all assigned roles; the union grants access.

### Enforcement
- All controller methods declare required permissions via middleware.
- Frontend routes and UI elements are gated by permission checks.
- Denials return `403 Forbidden` with a structured error response.

---

## 3. Data Protection

### Encryption at Rest
- Sensitive fields (national ID, tax ID, banking info) are encrypted using AES-256-GCM.
- Encryption keys are managed externally (not stored in the repository or `.env`).

### Encryption in Transit
- All traffic is served over HTTPS (TLS 1.2+).
- HSTS headers are enforced with a minimum max-age of 31536000.

### Data Classification
| Level | Examples | Handling |
|-------|----------|----------|
| Public | Published articles, public profiles | No restrictions |
| Internal | Internal communications, non-sensitive logs | Access-control enforced |
| Confidential | PII, financial data, health records | Encrypted, audit-logged, need-to-know |
| Restricted | Credentials, encryption keys | Never stored in DB or code; external vault only |

### Data Retention
- Active user data is retained for the duration of the account.
- Audit logs are retained for 7 years per regulatory requirements.
- Soft-deleted records are purged after 90 days.

---

## 4. API Security

### Rate Limiting
- Authenticated requests: 60 requests per minute per token.
- Public endpoints: 30 requests per minute per IP.
- Auth endpoints (login, register, reset): 10 requests per minute per IP.

### Input Validation
- All inputs are validated server-side using strict schema validation.
- SQL injection is prevented via parameterized queries (Eloquent/Query Builder).
- XSS is mitigated by output encoding in the frontend framework.

### CORS Policy
- Origins are explicitly whitelisted; no wildcard `*` in production.
- Preflight responses include only the minimum required methods and headers.

### Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 0
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'
```

### Request Signing
- Inter-service communication requires HMAC-SHA256 signed requests.
- Signature includes timestamp, nonce, and request body hash to prevent replay attacks.

---

## 5. Audit Logging

### What is Logged
| Event | Details |
|-------|---------|
| Authentication | Login success/failure, MFA challenge, password reset |
| Authorization | Permission grants/denials, role changes |
| Data Access | Read/write of confidential and restricted data |
| Administrative | User create/update/delete, config changes, permission changes |
| System | Service start/stop, errors, security alerts |

### Log Format
```json
{
  "timestamp": "2026-06-30T06:00:00.000Z",
  "event": "user.login.success",
  "actor_id": 42,
  "actor_email": "user@example.com",
  "ip": "192.168.1.100",
  "user_agent": "Mozilla/5.0 ...",
  "resource": "auth",
  "action": "login",
  "result": "success",
  "metadata": {
    "mfa_used": true,
    "method": "totp"
  }
}
```

### Log Integrity
- Logs are append-only and stored in a dedicated database/table.
- Log entries include an HMAC signature computed over the serialized event payload.
- Log tampering attempts trigger an alert to the security team.

### Log Access
- Only users with the `audit:read` permission can query audit logs.
- Exported reports are watermarked with the exporter's user ID and timestamp.

---

## Incident Response

1. **Detection** — Automated monitoring triggers alert on anomaly.
2. **Triage** — On-call engineer assesses severity (P0–P3).
3. **Containment** — Affected systems isolated; compromised credentials revoked.
4. **Remediation** — Root cause fixed; patches deployed.
5. **Post-Mortem** — Blameless review within 5 business days; findings published internally.
