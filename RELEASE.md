# Release Deployment

**Prerequisites** Make sure you're an admin for the project on [npmjs](https://www.npmjs.com/package/@esri/application-base-js).

## Steps

1. Increase version number in `package.json`.
1. Check in updated `package.json` file.
1. run `npm login` to login as your npmjs user.
1. run `npm publish` to publish latest version to npmjs.

## Future Enhancements

- Create a script to
  - Use a deployment key instead of having to login
  - Automatically increases the version number based on semantic commits.
  - Create a tag for the version
  - Create a release on github
