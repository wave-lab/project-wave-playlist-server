const express = require('express');
const router = express.Router({ mergeParams: true })

const responseUtil = require('../../module/responseUtil')
const returnCode = require('../../model/returnCode')
const returnMessage = require('../../../config/returnMessage')

const jwt = require('../../module/jwt');
const pool = require('../../module/pool');

const song = require('../../model/schema/song');

router.get('/', async (req, res) => {

    const ID = jwt.verify(req.headers.authorization);

    if(ID > 0) { //회원일 경우
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

        if(!result){
            res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.RECOMMEND_SELECT_FAIL));
        }else{
            res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.RECOMMEND_SELECT_SUCCESS, result));
        }
    }else if(ID == -1) { //비회원일 경우
        res.status(200).send(responseUtil.successFalse(returnCode.NOT_FOUND, returnMessage.NOT_CORRECT_TOKEN_USER));
    }
    else { //토큰 검증 실패
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, returnMessage.EMPTY_TOKEN));
    }

})

module.exports = router;