const db = require('quick.db')

const page = new db.table('page')
const rekomendasi = new db.table('rekomendasi')
const genres = new db.table('genres')
const seasons = new db.table('seasons')
const search = new db.table('search')
const anime = new db.table('anime')

module.exports = {
  page,
  rekomendasi,
  genres,
  seasons,
  search,
  anime
}