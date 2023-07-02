const express = require('express');
const cheerio = require('cheerio');
const request = require('../tools');

/**
 * 
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns 
 */
const home = async (req, res) => {
    try {
        let path = '';
        if (req.params.page)
            path = `page/${req.params.page}`;
        else
            path = '';

        const response = await request.get(path);

        const $ = cheerio.load(response.data);
        const home = {};

        home.update_terbaru = [];
        $('.vezone').find('.venz').find(".kover").each((i, el) => {
            const thumbnail = $(el).find('img').attr('src');
            const title = $(el).find('.thumb').find('a').attr('title');
            const url = $(el).find('.thumb').find('a').attr('href');
            const endpoint = url.replace(process.env.BASE_URL, '');

            const genres = [];
            $(el).find('.content').find('p:nth-child(4)').find('a').each((j, ele) => {
                const name = $(ele).text();
                const url = $(ele).attr('href');
                const endpoint = url.replace(process.env.BASE_URL, '');

                genres.push({ name, url, endpoint });
            });

            home.update_terbaru.push({ title, thumbnail, genres, url, endpoint });
        });

        home.seasons_anime = [];
        $('#sidebar').find('.section:nth-child(2)').find('.tagcloud').find('a').each((i, el) => {
            const title = $(el).text();
            const url = $(el).attr('href');
            const endpoint = url.replace(process.env.BASE_URL, '');

            home.seasons_anime.push({ title, url, endpoint });
        });

        home.genres = [];
        $("#sidebar").find('.section:nth-child(3)').find('.tagcloud').find('a').each((i, el) => {
            const name = $(el).text();
            const url = $(el).attr('href');
            const endpoint = url.replace(process.env.BASE_URL, '');

            home.genres.push({ name, url, endpoint });
        });

        home.rekomendasi = [];
        $(".recomx").find("li").each((i, el) => {
            const title = $(el).find('img').attr('title');
            const thumbnail = $(el).find('img').attr('src');
            const url = $(el).find('a').attr('href');
            const endpoint = url.replace(process.env.BASE_URL, '');

            home.rekomendasi.push({ title, thumbnail, url, endpoint });
        });

        home.pagination = [];
        $(".pagination").find('a').each((i, el) => {
            const name = $(el).text();
            const url = $(el).attr('href');
            const endpoint = url.replace(process.env.BASE_URL, '');

            home.pagination.push({ name, url, endpoint });
        });

        return res.json({ success: true, data: home });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns
 */
const anime = async (req, res) => {
    try {
        const { endpoint } = req.params;
        const response = await request.get(endpoint);

        const $ = cheerio.load(response.data);
        const anime = {};

        anime.title = $('.jdlz').text().trim();
        anime.thumbnail = $('.post-thumb').find('img').attr('src');
        $('.info').find('p').each((i, el) => {
            const key = $(el).find('b').text().toLowerCase().trim().replace(' ', '_');
            // remove <b> tag
            $(el).find('b').remove();

            const value = $(el).text().split(':').pop().trim();

            anime[key] = value === '' ? null : value;
        });
        anime.sinopsis = $('.lexot > p').text().trim();

        anime.list_download = [];
        $('#dl').find('.smokeddlrh').each((i, el) => {
            const download_link = [];
            const title = $(el).find('.smokettlrh').text().trim();

            $('.smokeurlrh').each((j, ele) => {
                const type = $(ele).find('strong').text().trim();

                const links = [];
                $(ele).find('a').each((k, elem) => {
                    const name = $(elem).text().trim();
                    const url = $(elem).attr('href');

                    links.push({ name, url });
                });

                download_link.push({ type, links });
            });

            anime.list_download.push({ title, download_link });
        });

        return res.json({ success: true, data: anime });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
const listAnimeBatch = async (req, res) => {
    try {
        const response = await request.get('list-anime-batch-sub-indo');

        const $ = cheerio.load(response.data);

        const listAnime = [];
        $("#abtext").find('.bariskelom').each((i, el) => {
            const abjad = $(el).find('.barispenz').text().trim();

            const animes = [];
            $(el).find('.jdlbar').find('ul').each((j, ele) => {
                const name = $(ele).find('a').text().trim();
                const url = $(ele).find('a').attr('href');

                animes.push({ name, url });
            });

            listAnime.push({ abjad, animes });
        });

        return res.json({ success: true, data: listAnime });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
const listAnimeBluerayDisk = async (req, res) => {
    try {
        const response = await request.get('anime-list-bd');

        const $ = cheerio.load(response.data);

        const listAnime = [];
        $("#abtext").find('.bariskelom').each((i, el) => {
            const abjad = $(el).find('.barispenz').text().trim();

            const animes = [];
            $(el).find('.jdlbar').find('ul').each((j, ele) => {
                const name = $(ele).find('a').text().trim();
                const url = $(ele).find('a').attr('href');

                animes.push({ name, url });
            });

            listAnime.push({ abjad, animes });
        });

        return res.json({ success: true, data: listAnimeBatch });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
const animeMovieList = async (req, res) => {
    try {
        const response = await request.get('anime-movie-list');

        const $ = cheerio.load(response.data);

        const listAnime = [];
        $("#abtext").find('.bariskelom').each((i, el) => {
            const abjad = $(el).find('.barispenz').text().trim();

            const animes = [];
            $(el).find('.jdlbar').find('ul').each((j, ele) => {
                const name = $(ele).find('a').text().trim();
                const url = $(ele).find('a').attr('href');

                animes.push({ name, url });
            });

            listAnime.push({ abjad, animes });
        });

        return res.json({ success: true, data: listAnime });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
const liveAction = async (req, res) => {
    try {
        const response = await request.get('daftar-live-action');

        const $ = cheerio.load(response.data);

        const listAnime = [];
        $("#abtext").find('.bariskelom').each((i, el) => {
            const abjad = $(el).find('.barispenz').text().trim();

            const animes = [];
            $(el).find('.jdlbar').find('ul').each((j, ele) => {
                const name = $(ele).find('a').text().trim();
                const url = $(ele).find('a').attr('href');

                animes.push({ name, url });
            });

            listAnime.push({ abjad, animes });
        });

        return res.json({ success: true, data: listAnime });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
const animeOVA = async (req, res) => {
    try {
        const response = await request.get('seasons/ova');
        const $ = cheerio.load(response.data);

        const listAnime = [];
        $('.vezone').find('.venz').find(".kover").each((i, el) => {
            const thumbnail = $(el).find('img').attr('src');
            const title = $(el).find('.thumb').find('a').attr('title');
            const url = $(el).find('.thumb').find('a').attr('href');
            const endpoint = url.replace(process.env.BASE_URL, '');

            const genres = [];
            $(el).find('.content').find('p:nth-child(4)').find('a').each((j, ele) => {
                const name = $(ele).text();
                const url = $(ele).attr('href');
                const endpoint = url.replace(process.env.BASE_URL, '');

                genres.push({ name, url, endpoint });
            });

            listAnime.push({ title, thumbnail, genres, url, endpoint });
        });

        return res.json({ success: true, data: listAnime });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
const animeSpecial = async (req, res) => {
    try {
        const response = await request.get('seasons/special');
        const $ = cheerio.load(response.data);

        const listAnime = [];
        $('.vezone').find('.venz').find(".kover").each((i, el) => {
            const thumbnail = $(el).find('img').attr('src');
            const title = $(el).find('.thumb').find('a').attr('title');
            const url = $(el).find('.thumb').find('a').attr('href');
            const endpoint = url.replace(process.env.BASE_URL, '');

            const genres = [];
            $(el).find('.content').find('p:nth-child(4)').find('a').each((j, ele) => {
                const name = $(ele).text();
                const url = $(ele).attr('href');
                const endpoint = url.replace(process.env.BASE_URL, '');

                genres.push({ name, url, endpoint });
            });

            listAnime.push({ title, thumbnail, genres, url, endpoint });
        });

        return res.json({ success: true, data: listAnime });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
const animeONA = async (req, res) => {
    try {
        const response = await request.get('seasons/ona');
        const $ = cheerio.load(response.data);

        const listAnime = [];
        $('.vezone').find('.venz').find(".kover").each((i, el) => {
            const thumbnail = $(el).find('img').attr('src');
            const title = $(el).find('.thumb').find('a').attr('title');
            const url = $(el).find('.thumb').find('a').attr('href');
            const endpoint = url.replace(process.env.BASE_URL, '');

            const genres = [];
            $(el).find('.content').find('p:nth-child(4)').find('a').each((j, ele) => {
                const name = $(ele).text();
                const url = $(ele).attr('href');
                const endpoint = url.replace(process.env.BASE_URL, '');

                genres.push({ name, url, endpoint });
            });

            listAnime.push({ title, thumbnail, genres, url, endpoint });
        });

        return res.json({ success: true, data: listAnime });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
const genres = async (req, res) => {
    try {
        const response = await request.get('genres');
        const $ = cheerio.load(response.data);

        const listGenres = [];
        $('.genres').find('li').each((i, el) => {
            const title = $(el).find('a').text();
            const url = $(el).find('a').attr('href');

            if (!title || !url) return;

            listGenres.push({ title, url });
        });

        return res.json({ success: true, data: listGenres });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * 
 * @param {express.Request} req
 * @param {express.Response} res 
 * @returns 
 */
const listAnimeGenres = async (req, res) => {
    try {
        const { endpoint } = req.params;
        const { page = 1 } = req.params;

        const response = await request.get(`genres/${endpoint}/page/${page}`);
        const $ = cheerio.load(response.data);

        const listAnime = [];
        $('.vezone').find('.venz').find(".kover").each((i, el) => {
            const thumbnail = $(el).find('img').attr('src');
            const title = $(el).find('.thumb').find('a').attr('title');
            const url = $(el).find('.thumb').find('a').attr('href');
            const endpoint = url.replace(process.env.BASE_URL, '');

            const genres = [];
            $(el).find('.content').find('p:nth-child(4)').find('a').each((j, ele) => {
                const name = $(ele).text();
                const url = $(ele).attr('href');
                const endpoint = url.replace(process.env.BASE_URL, '');

                genres.push({ name, url, endpoint });
            });

            listAnime.push({ title, thumbnail, genres, url, endpoint });
        });

        return res.json({ success: true, data: listAnime });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}


/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
const seasons = async (req, res) => {
    try {
        const response = await request.get('seasons-list');
        const $ = cheerio.load(response.data);

        const listSeason = [];
        $('.genres').find('li').each((i, el) => {
            const title = $(el).find('a').text();
            const url = $(el).find('a').attr('href');

            if (!title || !url) return;

            listSeason.push({ title, url });
        });

        return res.json({ success: true, data: listSeason });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns 
 */
const listAnimeSeasons = async (req, res) => {
    try {
        const { endpoint } = req.params;
        const { page = 1 } = req.params;

        const response = await request.get(`seasons/${endpoint}/page/${page}`);
        const $ = cheerio.load(response.data);

        const listAnime = [];
        $('.vezone').find('.venz').find(".kover").each((i, el) => {
            const thumbnail = $(el).find('img').attr('src');
            const title = $(el).find('.thumb').find('a').attr('title');
            const url = $(el).find('.thumb').find('a').attr('href');
            const endpoint = url.replace(process.env.BASE_URL, '');

            const genres = [];
            $(el).find('.content').find('p:nth-child(4)').find('a').each((j, ele) => {
                const name = $(ele).text();
                const url = $(ele).attr('href');
                const endpoint = url.replace(process.env.BASE_URL, '');

                genres.push({ name, url, endpoint });
            });

            listAnime.push({ title, thumbnail, genres, url, endpoint });
        });

        return res.json({ success: true, data: listAnime });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const search = async (req, res) => {
    try {
        const query = req.query.s;
        const page = req.params.page || 1;

        if (!query) return res.status(400).json({ success: false, error: 'Query is required' });

        const response = await request.get(`page/${page}/?s=${query}&post_type=post`);
        const $ = cheerio.load(response.data);

        const data = {};

        data.listAnime = [];
        $('.vezone').find('.venz').find(".kover").each((i, el) => {
            const thumbnail = $(el).find('img').attr('src');
            const title = $(el).find('.thumb').find('a').attr('title');
            const url = $(el).find('.thumb').find('a').attr('href');
            const endpoint = url.replace(process.env.BASE_URL, '');

            const genres = [];
            $(el).find('.content').find('p:nth-child(4)').find('a').each((j, ele) => {
                const name = $(ele).text();
                const url = $(ele).attr('href');
                const endpoint = url.replace(process.env.BASE_URL, '');

                genres.push({ name, url, endpoint });
            });

            data.listAnime.push({ title, thumbnail, genres, url, endpoint });
        });

        data.pagination = [];
        $(".pagination").find('a').each((i, el) => {
            const name = $(el).text();
            const url = $(el).attr('href');
            const endpoint = url.replace(process.env.BASE_URL, '');

            data.pagination.push({ name, url, endpoint });
        });

        return res.json({ success: true, data });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

module.exports = { home, anime, listAnimeBatch, listAnimeBluerayDisk, animeMovieList, liveAction, animeONA, animeSpecial, animeOVA, genres, listAnimeGenres, seasons, listAnimeSeasons, search };