const router = require('express').Router();
const cheerio = require('cheerio');
const Axios = require('../tools');
const cache = require('../database')
const cacheTime = require('../cacheTime.json')

router.get('/:plug', async (req, res) => {
    try {

        const plug = req.params.plug;

        /* Get data from cache*/
        const caches = await cache.anime.get(`${plug}`)
        const hit = (Date.now() - (caches?.timestamp || 0) < (cacheTime.anime * 3600000)) ? true : false
        if (hit) return res.send(caches.data)

        const response = await Axios(plug);
        const $ = cheerio.load(response.data);
        const element = $('.venser');

        
        let obj = {};
        
        let temp_genre = [];
        $(element).find('.info > p:nth-of-type(2) > a').each((i, e) => {
            temp_genre.push({
                name: $(e).text(), 
                url: $(e).attr('href'),
                endpoint: $(e).attr('href').replace('https://kusonime.com/', '')
            });
        });
            
        
        const ress = [];
        $(element).find('.smokeddl').each((ind, ele) => {

            const temp_res = [];
            $(ele).find('.smokeurl').each((i, e) => {
                
                const temp_dl = [];
                $(e).find('a').each((ix, ex) => {
                    temp_dl.push({
                        platform: $(ex).text(),
                        link: $(ex).attr('href')
                    });
                });

                temp_res.push({
                    resolusi: $(e).find('strong').text().toLowerCase(),
                    link_download: temp_dl
                });
            });

            ress.push([$(ele).find('.smokettl').text(), temp_res]);

        });


        obj.title = $(element).find('.post-thumb > img').attr('title');
        obj.thumbnail = $(element).find('.post-thumb > img').attr('src');
        obj.japanese = $(element).find('.info > p:nth-of-type(1)').text().split(':')[1].trim();
        obj.genre = temp_genre;
        obj.season = {
            name: $(element).find('.info > p:nth-of-type(3) > a').text(), 
            url: $(element).find('.info > p:nth-of-type(3) > a').attr('href'),
            endpoint: $(element).find('.info > p:nth-of-type(3) > a').attr('href').replace('https://kusonime.com/', '')
        };
        obj.producers = $(element).find('.info > p:nth-of-type(4)').text().split(':')[1].trim().split(', ');
        obj.type = $(element).find('.info > p:nth-of-type(5)').text().split(':')[1].trim();
        obj.status = $(element).find('.info > p:nth-of-type(6)').text().split(':')[1].trim();
        obj.total_eps = $(element).find('.info > p:nth-of-type(7)').text().split(':')[1].trim();
        obj.score = '⭐' + $(element).find('.info > p:nth-of-type(8)').text().split(':')[1].trim();
        obj.durasi = $(element).find('.info > p:nth-of-type(9)').text().split(':')[1].trim();
        obj.release = $(element).find('.info > p:nth-of-type(10)').text().split(':')[1].trim();
        obj.sinopsis = $(element).find('.lexot > p:nth-of-type(1)').text().trim();

        //just delete annoying div
        ress.pop();
        obj.list_download = ress;


        await cache.anime.set(`${plug}`, { data: obj, timestamp: Date.now()})
        const cacheData = cache.anime.get(`${plug}`)
        res.send(cacheData.data);

    } catch (error) {

        res.send({success : false, error: error.message});

    }
});

module.exports = router;