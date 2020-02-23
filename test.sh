#!/bin/bash
cp config/local.js.sample config/local.js
nvm install 0.10
npm install
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/linuxbrew/go/install)"
brew install mysql
brew install redis
brew install forever
forever start app.js