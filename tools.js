const axios = require('axios').default;
const BASE_URL = process.env.BASE_URL;

axios.defaults.baseURL = BASE_URL;

const get = (path) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(path);

            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { get };