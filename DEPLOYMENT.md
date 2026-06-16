# Deployment Guide

This guide covers deployment of the Secure Application to various platforms.

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

## Heroku Deployment

### Prerequisites
- Heroku CLI installed
- Heroku account
- Git repository initialized

### Steps

1. **Create Heroku app**
   ```bash
   heroku login
   heroku create your-app-name
   ```

2. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set NODE_ENV=production
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

4. **View logs**
   ```bash
   heroku logs --tail
   ```

## AWS EC2 Deployment

### Prerequisites
- AWS account
- EC2 instance (Ubuntu)
- Node.js installed

### Steps

1. **Connect to instance**
   ```bash
   ssh -i key.pem ubuntu@your-instance-ip
   ```

2. **Install dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm
   sudo apt install nginx
   ```

3. **Clone repository**
   ```bash
   git clone https://github.com/raman000/Secureapplication.git
   cd Secureapplication
   npm install
   ```

4. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

5. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name "secure-app"
   pm2 startup
   pm2 save
   ```

6. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Enable Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

8. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Build and Run

```bash
# Build image
docker build -t secureapp:latest .

# Run container
docker run -p 5000:5000 --env-file .env secureapp:latest
```

## DigitalOcean App Platform

1. Connect GitHub repository
2. Select branch
3. Configure build and run commands
4. Set environment variables
5. Deploy

## Vercel (Frontend Only)

For deploying a separate frontend:

```bash
vercel
```

Set API endpoint in environment variables:
```
REACT_APP_API_URL=https://your-api-domain.com
```

## Database Setup (MongoDB)

### MongoDB Atlas Cloud

1. Create account at mongodb.com/cloud
2. Create cluster
3. Get connection string
4. Set in `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   ```

### Local MongoDB

```bash
# Install MongoDB
sudo apt install mongodb

# Start service
sudo systemctl start mongodb

# Connection string
MONGODB_URI=mongodb://localhost:27017/secureapp
```

## Production Checklist

- [ ] Environment variables configured
- [ ] SSL/TLS certificate installed
- [ ] Database backed up
- [ ] Logging configured
- [ ] Error monitoring setup
- [ ] Rate limiting tested
- [ ] CORS configured correctly
- [ ] JWT secret is strong
- [ ] File upload directory permissions set
- [ ] Regular backups scheduled
- [ ] Monitoring and alerts configured
- [ ] Security headers verified
- [ ] Dependencies updated
- [ ] Performance tested
- [ ] Load testing done

## Monitoring and Maintenance

### Error Monitoring

Use services like:
- Sentry
- New Relic
- LogRocket
- DataDog

### Performance Monitoring

```bash
# Check server status
pm2 status

# View logs
pm2 logs secure-app

# Monitor resources
pm2 monit
```

### Regular Updates

```bash
# Check for vulnerabilities
npm audit

# Update packages
npm update

# Update Node.js
node --version
```

## Troubleshooting

### App won't start
```bash
# Check logs
pm2 logs

# Check port availability
lsof -i :5000

# Check environment variables
printenv
```

### High memory usage
```bash
# Restart app
pm2 restart secure-app

# Check process memory
pm2 monit
```

### Database connection issues
```bash
# Verify MongoDB URI
echo $MONGODB_URI

# Test connection
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI)"
```

---

For more information, refer to the main README.md
