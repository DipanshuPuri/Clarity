# Clarity: Deployment Guide

## 1. Environment Variables & Configuration
Use environment variables to keep secrets safe. Never commit `.env` to Git.

| Variable | Dev Value | Prod Value (Example) | Role |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://localhost...` | `postgresql://admin:xyz@clarity-db.rds.amazonaws.com...` | Connection to Postgres |
| `JWT_SECRET` | `dev-secret` | `complex_random_string_32_chars` | Signs auth tokens |
| `NODE_ENV` | `development` | `production` | Optimizes Express performance |
| `PORT` | `3000` | `3000` (or 80 via Nginx) | Server Port |

## 2. Dev vs Production
-   **Logging**: In dev, we log everything. In prod, use structured logging (JSON) and reduce noise.
-   **Cookies**: We set `secure: process.env.NODE_ENV === 'production'` in Auth Controller. This ensures cookies only travel over HTTPS in prod.
-   **CORS**: In prod, strictly whitelist your frontend domain (e.g., `https://clarity.internal`).

## 3. Backend Deployment (AWS EC2 + Docker)
*Why not Elastic Beanstalk? EC2 + Docker is more educational for "Beginner Serious" and gives full control.*

1.  **Launch EC2 Instance**:
    -   OS: Ubuntu LTS.
    -   Security Group: Open port 22 (SSH) and 80/443 (HTTP/S).
2.  **Setup Docker on EC2**:
    ```bash
    sudo apt update
    sudo apt install docker.io
    ```
3.  **Depoy Code**:
    *   *Option A (Git)*: `git clone your-repo` on server.
    *   *Option B (Hub)*: Build image locally -> Push to DockerHub -> Pull on Server.
4.  **Run Container**:
    ```bash
    docker run -d \
      -p 80:3000 \
      -e DATABASE_URL="..." \
      -e JWT_SECRET="..." \
      -e NODE_ENV="production" \
      --name clarity-api \
      your-image-name
    ```

## 4. Database (AWS RDS)
1.  **Create Database**: AWS Console -> RDS -> Create Database -> PostgreSQL.
2.  **Connectivity**:
    -   Make sure RDS Security Group allows traffic on port `5432` from your EC2 Instance's Security Group.
    -   *Do not make it Public access unless absolutely necessary for debugging.*
3.  **Migration**:
    -   Run migrations from your EC2 instance or a CI/CD pipeline:
    -   `npx prisma db push` (or `migrate deploy`) against the Prod URL.

## 5. Frontend Deployment
Frontend is just static files (HTML/CSS/JS). No server needed.
1.  **Build**: Run `npm run build` locally. This creates a `dist/` folder.
2.  **Host**:
    -   **AWS S3**: Upload `dist/` to a bucket enabled for "Static Website Hosting".
    -   **Vercel/Netlify** (Recommended): Connect your Git repo. It auto-builds and deploys globally with HTTPS.

## 6. Production Checklist
-   [ ] **HTTPS**: Use Let's Encrypt (Certbot) on EC2 or CloudFront for S3. HttpOnly cookies **require** HTTPS.
-   [ ] **Health Check**: Ensure `/health` route is monitored.
-   [ ] **Backups**: Enable RDS automated backups.
-   [ ] **Secrets**: Rotate JWT_SECRET.
-   [ ] **Clean Code**: Remove `console.log` statements.
