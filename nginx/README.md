# Nginx HTTPS Configuration

This directory contains the nginx configuration and Docker setup for serving the Ice Breaker application over HTTPS only.

## Files

- `nginx.conf` - Main nginx configuration with HTTPS redirection and SSL settings
- `Dockerfile` - Custom Docker image with SSL certificates and configuration
- `cert.pem` - SSL certificate
- `chain.pem` - Certificate chain
- `fullchain.pem` - Full certificate chain
- `privkey.pem` - Private key
- `dhparam.pem` - Diffie-Hellman parameters for enhanced security

## Features

- **HTTPS Only**: All HTTP traffic is redirected to HTTPS
- **SSL/TLS Security**:
  - TLS 1.2 and 1.3 support
  - Modern cipher suites
  - Perfect Forward Secrecy with DH parameters
  - OCSP stapling
  - HSTS headers
- **Security Headers**: XSS protection, content type sniffing prevention, frame options
- **Performance**: Gzip compression, static file caching, HTTP/2 support
- **Rate Limiting**: Protects against abuse

## Building and Running

### Build the nginx image:

```bash
make build-nginx
```

### Push to registry:

```bash
make push-nginx
```

### Run with docker-compose:

```bash
docker-compose up -d
```

## Domain Configuration

The configuration is set up for `codexsit.club` and `www.codexsit.club`. Make sure your DNS points to the server running this container.

## SSL Certificate Renewal

When SSL certificates need renewal, replace the certificate files in this directory and rebuild the image:

1. Replace `cert.pem`, `chain.pem`, `fullchain.pem`, and `privkey.pem`
2. Run `make build-nginx`
3. Run `make push-nginx`
4. Restart the services with `docker-compose restart nginx`
