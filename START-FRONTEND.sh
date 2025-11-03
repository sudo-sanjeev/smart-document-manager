#!/bin/bash

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Use Node.js 20
nvm use 20

# Navigate to frontend directory
cd /Users/sanjeev/Study/case-study/frontend

# Start the development server
npm run dev

