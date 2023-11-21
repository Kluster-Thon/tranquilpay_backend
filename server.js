require('dotenv').config()
const app = require('./app')
const { INFO } = require('./utils/logger')

const PORT = process.env.PORT

app.listen(PORT, () => INFO(`SERVER IS READY AT PORT ${PORT}.`))