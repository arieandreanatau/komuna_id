# KomunaID Security Documentation

This directory contains security policies, guidelines, and operational procedures for the KomunaID platform.

## Contents

| Document | Description |
|----------|-------------|
| [security.md](security.md) | Comprehensive security guidelines covering authentication, RBAC, data protection, API security, and audit logging |

## Quick Reference

### Reporting Security Issues
Report vulnerabilities privately via email to the security team. Do not open public issues for security concerns.

### Key Policies
- **Authentication**: JWT-based with MFA support; Argon2id password hashing.
- **Access Control**: Role-based with `resource:action` permission model.
- **Data Protection**: AES-256-GCM encryption at rest, TLS 1.2+ in transit.
- **API Security**: Rate limiting, input validation, signed inter-service requests.
- **Audit**: All security-relevant events are logged with tamper-evident signatures.

### Compliance
KomunaID is designed to support compliance with GDPR, local data protection regulations, and industry-standard security frameworks (OWASP Top 10, NIST).
