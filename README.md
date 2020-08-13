<h1>Task Manager</h1>

<h2>Live Application</h2>
<p>https://scoggins-task-manager.herokuapp.com//</p>

<h2>Purpose</h2>
<p>This application allows a user to register, login, and manage tasks. The user must first register an account by providing an email and password, and is notified of account
creation by a welcome email. They may also delete their account, and will receive a farewell email as well. Once registered, a user can log in and out as often as they like.
 While logged in, the user is able to view their profile details, and may update or delete their account from the profile page. Logged in users may also manage tasks. They 
 are able to create, update and delete tasks, as well as filter and sort them by description and completeness.</p>

<h2>Tech Stack</h2>
<p>This task manager application was primarily developed using Node.js, and JavaScript. It makes use of common techniques, such as callbacks, object destructuring, and 
async/await, as well as common modules. The Express module is used to set up the server and handle routing, Request is used to communicate with external API's, and HBS 
(handlebars) is used to establish views and partials which make up the front end of the application. Nodemon is also used as a devDependency for automatic server restarts
during development. SendGrid is used send email correspondence. Bcrypt provides encoding for sensitive data. JsonWebToken is used to persist users sessions. Validator helps
ensure input values meet expectations. Finally, MongoDB and Mongoose are used to persist user and task data.</p>

<p>Some basic HTML and CSS is also used to construct a simple interface.</p>

<p>GitHub is used for version control, and is setup to communicate with Heroku which is used to for "production" deployment.</p>

## Development server

Run `npm dev` for a dev server. Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.
