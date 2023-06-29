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
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { home, anime };