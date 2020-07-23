const app = require('./app')

const port = process.env.PORT      // PORT is provided by heroku when deployed

app.listen(port, () => {
    console.log('Server is up on port: ', + port)
})