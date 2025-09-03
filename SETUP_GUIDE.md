# 🚀 Step-by-Step VPS Deployment Setup

## What We've Done So Far ✅
- Created `.github/workflows/deploy.yml` - Your automated deployment workflow
- Your Dockerfile is already ready for production

## What You Need to Do Next 👇

### Step 1: Prepare Your VPS (Do This First!)

#### 1.1 Connect to Your VPS
```bash
# Replace with your VPS IP and username
ssh your-username@your-vps-ip
```

#### 1.2 Install Docker on Your VPS
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (so you don't need sudo)
sudo usermod -aG docker $USER

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Test Docker installation
docker --version
```

#### 1.3 Logout and Login Again
```bash
# Exit SSH session
exit

# Login again to apply docker group changes
ssh your-username@your-vps-ip

# Test Docker without sudo
docker ps
```

### Step 2: Set Up SSH Keys for GitHub Actions

#### 2.1 Generate SSH Key Pair (On Your Local Computer)
```bash
# Generate a new SSH key specifically for GitHub Actions
ssh-keygen -t rsa -b 4096 -f ~/.ssh/github_actions_key -C "github-actions@your-domain.com"

# When prompted:
# - Enter file: ~/.ssh/github_actions_key (already filled)
# - Enter passphrase: LEAVE EMPTY (just press Enter twice)
```

#### 2.2 Copy Public Key to Your VPS
```bash
# Copy the public key to your VPS
ssh-copy-id -i ~/.ssh/github_actions_key.pub your-username@your-vps-ip

# Test the connection
ssh -i ~/.ssh/github_actions_key your-username@your-vps-ip
```

#### 2.3 Get Your Private Key Content
```bash
# Display the private key (you'll copy this to GitHub)
cat ~/.ssh/github_actions_key
```
**📋 Copy this entire output - you'll need it for GitHub secrets!**

### Step 3: Configure GitHub Secrets

#### 3.1 Go to Your GitHub Repository
1. Open your repository: `https://github.com/BFWt/artful-exhibition-space`
2. Click on **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**

#### 3.2 Add These 3 Secrets (Click "New repository secret" for each):

**Secret 1: VPS_HOST**
- Name: `VPS_HOST`
- Value: Your VPS IP address (e.g., `123.456.789.012`)

**Secret 2: VPS_USER**
- Name: `VPS_USER`
- Value: Your VPS username (e.g., `ubuntu`, `root`, or your custom user)

**Secret 3: VPS_SSH_KEY**
- Name: `VPS_SSH_KEY`
- Value: The entire private key content from Step 2.3 (starts with `-----BEGIN OPENSSH PRIVATE KEY-----`)

### Step 4: Test Your Deployment

#### 4.1 Push to Main Branch
```bash
# Make any small change to trigger deployment
echo "# Deployment test" >> README.md
git add .
git commit -m "Test VPS deployment"
git push origin main
```

#### 4.2 Watch the Deployment
1. Go to your GitHub repository
2. Click **Actions** tab
3. You should see "Deploy to VPS" workflow running
4. Click on it to see the progress

#### 4.3 Check if It Worked
- Wait for the workflow to complete (green checkmark)
- Open your browser: `http://your-vps-ip:29999`
- You should see your React app! 🎉

### Step 5: Set Up Nginx Proxy Manager (Optional but Recommended)

#### 5.1 Install Nginx Proxy Manager on VPS
```bash
# Create directory for NPM
mkdir ~/nginx-proxy-manager
cd ~/nginx-proxy-manager

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3'
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
EOF

# Start Nginx Proxy Manager
docker-compose up -d
```

#### 5.2 Configure Nginx Proxy Manager
1. Open `http://your-vps-ip:81` in browser
2. Login with:
   - Email: `admin@example.com`
   - Password: `changeme`
3. Change the default credentials immediately!
4. Add a new Proxy Host:
   - Domain: `your-domain.com`
   - Forward to: `your-vps-ip:29999`
   - Enable SSL if you have a domain

## 🔍 Troubleshooting

### If Deployment Fails:
1. Check GitHub Actions logs for error messages
2. SSH into your VPS and check: `docker ps` and `docker logs artful-exhibition-space`
3. Verify all secrets are correctly set in GitHub

### If You Can't Access the App:
1. Check if container is running: `docker ps`
2. Check if port 29999 is open: `sudo ufw allow 29999`
3. Test locally on VPS: `curl localhost:29999`

### Common Issues:
- **Permission denied**: Make sure your user is in the docker group
- **Port already in use**: Change port in deploy.yml or stop conflicting service
- **SSH connection failed**: Double-check your SSH key and VPS credentials

## 🎯 What Happens Next

Once everything is set up:
1. You edit your code locally
2. Push to GitHub (`git push origin main`)
3. GitHub Actions automatically builds and deploys to your VPS
4. Your app is live at `http://your-vps-ip:29999`

## 📞 Need Help?

If you get stuck at any step, let me know:
- Which step you're on
- Any error messages you see
- What operating system you're using (Windows/Mac/Linux)