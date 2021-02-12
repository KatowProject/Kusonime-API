const router = require('express').Router();
const cheerio = require('cheerio');
const Axios = require('../tools');
const cache = require('../database')
const cacheTime = require('../cacheTime.json')


/* Home */
router.get('/', async (req, res) => {

    try {

        let data = await Axios('/');
        res.send({success: true, statusCode: data.status, statusMessage: data.statusText});     

    } catch (e) {

        res.send({success: false, message: e.message});

    };
    
});


/* Home */
router.get('/page/:page', async (req, res) => {

    try {

        /* Params url*/
        let page = req.params.page;

        /* Get data from cache */
        const caches = await cache.page.get(`${page}`)
        const hit = (Date.now() - (caches?.timestamp || 0) < (cacheTime.page * 3600000)) ? true : false
        if (hit) return res.send(caches)

        /* scrap data */
        const response = await Axios(`/page/${page}`);
        const $ = cheerio.load(response.data);
        const element = $('.venutama');

        let anime_list = [];
        let title, release, genre, link;

        $(element).find('.kover').each((i, e) => {
            
        title = $(e).find('.content > h2 > a').attr('title');
        release = $(e).find('.content > p').text().trim().split('Genre')[0].split('Admin')[1].trim();
        genre = $(e).find('.content > p').text().trim().split('Genre')[1].trim().split(', ');
        link = {
                endpoint: $(e).find('.thumb > a').attr('href').replace('https://kusonime.com/', ''),
                url : $(e).find('.thumb > a').attr('href'),
                thumbnail: $(e).find('.thumbz > img').attr('src')
                };
        
            anime_list.push({
                title,
                release,
                genre,
                link
            });

        });

        await cache.page.set(`${page}`, { data: anime_list, timestamp: Date.now()})
        const cacheData = cache.page.get(`${page}`)
        res.send(cacheData);
        //console.log($('.kover:nth-of-type(2)').find('.thumb > a').attr('href'));

    } catch (err) {

        console.log(err);
        res.send({success: false, message: err.message});

    };

});

/* Rekomendasi */
router.get('/rekomendasi', async (req, res) => {

    try {
        /* Get data from cache*/
        const caches = await cache.rekomendasi.get('rekomendasi')
        const hit = (Date.now() - (caches?.timestamp || 0) < (cacheTime.rekomendasi * 3600000)) ? true : false
        if (hit) return res.send(caches)

        /* Get Data */
        const response = await Axios('/');
        const $ = cheerio.load(response.data);
        const element = $('.venutama');

        /* find n each data */
        let rekom = [];
        let title, link;

        $(element).find('.recomx > ul > li > .zeeb').each((i, e) => {

            title = $(e).find('img').attr('title');
            link = {
                endpoint: $(e).find('a').attr('href').replace('https://kusonime.com/', ''),
                url: $(e).find('a').attr('href'),
                thumbnail: $(e).find('img').attr('src')
            };

            rekom.push({
                title,
                link
            });
            
        });

      await cache.rekomendasi.set('rekomendasi', { data: rekom, timestamp: Date.now()})
      const cacheData = cache.rekomendasi.get('rekomendasi')
      res.send(cacheData);

    } catch (err) {

        res.send({success: false, error: err.error});

    };

});

/* List Genre */
router.get('/genres', async (req, res) => {

    try {
        /* Get data from cache*/
        const caches = await cache.genres.get('genres')
        const hit = (Date.now() - (caches?.timestamp || 0) < (cacheTime.genres * 3600000)) ? true : false
        if (hit) return res.send(caches)

        const response = await Axios('');
        const $ = cheerio.load(response.data);
        const element = $('.vezone .section:nth-of-type(3)');

        let listAnime = [];
        let title, link;

        $(element).find('a').each((i, e) => {

            title = $(e).text();
            link = {
                endpoint: $(e).attr('href'),
                url: $(e).attr('href').replace('https://kusonime.com/', '')
            }


            listAnime.push({

                title,
                link
                
            });

        });


        listAnime.shift();
        await cache.genres.set('genres', { data: listAnime, timestamp: Date.now()})
        const cacheData = cache.genres.get('genres')
        res.send(cacheData);

    } catch (err) {
        res.send({success: false, error: err.message});

    }

});

/* Genre */
router.get('/genres/:plug/:page', async (req, res) => {
    try {

        /* Get Data */
        const plug = req.params.plug;
        const page = req.params.page;

        /* Get data from cache*/
        const caches = await cache.genres.get(`${plug}.${page}`)
        const hit = (Date.now() - (caches?.timestamp || 0) < (cacheTime.genres * 3600000)) ? true : false
        if (hit) return res.send(caches)

        const response = await Axios(`genres/${plug}/page/${page}`);
        const $ = cheerio.load(response.data);
        const element = $('.venutama');

        /* Scrap Data */
        let anime_list = [];
        let title, release, genre, link;

        $(element).find('.kover').each((i, e) => {

        title = $(e).find('.content > h2 > a').attr('title');
        release = $(e).find('.content > p').text().trim().split('Genre')[0].split('Admin')[1].trim();
        genre = $(e).find('.content > p').text().trim().split('Genre')[1].trim().split(', ');
        link = {
                endpoint: $(e).find('.thumb > a').attr('href').replace('https://kusonime.com/', ''),
                url : $(e).find('.thumb > a').attr('href'),
                thumbnail: $(e).find('.thumbz > img').attr('src')
                };
        
            anime_list.push({
                title,
                release,
                genre,
                link
            });

        });

      await cache.genres.set(`${plug}.${page}`, { data: anime_list, timestamp: Date.now()})
      const cacheData = cache.genres.get(`${plug}.${page}`)
      res.send(cacheData);

    } catch (error) {

        res.send({success: false, error: error});

    };
});

/* List Seasons */
router.get('/seasons', async (req, res) => {
    try {

        /* Get data from cache*/
        const caches = await cache.seasons.get('seasons')
        const hit = (Date.now() - (caches?.timestamp || 0) < (cacheTime.seasons * 3600000)) ? true : false
        if (hit) return res.send(caches)

        const response = await Axios('');
        const $ = cheerio.load(response.data);
        const element = $('.vezone .section:nth-of-type(2)');

        let listAnime = [];
        let title, link;

        $(element).find('a').each((i, e) => {

            title = $(e).text();
            link = {
                endpoint: $(e).attr('href').replace('https://kusonime.com/', ''),
                url: $(e).attr('href')
            };


            listAnime.push({

                title,
                link
                
            });

        });


        listAnime.shift();
        await cache.seasons.set('seasons', { data: listAnime, timestamp: Date.now()})
        const cacheData = cache.seasons.get('seasons')
        res.send(cacheData);

    } catch (err) {

        res.send({success: false, error: err.message});

    };
});

/* Season */
router.get('/seasons/:plug/:page', async (req, res) => {
    try {

        /* Get Data */
        const plug = req.params.plug;
        const page = req.params.page;

        /* Get data from cache*/
        const caches = await cache.seasons.get(`${plug}.${page}`)
        const hit = (Date.now() - (caches?.timestamp || 0) < (cacheTime.seasons * 3600000)) ? true : false
        if (hit) return res.send(caches)

        const response = await Axios(`seasons/${plug}/page/${page}`);
        const $ = cheerio.load(response.data);
        const element = $('.venutama');

        /* Scrap Data */
        let anime_list = [];
        let title, release, genre, link;

        $(element).find('.kover').each((i, e) => {

        title = $(e).find('.content > h2 > a').attr('title');
        release = $(e).find('.content > p').text().trim().split('Genre')[0].split('Admin')[1].trim();
        genre = $(e).find('.content > p').text().trim().split('Genre')[1].trim().split(', ');
        link = {
                endpoint: $(e).find('.thumb > a').attr('href').replace('https://kusonime.com/', ''),
                url : $(e).find('.thumb > a').attr('href'),
                thumbnail: $(e).find('.thumbz > img').attr('src')
                };
        
            anime_list.push({
                title,
                release,
                genre,
                link
            });

        });

      await cache.seasons.set(`${plug}.${page}`, { data: anime_list, timestamp: Date.now()})
      const cacheData = cache.seasons.get(`${plug}.${page}`)
      res.send(cacheData);

    } catch (error) {

        res.send({success: false, error: error});

    };
});

/* Cari */
router.get('/cari/:plug', async (req, res) => {
    try {

        const plug = req.params.plug;

        /* Get data from cache*/
        const caches = await cache.search.get(`${plug.toLowerCase()}`)
        const hit = (Date.now() - (caches?.timestamp || 0) < (cacheTime.search * 3600000)) ? true : false
        if (hit) return res.send(caches)

        const response = await Axios(`?s=${plug}`);
        const $ = cheerio.load(response.data);
        const element = $('.venutama');

            /* Scrap Data */
            let anime_list = [];
            let title, release, genre, link;
    
            $(element).find('.kover').each((i, e) => {
    
            title = $(e).find('.content > h2 > a').attr('title');
            release = $(e).find('.content > p').text().trim().split('Genre')[0].split('Admin')[1].trim();
            genre = $(e).find('.content > p').text().trim().split('Genre')[1].trim().split(', ');
            link = {
                    endpoint: $(e).find('.thumb > a').attr('href').replace('https://kusonime.com/', ''),
                    url : $(e).find('.thumb > a').attr('href'),
                    thumbnail: $(e).find('.thumbz > img').attr('src')
                    };
            
                anime_list.push({
                    title,
                    release,
                    genre,
                    link
                });
    
            });

        await cache.search.set(`${plug.toLowerCase()}`, { data: anime_list, timestamp: Date.now()})
        const cacheData = cache.search.get(`${plug.toLowerCase()}`)
        res.send(cacheData);
        } catch (err) {
            
            res.send({success: false, error: err.message});

        };
});



module.exports = router;