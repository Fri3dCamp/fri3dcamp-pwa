#!/bin/bash

echo -n "'staging' or 'production'? "
read dest
if [ "$dest" != "staging" ] &&  [ "$dest" != "production" ]
  then echo not valid
  exit
fi


npm run build:$dest  && rm -f fri3dcamp-pwa.zip; zip -r fri3dcamp-pwa.zip ./ --exclude ".distignore" --exclude ".editorconfig" --exclude ".git/*" --exclude ".gitignore" --exclude ".gitlab-ci.yml" --exclude ".travis.yml" --exclude ".DS_Store" --exclude "Thumbs.db" --exclude "behat.yml" --exclude "bitbucket-pipelines.yml" --exclude "bin/*" --exclude ".circleci/config.yml" --exclude "composer.json" --exclude "composer.lock" --exclude "Gruntfile.js" --exclude "package.json" --exclude "package-lock.json" --exclude "phpunit.xml" --exclude "phpunit.xml.dist" --exclude "multisite.xml" --exclude "multisite.xml.dist" --exclude ".phpcs.xml" --exclude "phpcs.xml" --exclude ".phpcs.xml.dist" --exclude "phpcs.xml.dist" --exclude "README.md" --exclude "wp-cli.local.yml" --exclude "yarn.lock" --exclude "tests/*" --exclude "node_modules/*" --exclude "*.sql" --exclude "*.tar.gz" --exclude "*.zip"