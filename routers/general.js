const router = require('express').Router();
const cheerio = require('cheerio');
const Axios = require('../tools');


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

        res.send(anime_list);
        //console.log($('.kover:nth-of-type(2)').find('.thumb > a').attr('href'));

    } catch (err) {

        console.log(err);
        res.send({success: false, message: err.message});

    };

});

/* Rekomendasi */
router.get('/rekomendasi', async (req, res) => {

    try {

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

        res.send(rekom);

    } catch (err) {   

        res.send({success: false, error: err.error});

    };

});

/* List Genre */
router.get('/genres', async (req, res) => {

    try {

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
        res.send(listAnime);

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

        res.send(anime_list);

    } catch (error) {

        res.send({success: false, error: error});

    };
});

/* List Seasons */
router.get('/seasons', async (req, res) => {
    try {

        const response = await Axios('');
        const $ = cheerio.load(response.data);
        const element = $('.vezone .section:nth-of-type(2)');

        let listAnime = [];
        let title, link;

        $(element).find('a').each((i, e) => {

            title = $(e).text();
            link = {
                endpoint: $(e).attr('href'),
                url: $(e).attr('href').replace('https://kusonime.com/', '')
            };


            listAnime.push({

                title,
                link
                
            });

        });


        listAnime.shift();
        res.send(listAnime);

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

        res.send(anime_list);

    } catch (error) {

        res.send({success: false, error: error});

    };
});

/* Cari */
router.get('/cari/:plug', async (req, res) => {
    try {

        const plug = req.params.plug;

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
    
            res.send(anime_list);
        } catch (err) {
            
            res.send({success: false, error: err.message});

        };
});



module.exports = router;