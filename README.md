- # Web_Project

  > App type: Web application  
  > Link: https://info30005-diabetes.herokuapp.com/general/home

  ## 1. Tools

  1. Version control/Release: Github
  2. Frontend: Handlebars
  3. Backend: Express/Node.js
     - Database: MongoDB
  4. Communication: Wechat
  5. Deployment platform: Heorku, Atlas
  6. Documents: Google Drive

  ## 2. Work allocation

  1. Frontend: Yiheng Chen, Longyu Hua, Shengcheng Jin
  2. Backend: Hongyu Su, Zihao Rui
  3. Testing: All members

  ## 3. Timeline

  -   Assessment date:
      -   Week 4 UI design
      -   Week 8 Deliverable 2
      -   Week 11Deliverable 3

  ## 4. Documents

  -   [Google Drive]

  ## 5. Deployment

  - ### Local deployment

    -   Make sure **npm** package management tool is installed and the newest version of Node.js is installed
    -   Install all the dependencies by running `npm i` at root directory
    -   Need to create a **.env** file, the contents of this file are in 8th part below **(8.Environment Variables and Default Data Info (.env))**. Because .gitignore file igore this file when push to GitHub.
    -   Run `npm run dev` at root directory
    -   Go to `localhost:8000/general/home` to access the web app
    -   Patient go to `localhost:8000/general/login` 
    -   CLinician go to `localhost:8000/general/clinicianlogin` 

  - ### Heroku deployment

    -   Simply push the project as a Heroku git repo or push it to Github and link the repository with Heroku to deploy, no configuration needed!.
    -   Go to `https://info30005-diabetes.herokuapp.com/general/home` to access the web app
    -   Patient go to `https://info30005-diabetes.herokuapp.com/general/login` 
    -   CLinician go to `https://info30005-diabetes.herokuapp.com/general/clinicianLogin`

  ## 6. Introduction & Features

  This project is about to help diabetes patients record their health data, and help clinicians monitor their patients' health.

  > Features for patients

  -   Log in
  -   The two ‘about’ pages are visible, whether the patient is logged in or not
  -   Record health data
  -   Patient can view health data they have already entered, via an easily understandable layout, with dates/times visible.
  -   View support messages
  -   Patient sees a badge if their engagement rate is over 80%
  -   This criterion is linked to a Learning OutcomeLeader board
  -   Leader board
  -   Change password

  > Features for clinicians

  -   Log in
  -   Dashboard
  -   Register patients & clinicians
  -   monitor patients' health
  -   Manage patients
  -   Clinician can change the current support message for patient
  -   View patient data
  -   Clinical notes
  -   View patient comments

  ## 7. Technologies

  > Project created with:

  -   connect-mongo: v4.6.0
  -   cookie-parser: v1.4.4
  -   debug: v2.6.9
  -   dotenv: v16.0.0
  -   express: v4.16.1
  -   express-handlebars: v6.0.3
  -   express-session: v1.17.2
  -   http-errors: v1.6.3
  -   jade: v1.11.0
  -   mongodb: v4.5.0
  -   mongoose: v6.2.10
  -   morgan: v1.9.1
  -   cross-env: v7.0.3
  -   nodemon: v2.0.15
  -   prettier: v2.6.2
  -   passport: v0.5.2
  -   passport-local: v1.0.0
  -   bcrypt: v5.0.1

  ## 8.Environment Variables and Default Data Info (.env)

  -   PORT=8000
  -   MONGO_URL=mongodb+srv://Gloaming:13456789@cluster0.l4vfl.mongodb.net/WebProject?retryWrites=true&w=majority
  -   SESSION_SECRET=WJiol_4629182#
