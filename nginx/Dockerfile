FROM nginx:alpine

# Copy SSL certificates
COPY cert.pem /etc/nginx/ssl/cert.pem
COPY chain.pem /etc/nginx/ssl/chain.pem
COPY fullchain.pem /etc/nginx/ssl/fullchain.pem
COPY privkey.pem /etc/nginx/ssl/privkey.pem
COPY dhparam.pem /etc/nginx/ssl/dhparam.pem

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Set proper permissions for SSL files
RUN chmod 600 /etc/nginx/ssl/privkey.pem && \
  chmod 644 /etc/nginx/ssl/cert.pem && \
  chmod 644 /etc/nginx/ssl/chain.pem && \
  chmod 644 /etc/nginx/ssl/fullchain.pem && \
  chmod 644 /etc/nginx/ssl/dhparam.pem

# Create log directory
RUN mkdir -p /var/log/nginx

# Expose ports
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
