# Zwiggy Deployment Guide

This guide provides multiple options for deploying the Zwiggy food delivery platform.

## Prerequisites

- Docker and Docker Compose installed
- Git repository cloned
- Environment variables configured

## Quick Start (Local Development)

1. **Clone and setup**:
```bash
git clone <your-repo-url>
cd zwiggy
```

2. **Run the deployment script**:
```bash
chmod +x deploy.sh
./deploy.sh
```

3. **Access the application**:
- Frontend: http://localhost
- Backend API: http://localhost:4000
- Admin Panel: http://localhost/admin

## Environment Configuration

1. **Copy the example environment file**:
```bash
cp .env.example .env
```

2. **Update the `.env` file with your values**:
```env
# Database Configuration
MONGO_URL=mongodb://admin:password123@mongodb:27017/zwiggy?authSource=admin
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your-secure-password

# JWT Configuration (Generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
SALT=12

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_or_sk_test_your_stripe_key

# Server Configuration
PORT=4000
NODE_ENV=production
```

## Deployment Options

### Option 1: Docker Compose (Recommended)

**For Development:**
```bash
docker-compose up --build -d
```

**For Production:**
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### Option 2: Individual Docker Containers

**1. Build images:**
```bash
docker build -f Dockerfile.backend -t zwiggy-backend .
docker build -f Dockerfile.frontend -t zwiggy-frontend .
```

**2. Run MongoDB:**
```bash
docker run -d --name zwiggy-mongo \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -p 27017:27017 \
  mongo:7
```

**3. Run Backend:**
```bash
docker run -d --name zwiggy-backend \
  --link zwiggy-mongo:mongodb \
  -p 4000:4000 \
  -e MONGO_URL=mongodb://admin:password123@mongodb:27017/zwiggy?authSource=admin \
  -e JWT_SECRET=your-jwt-secret \
  -e STRIPE_SECRET_KEY=your-stripe-key \
  zwiggy-backend
```

**4. Run Frontend:**
```bash
docker run -d --name zwiggy-frontend \
  --link zwiggy-backend:backend \
  -p 80:80 \
  zwiggy-frontend
```

### Option 3: Cloud Deployment

#### AWS ECS/Fargate

1. **Push images to ECR:**
```bash
# Create ECR repositories
aws ecr create-repository --repository-name zwiggy-frontend
aws ecr create-repository --repository-name zwiggy-backend

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push images
docker tag zwiggy-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/zwiggy-frontend:latest
docker tag zwiggy-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/zwiggy-backend:latest

docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/zwiggy-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/zwiggy-backend:latest
```

2. **Create ECS task definitions and services**

#### Google Cloud Run

1. **Build and push to Google Container Registry:**
```bash
gcloud builds submit --tag gcr.io/your-project-id/zwiggy-frontend .
gcloud builds submit --tag gcr.io/your-project-id/zwiggy-backend .
```

2. **Deploy to Cloud Run:**
```bash
gcloud run deploy zwiggy-frontend --image gcr.io/your-project-id/zwiggy-frontend --platform managed
gcloud run deploy zwiggy-backend --image gcr.io/your-project-id/zwiggy-backend --platform managed
```

#### DigitalOcean App Platform

Create `app.yaml`:
```yaml
name: zwiggy
services:
- name: backend
  source_dir: /backend
  github:
    repo: your-username/zwiggy
    branch: main
  run_command: node server.js
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGO_URL
    value: ${db.CONNECTION_STRING}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
  - key: STRIPE_SECRET_KEY
    value: ${STRIPE_SECRET_KEY}

- name: frontend
  source_dir: /frontend
  github:
    repo: your-username/zwiggy
    branch: main
  build_command: npm run build
  run_command: serve -s dist
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs

databases:
- engine: MONGODB
  name: zwiggy-db
  num_nodes: 1
  size: db-s-dev-database
```

## Production Considerations

### Security

1. **Use strong secrets:**
   - Generate a strong JWT secret (minimum 32 characters)
   - Use environment-specific Stripe keys
   - Set strong MongoDB passwords

2. **Enable HTTPS:**
   - Configure SSL certificates
   - Update CORS origins for production domains

3. **Network Security:**
   - Use private networks for database
   - Implement rate limiting
   - Set up proper firewall rules

### Performance

1. **Database Optimization:**
   - Use MongoDB Atlas for managed hosting
   - Implement database indexes
   - Set up connection pooling

2. **Caching:**
   - Implement Redis for session storage
   - Use CDN for static assets
   - Enable browser caching

3. **Monitoring:**
   - Set up application monitoring (e.g., New Relic, DataDog)
   - Implement health checks
   - Configure logging aggregation

### Backup

1. **Database Backups:**
```bash
# MongoDB backup
docker exec zwiggy-mongodb mongodump --out /backup
```

2. **File Uploads:**
```bash
# Backup uploads directory
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz backend/uploads/
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed:**
   - Check if MongoDB container is running
   - Verify connection string format
   - Ensure network connectivity

2. **CORS Errors:**
   - Update backend CORS configuration
   - Check frontend API base URL
   - Verify environment variables

3. **Build Failures:**
   - Clear Docker cache: `docker system prune -a`
   - Check Dockerfile syntax
   - Verify package.json dependencies

### Logs and Debugging

**View logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

**Access containers:**
```bash
# Backend shell
docker exec -it zwiggy-backend sh

# MongoDB shell
docker exec -it zwiggy-mongodb mongosh
```

## Scaling

### Horizontal Scaling

1. **Load Balancer Configuration:**
   - Use Nginx or cloud load balancers
   - Implement sticky sessions for Socket.io
   - Configure health checks

2. **Multiple Backend Instances:**
```bash
docker-compose up --scale backend=3
```

### Database Scaling

1. **MongoDB Replica Set:**
   - Set up replica sets for high availability
   - Configure read replicas
   - Implement sharding for large datasets

## Maintenance

### Updates

1. **Application Updates:**
```bash
git pull origin main
docker-compose down
docker-compose up --build -d
```

2. **Database Maintenance:**
```bash
# Check database status
docker exec zwiggy-mongodb mongosh --eval "db.runCommand({serverStatus: 1})"

# Compact database
docker exec zwiggy-mongodb mongosh zwiggy --eval "db.runCommand({compact: 'collection_name'})"
```

## Support

For deployment issues:
1. Check the logs using the commands above
2. Verify environment variables are set correctly
3. Ensure all required services are running
4. Check network connectivity between containers

## Quick Commands Reference

```bash
# Start application
./deploy.sh

# Stop application
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Update application
git pull && docker-compose up --build -d

# Database backup
docker exec zwiggy-mongodb mongodump --out /backup

# Clean up
docker system prune -a
```