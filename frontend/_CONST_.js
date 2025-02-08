// const SERVER = null
// const PORT = null

const SERVER = 'http://127.0.0.1'
const PORT = 8000




export const BASE_URL = (SERVER && PORT) ? `${SERVER}:${PORT}` : '/choreo-apis/geographic-information-sy/backend/v1';
