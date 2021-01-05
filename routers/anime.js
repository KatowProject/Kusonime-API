const router = require('express').Router();
const cheerio = require('cheerio');
const Axios = require('../tools');

router.get('/:plug', async (req, res) => {
    try {

        const plug = req.params.plug;
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
            
        
        let temp_res = [];
        $(element).find('.smokeurl').each((ind, ele) => {
                let temp_dl = [];

                $(ele).find('a').each((i, e) => {
                    temp_dl.push({platform: $(e).text(), link: $(e).attr('href')});
                });

                temp_res.push({
                    resolusi: $(ele).find('strong').text().toLowerCase(),
                    link_download: temp_dl
                });
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
        obj.list_download = temp_res;


        res.send(obj);

    } catch (error) {

        res.send({success : false, error: error.message});

    }
});

module.exports = router;