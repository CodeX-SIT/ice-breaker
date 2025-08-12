# Localhost HTTP Provision - TODO

## Task: Add provision for localhost-based testing without HTTPS

- [x] Modify nginx.conf to add separate server block for localhost
- [x] Configure localhost server to listen on port 80 without HTTPS redirect
- [x] Set appropriate proxy headers for HTTP (X-Forwarded-Proto: http)
- [x] Include all necessary location blocks for localhost server
- [x] Ensure rate limiting and security measures are applied to localhost
- [x] Maintain existing HTTPS redirect for production domains (codexsit.club)
- [ ] Test localhost access without HTTPS redirection
- [ ] Verify production domains still redirect to HTTPS correctly
- [ ] Update documentation if needed

## Changes Made

1. Added a new server block specifically for `localhost` and `127.0.0.1`
2. Configured HTTP-only access without HTTPS redirection for local development
3. Applied same proxy configuration, rate limiting, and routing as HTTPS server
4. Set `X-Forwarded-Proto` to `http` for localhost requests
5. Maintained existing HTTPS redirect behavior for production domains

## Testing

To test the changes:

1. Start the Docker containers: `docker compose up --build`
2. Access the application via `http://localhost` (should work without HTTPS redirect)
3. Verify production domains still redirect to HTTPS when accessed
