## Watchdog

Watchdog is a visual website monitoring app. It was created as a self-hosted alternative to commercial solutions such as [visualping](https://visualping.io ) and [sken.io](sken.io). With Watchdog, you can monitor changes on websites. Two comparison methods are supported.

#### Visual comparisons

Watchdog periodically captures a screenshot of any given web page, and looks for any pixel-level changes between the current and previously captured screenshot. If a change is big enough, a notification email will be sent. You can crop the screenshot to focus only on a specific part on the page.


https://user-images.githubusercontent.com/36775736/233996134-2be1931c-9656-4de2-b5e2-3e13906cbeb0.mp4

<details>
  <summary>Sample notification</summary>
  <img width="602" alt="sample email" src="https://user-images.githubusercontent.com/36775736/234368891-a3ff676f-e48a-4768-b453-23ebacccf5fb.png">

</details>


#### Text comparisons

Watchdog can also detect text-based changes on the page. Whenever there is a change, a notification email will be sent. You can use CSS selectors to monitor changes only in a single element. Alternatively, you can define a set of keywords, and Watchdog will notify you whenever those words are either _found_ or _not found_ on the page.

## How to deploy

It is recommended to deploy Watchdog using Docker. However, you can also deploy it manually.

Once deployed, create a new admin account with the same username as defined in `ADMIN_USERNAME`. Log in, go to Settings and configure the email settings.
<details>
  <summary>Docker</summary>

## Backend

Provide your own values for `JWT_SECRET`, and `APP_URL` in `environment` in the `watchdog_api` container in `docker-compose.yml`. If needed, adjust port and network values to suit your needs.

## Frontend

Add the `REACT_APP_API_PATH` environment variable to the `watchdog_frontend` container in `docker-compose.yml`. This should be the base URL of the API, i.e. the same value as `APP_URL` in `watchdog_api` container.

Start the containers with the following command.

```shell
docker compose up -d
```

The frontend should be available at port 3000.

To stop the containers, run

```shell
docker compose down
```



</details>
<details>
  <summary>Manual deployment</summary>

### Backend

In order to run the backend server, a `.env` file must be placed in the `backend` folder. Fill in the following details.

```ini
# Database settings
MONGODB_URI="mongodb://127.0.0.1:27017/watchdog"

# JWT settings
JWT_SECRET=<Some long random string>
JWT_EXPIRES_IN=<e.g. "30d">

# Port
PORT=3001

# Base URL
APP_URL=<Base URL of the api, e.g. https.//example-api.com>

# File path
FILES_PATH="./files"

# Admin username
# Account with this name will receive admin rights
ADMIN_USERNAME="admin"
```

After this, you can start the server. If you want to run it persistently, use `forever` or `pm2`.

### Install packages needed for the server
```
cd backend
npm install
```

### PM2
```
npm install -g pm2@latest
pm2 start index.js
```
### Forever

```
npm install -g forever
forever start index.js
```

### Frontend

Install and build.

```
npm install
npm run build
```

The built site will be in `/build`.
</details>
