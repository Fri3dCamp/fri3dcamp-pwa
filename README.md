# Fri3d Camp App 2022
This project contains a WordPress Plugin that once installed and activated, transforms the WordPress front-end into a fully fledged Progressive Web App.


## Requirements

* [nodejs v12.x](https://nodejs.org/en/download/) (or use [node version manager](https://github.com/nvm-sh/nvm))
* [docker](https://www.docker.com/community-edition)

## Getting started

1. Clone the repository
2. Bootstrap the project with `npm install`
3. Start the WordPress dev environment with `npm run wp-env start`
4. Make sure the composer dependencies for the plugin are installed `npm run composer-install`

The development environment should now be available!

* **Frontend**: [localhost:8888](http://localhost:8888/)
* **Backend**: [localhost:8888/wp-admin/](http://localhost:8888/wp-admin/)
  * _Username:_ `admin`
  * _Password:_ `password`

### The PWA
It's currently located at [localhost:8888/wp-content/plugins/fri3dcamp-pwa/build/](http://localhost:8888/wp-content/plugins/fri3dcamp-pwa/build/), after building it with `npm run build`.

### Mapbox
For the floorplan to work, you need a mapbox token (see `.env`). Ask [@vdwijngaert](https://github.com/vdwijngaert).

### Push notifications
The GMP PHP extension needs to be installed for the notifications, but it doesn't seem possible to do so by configuration yet using `wp-env`.

It can be enabled like so (after first running `npm run wp-env start` of course):

```bash
#!/usr/bin/env bash

# Get name of the wordpress container (not the test container)
CONTAINER_NAME=$(docker ps -f name=-wordpress-1 -q | tail -n1 | xargs docker inspect | jq -r '.[0].Name')

# Grab it manually from `docker ps -f name=-wordpress-1` if not working.

# Install prereqs & configure gmp extension
docker exec $CONTAINER_NAME apt-get update -y \
	&& docker exec $CONTAINER_NAME apt-get install libgmp-dev \
	&& docker exec $CONTAINER_NAME docker-php-ext-configure gmp \
	&& docker restart $CONTAINER_NAME

# Verify that the extension is installed:
docker exec $CONTAINER_NAME php -i | grep gmp
```

## Front-end
This project was originally bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
