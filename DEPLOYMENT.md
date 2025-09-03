# Deployment Setup Guide

## GitHub Actions VPS Deployment

This project includes an automated deployment workflow that builds a Docker image and deploys it to your VPS whenever you push to the `main` branch.

### Required GitHub Secrets

You need to configure the following secrets in your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following repository secrets:

#### VPS_HOST
- **Description**: The IP address or domain name of your VPS
- **Example**: `192.168.1.100` or `your-domain.com`

#### VPS_USER
- **Description**: The username for SSH access to your VPS
- **Example**: `root` or `ubuntu` or your custom user

#### VPS_SSH_KEY
- **Description**: The private SSH key for accessing your VPS
- **How to generate**:
  ```bash
  # On your local machine, generate a new SSH key pair
  ssh-keygen -t rsa -b 4096 -C "github-actions@your-domain.com"
  
  # Copy the public key to your VPS
  ssh-copy-id -i ~/.ssh/id_rsa.pub user@your-vps-ip
  
  # Copy the private key content for GitHub secret
  cat ~/.ssh/id_rsa
  ```

### VPS Prerequisites

Your VPS needs to have Docker installed and running:

```bash
# Install Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (optional, for non-root users)
sudo usermod -aG docker $USER

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### Deployment Process

The workflow performs the following steps:

1. **Build**: Creates a Docker image from your application
2. **Package**: Saves the image as a tar file
3. **Transfer**: Copies the image to your VPS via SCP
4. **Deploy**: 
   - Loads the new image
   - Stops and removes the old container
   - Starts a new container with the updated image
   - Verifies the deployment

### Container Configuration

The application will be deployed with:
- **Container name**: `artful-exhibition-space`
- **Port mapping**: `8080:80` (VPS port 8080 → Container port 80)
- **Restart policy**: `unless-stopped`

### Accessing Your Application

After successful deployment, your application will be available at:
```
http://your-vps-ip:8080
```

### Manual Deployment

You can also trigger the deployment manually:
1. Go to **Actions** tab in your GitHub repository
2. Select **Deploy to VPS** workflow
3. Click **Run workflow** button

### Troubleshooting

#### Common Issues:

1. **SSH Connection Failed**
   - Verify VPS_HOST, VPS_USER, and VPS_SSH_KEY secrets
   - Ensure SSH key has proper permissions on VPS
   - Check if SSH service is running on VPS

2. **Docker Build Failed**
   - Check Dockerfile syntax
   - Verify all required files are committed to repository

3. **Container Won't Start**
   - Check VPS logs: `docker logs artful-exhibition-space`
   - Verify port 8080 is not already in use
   - Ensure Docker has enough resources

4. **Port Already in Use**
   ```bash
   # Check what's using port 8080
   sudo netstat -tulpn | grep 8080
   
   # Stop conflicting service or change port in workflow
   ```

### Security Considerations

- Use a dedicated user for deployment (not root)
- Configure firewall to only allow necessary ports
- Regularly update your VPS and Docker
- Consider using Docker secrets for sensitive environment variables

### Environment Variables

If your application needs environment variables, modify the Docker run command in the workflow:

```yaml
docker run -d \
  --name artful-exhibition-space \
  --restart unless-stopped \
  -p 8080:80 \
  -e NODE_ENV=production \
  -e API_URL=https://your-api.com \
  artful-exhibition-space:latest
```