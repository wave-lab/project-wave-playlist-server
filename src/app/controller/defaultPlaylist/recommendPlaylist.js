const express = require('express');
const router = express.Router({ mergeParams: true })

const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')

const jwt = require('../../module/jwt');
const pool = require('../../module/pool');

const song = require('../../model/schema/song');

router.get('/', async (req, res) => {

    const ID = await jwt.verify(req.headers.authorization);

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

    // if (ID != -1) {
    //     if (!inputUserIdx) {
    //         res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
    //     }
    //     else {
    //         const artistSelectQuery = 'SELECT originArtistIdx FROM user_originArtist WHERE userIdx = ?';
    //         const artistSelectResult = await pool.queryParam_Arr(artistSelectQuery, inputUserIdx);

    //         console.log(artistSelectResult);

    //         if (!artistSelectResult) {
    //             res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.ARTIST_SELECT_FAIL));
    //         }
    //         else {

    //             for (let i = 0; i < artistSelectResult.length; i++) {
    //                 await song.find({ originArtistIdx: artistSelectResult[i].originArtistIdx }, async function (err, songResult) {
    //                     if (err) {
    //                         res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.RECOMMEND_SELECT_FAIL));
    //                     } else {
    //                         result.push(songResult);
    //                     }
    //                 }).sort({ streamCount: -1 }).limit(30);;
    //             }

    //             if (!result) {
    //                 res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.RECOMMEND_SELECT_FAIL));
    //             } else {
    //                 res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.RECOMMEND_SELECT_SUCCESS, result));
    //             }
    //         }
    //     }
    // } else {
    //     res.status(200).send(resUtil.successFalse(resCode.UNAUTHORIZED, resMessage.EMPTY_TOKEN));
    // }
})

module.exports = router;