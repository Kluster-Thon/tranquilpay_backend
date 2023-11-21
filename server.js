require('dotenv').config()
const app = require('./app')
const { INFO } = require('./utils/logger')

const PORT = process.env.PORT

app.use('/', (req, res) => {
    res.json({ message: 'Hello world!' })
})

app.listen(PORT, () => INFO(`SERVER IS READY AT PORT ${PORT}.`))