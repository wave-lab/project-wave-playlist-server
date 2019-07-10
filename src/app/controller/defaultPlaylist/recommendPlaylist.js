const express = require('express');
const router = express.Router({ mergeParams: true })

const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')

const jwt = require('../../module/jwt');
const pool = require('../../module/pool');

const song = require('../../model/schema/song');

router.get('/', async (req, res) => {

    const ID = jwt.verify(req.headers.authorization);

    if (ID != -1) {

        const artistSelectQuery = 'SELECT originArtistIdx FROM user_originArtist WHERE userIdx = ?';
        const artistSelectResult = await pool.queryParam_Arr(artistSelectQuery, ID);

        let query = {
            $or: []
        };

        for (let i = 0; i < artistSelectResult.length; i++) {
            query.$or.push({
                originArtistIdx: artistSelectResult[i].originArtistIdx
            });
        }

        const result = await song.find(query).sort({ streamCount: -1 }).limit(30);

        res.status(200).send(resUtil.successTrue(resCode.OK, "추천곡 조회", result));
    } else {
        res.status(200).send(resUtil.successFalse(resCode.UNAUTHORIZED, resMessage.EMPTY_TOKEN));
    }
})

module.exports = router;