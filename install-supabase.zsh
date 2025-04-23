#!/usr/bin/env zsh

# install-supabase.zsh
# Script to install Supabase CLI with robust error handling and system compatibility checks

set -e  # Exit immediately if a command exits with a non-zero status

# Print colored output
function print_info() { echo "\033[0;34m[INFO]\033[0m $1"; }
function print_success() { echo "\033[0;32m[SUCCESS]\033[0m $1"; }
function print_error() { echo "\033[0;31m[ERROR]\033[0m $1" >&2; }
function print_warning() { echo "\033[0;33m[WARNING]\033[0m $1"; }

# Check if script is run with sudo
if [[ $EUID -eq 0 ]]; then
  print_error "This script should not be run as root or with sudo."
  print_info "It will prompt for sudo password when needed."
  exit 1
fi

# Detect OS and architecture
print_info "Detecting system information..."
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

# Translate architecture to GitHub release format
case $ARCH in
  x86_64) ARCH="amd64" ;;
  aarch64|arm64) ARCH="arm64" ;;
  *)
    print_error "Unsupported architecture: $ARCH"
    exit 1
    ;;
esac

# Determine package type based on the system
PKG_TYPE=""
case $OS in
  linux)
    # Check Linux distribution
    if [[ -f /etc/os-release ]]; then
      source /etc/os-release
      if [[ -n "$(command -v apt)" && -n "$(command -v dpkg)" ]]; then
        PKG_TYPE="deb"
      elif [[ -n "$(command -v dnf)" || -n "$(command -v yum)" ]]; then
        PKG_TYPE="rpm"
      elif [[ -n "$(command -v pacman)" ]]; then
        PKG_TYPE="pkg.tar.zst"
      elif [[ -n "$(command -v apk)" ]]; then
        PKG_TYPE="apk"
      fi
    fi
    ;;
  darwin)
    print_info "macOS detected, using Homebrew..."
    if [[ -n "$(command -v brew)" ]]; then
      print_info "Installing Supabase CLI using Homebrew..."
      brew tap supabase/tap
      brew install supabase
      print_success "Supabase CLI installed successfully via Homebrew."
      exit 0
    else
      print_error "Homebrew not found. Install Homebrew first: https://brew.sh"
      exit 1
    fi
    ;;
  *)
    print_error "Unsupported operating system: $OS"
    exit 1
    ;;
esac

# If no package type detected, fall back to Go installation
if [[ -z "$PKG_TYPE" ]]; then
  print_warning "Could not determine package type for your system."
  print_info "Falling back to installation via Go modules..."
  
  if [[ -z "$(command -v go)" ]]; then
    print_error "Go is not installed. Please install Go first: https://golang.org/doc/install"
    exit 1
  fi
  
  print_info "Installing Supabase CLI using Go modules..."
  go install github.com/supabase/cli@latest
  
  # Create symlink if not already in path
  GO_PATH=$(go env GOPATH)
  if [[ ! -f "/usr/local/bin/supabase" ]]; then
    print_info "Creating symlink for supabase in /usr/local/bin..."
    sudo ln -sf "$GO_PATH/bin/cli" /usr/local/bin/supabase
  fi
  
  print_success "Supabase CLI installed successfully via Go modules."
  print_info "You can now run 'supabase' from the command line."
  exit 0
fi

# Get latest version from GitHub
print_info "Getting latest Supabase CLI version..."
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

API_RESPONSE=$(curl -s https://api.github.com/repos/supabase/cli/releases/latest)
VERSION=$(echo "$API_RESPONSE" | grep -o '"tag_name": "v[^"]*"' | head -n 1 | cut -d'"' -f4)

if [[ -z "$VERSION" ]]; then
  print_error "Failed to get latest version from GitHub API."
  print_info "Using fallback version v2.22.4..."
  VERSION="v2.22.4"
fi

FILENAME="supabase_${VERSION#v}_${OS}_${ARCH}.${PKG_TYPE}"
DOWNLOAD_URL="https://github.com/supabase/cli/releases/download/${VERSION}/${FILENAME}"

print_info "Downloading Supabase CLI ${VERSION} for ${OS}/${ARCH}..."
if ! curl -LO "$DOWNLOAD_URL"; then
  print_error "Download failed. Check internet connection or visit https://github.com/supabase/cli/releases"
  exit 1
fi

# Install based on package type
print_info "Installing Supabase CLI..."
case $PKG_TYPE in
  deb)
    sudo dpkg -i "$FILENAME"
    ;;
  rpm)
    sudo rpm -i "$FILENAME"
    ;;
  apk)
    sudo apk add --allow-untrusted "$FILENAME"
    ;;
  pkg.tar.zst)
    sudo pacman -U --noconfirm "$FILENAME"
    ;;
esac

if [[ $? -ne 0 ]]; then
  print_error "Installation failed."
  exit 1
fi

# Cleanup
cd - > /dev/null
rm -rf "$TEMP_DIR"

# Verify installation
if command -v supabase &> /dev/null; then
  INSTALLED_VERSION=$(supabase --version)
  print_success "Supabase CLI installed successfully: $INSTALLED_VERSION"
  print_info "You can now run 'supabase' from the command line."
else
  print_error "Installation appears to have succeeded, but 'supabase' command is not in PATH."
  print_warning "You may need to restart your terminal or add the installation directory to your PATH."
fi