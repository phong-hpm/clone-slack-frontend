# Document

This project is in development, so there are many bugs have not been fixed.

### [Live Demo](https://slack-clone.cf)

## How to navigate to `Chat Box`:

1. Click [Sign in](https://slack-clone.cf/signin)
2. login with email `phonghophamminh@gmail.com` or `alexandercarlson@gmail.com`
3. Click `Sign in with Email`
4. use bypass verify code `111111`
5. Select `Team 1`

## Note

When you change data on the server directly, you need to clear cache on frontend.
by deleting `updatedTime` on `localStorage` and refresh page, page will get new data from server

When test suite `RecordVideoModal` failed, you can run test with flag `--maxWorkers=50%` or `--maxWorkers=1`.

## Run

##### `App status`

In development

##### `npm start`

Runs the app in the development mode.

##### `npm test -- --coverage --watchAll=false`

Launches the test and write the coverage.
