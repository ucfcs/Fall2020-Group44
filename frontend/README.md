# Getting Started with Create React App

This project was bootstrapped with
[Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm run format`

Runs prettier on the frontend files in `src/`.

### `npm run lint`

Runs eslint on the frontend files in `src/`.

### `npm run cleanup`

Runs eslint and prettier on the frontend files in `src/`.

### `npm start`

Runs the app in the development mode.\
Open [localhost:3000/course/1?token=123456789](localhost:3000/course/1?token=123456789) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests)
for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best
performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about
[deployment](https://facebook.github.io/create-react-app/docs/deployment) for
more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can
`eject` at any time. This command will remove the single build dependency from
your project.

Instead, it will copy all the configuration files and the transitive
dependencies (webpack, Babel, ESLint, etc) right into your project so you have
full control over them. All of the commands except `eject` will still work, but
they will point to the copied scripts so you can tweak them. At this point
you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for
small and middle deployments, and you shouldn’t feel obligated to use this
feature. However we understand that this tool wouldn’t be useful if you couldn’t
customize it when you are ready for it.

## Environment Variables

Set these variables in a `.env` file in `/frontend`. Can be substitued for your remote URLs.

```
REACT_APP_REST_URL="http://localhost:5000/dev/api/v1"
REACT_APP_WEBSOCKET_URL="ws://localhost:3001"
```

## Authenticating

The frontend is authenticated through a redirect in Canvas. It is `<base url>/course/<courseId>?token=<jwt>`

If you want to access the frontend locally you will need to navigate to `https://localhost:3000/course/<courseId>?token=<data of your choice>`

## Learn More

You can learn more in the
[Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Setup Canvas LMS

How to get Canvas LMS running on your machine locally

1. Clone the Canvas LMS [repo](https://github.com/instructure/canvas-lms)
2. Follow the Quick Start instructions
   [here](https://github.com/instructure/canvas-lms/wiki/Quick-Start)

## Resouces

- [React app setup](https://create-react-app.dev/docs/adding-typescript/)
- [React SCSS](https://create-react-app.dev/docs/adding-a-sass-stylesheet/)
- [Canvas LMS](https://github.com/instructure/canvas-lms)
- [Canvas LMS Install](https://github.com/instructure/canvas-lms/wiki/Quick-Start)
