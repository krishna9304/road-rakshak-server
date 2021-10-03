# Road Rakshak Server

This is the backend of the project that I made for safe rohtech challenge. The deployed version of the application is live on heroku --- [https://road-rakshak-server.herokuapp.com/](https://road-rakshak-server.herokuapp.com/).

### This is one of the three components of the project. Following are all the components of the project
- [Road Rakshak User Application](https://github.com/krishna9304/road-rakshak/)
- [Admin Dashboard](https://github.com/krishna9304/road-rakshak-admin/)
- [Road Rakshak Server](https://github.com/krishna9304/road-rakshak-server/)

# Setting up the development environment
  1. Clone the repository `$ git clone https://github.com/krishna9304/road-rakshak-server.git`
  2. Install all the dependencies using command `$ npm install` 
  3. Create a `.env` file in the root directory. Copy all the elements from `.env.example` and replace the demo value of environment variables from your own values.
  4. Run `$ npm run dev`.
  5. The application should start on port 8080. You can visit the application on `http://localhost:8080`. If it shows a screen that says ---
  ````json
  {
    "res": true,
    "msg": "Server running"
  }
  ````
  then your server is running correctly.

  6. Also check the console whether it is connected to the database or not. If it is connected, it will show something like this---
     <img width="570" alt="Screenshot 2021-10-03 at 11 58 24 AM" src="https://user-images.githubusercontent.com/71918441/135742749-74f3a607-6134-4015-9981-b78d3a3c405c.png">


# Features
### 1. RESTful APIs
### 2. Flexible schema design
### 3. Proper management of routes
### 4. Powerful and secure express server
### 5. Realtime connection with the android app through sockets.

# Technologies Used
  - [Node.js](https://nodejs.org/en/)
  - [Express.js](https://expressjs.com/)
  - [Mongoose.js](https://mongoosejs.com/)
  - [MongoDB](https://www.mongodb.com/)
  - [Multer](https://www.npmjs.com/package/multer) for image upload.
