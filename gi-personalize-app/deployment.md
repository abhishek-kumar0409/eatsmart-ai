Deployment Guide for GI Personalize
This guide provides step-by-step instructions for deploying the GI Personalize application to production.
Prerequisites

A Linux server (Ubuntu 20.04 LTS recommended)
Domain name configured with DNS pointing to your server
SSH access to your server
Git installed on your server
Docker and Docker Compose installed on your server

Deployment Steps
1. Server Preparation
bash# Update system packages
sudo apt update
sudo apt upgrade -y

# Install required packages
sudo apt install -y git curl nginx software-properties-common

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Log out and log back in for docker group to take effect
exit
# Log back in
2. Clone the Repository
bash# Create application directory
mkdir -p /opt/gi-personalize
cd /opt/gi-personalize

# Clone the repository (replace with your actual repository URL)
git clone https://github.com/yourusername/gi-personalize.git .
3. Configuration
Create a .env file for environment variables:
bash# Create .env file
cat > .env << EOF
FLASK_ENV=production
SECRET_KEY=$(openssl rand -hex 32)
EOF
4. Build and Start the Application
bash# Build and start the containers
docker-compose up -d --build

# Check if containers are running
docker-compose ps
5. Nginx Configuration (if using your own domain)
If you want to use your own domain name instead of direct access via IP, configure Nginx:
bash# Create Nginx configuration
sudo nano /etc/nginx/sites-available/gi-personalize

# Add the following configuration (replace yourdomain.com with your actual domain)
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Enable the site
sudo ln -s /etc/nginx/sites-available/gi-personalize /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
6. SSL Setup with Let's Encrypt
bash# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain and install SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts to complete the SSL setup
# Choose to redirect HTTP traffic to HTTPS when asked
7. Automatic Updates and Maintenance
Set up automatic updates for your application:
bash# Create update script
cat > update.sh << EOF
#!/bin/bash
cd /opt/gi-personalize
git pull
docker-compose down
docker-compose up -d --build
EOF

chmod +x update.sh

# Set up a cron job to update the application weekly
(crontab -l 2>/dev/null; echo "0 3 * * 0 /opt/gi-personalize/update.sh >> /opt/gi-personalize/update.log 2>&1") | crontab -
8. Backup Configuration
Set up regular backups of user data:
bash# Create backup script
cat > backup.sh << EOF
#!/bin/bash
TIMESTAMP=\$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/opt/gi-personalize/backups"

mkdir -p \$BACKUP_DIR

# Backup user data
tar -czf \$BACKUP_DIR/user_data_\$TIMESTAMP.tar.gz /opt/gi-personalize/backend/user_data

# Backup uploads
tar -czf \$BACKUP_DIR/uploads_\$TIMESTAMP.tar.gz /opt/gi-personalize/backend/uploads

# Delete backups older than 30 days
find \$BACKUP_DIR -name "*.tar.gz" -type f -mtime +30 -delete

echo "Backup completed: \$TIMESTAMP"
EOF

chmod +x backup.sh

# Set up a cron job to perform daily backups
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/gi-personalize/backup.sh >> /opt/gi-personalize/backup.log 2>&1") | crontab -
Monitoring and Maintenance
View Application Logs
bash# View logs for all containers
docker-compose logs

# View logs for specific container
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f
Restart the Application
bash# Restart all containers
docker-compose restart

# Restart specific container
docker-compose restart backend
Update the Application
bash# Pull latest changes from repository
git pull

# Rebuild and restart containers
docker-compose down
docker-compose up -d --build
Scaling for Production
For high-traffic production environments, consider these additional steps:

Database Migration: Move from SQLite to PostgreSQL for better performance and concurrency
Load Balancing: Set up multiple backend instances behind a load balancer
CDN Integration: Use a content delivery network for static assets
Monitoring: Install Prometheus and Grafana for comprehensive monitoring
Error Tracking: Integrate with services like Sentry for error tracking

Troubleshooting
Application Not Accessible

Check if containers are running: docker-compose ps
Check container logs: docker-compose logs
Verify Nginx configuration: sudo nginx -t
Check firewall settings: sudo ufw status

Database Issues

Check if user data directory is writable: ls -la backend/user_data
Backup and restore data if needed: ./backup.sh

SSL Certificate Issues

Check certificate status: sudo certbot certificates
Renew certificate: sudo certbot renew --dry-run
