const express = require('express');
const router = express.Router({ mergeParams: true })

const responseUtil = require('../../module/responseUtil')
const returnCode = require('../../model/returnCode')
const returnMessage = require('../../../config/returnMessage')

const jwt = require('../../module/jwt');

const myPlaylist = require('../../model/schema/myPlaylist');
const playlist = require('../../model/schema/playlist');

router.get('/', async (req, res) => {

    const ID = jwt.verify(req.headers.authorization);

    if (ID > 0) {
        const result = (await myPlaylist.find({ userIdx: ID }))[0];
        if(!result){
            res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.LIKE_SONG_SELECT_FAIL));
        }else{
            const result2 = (await playlist.find({ _id: result.likePlaylist }))[0];
            res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.LIKE_SONG_SELECT_SUCCESS, result2));
        }
    }
    //비회원일 경우
    else if (ID == -1) {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, returnMessage.NOT_CORRECT_TOKEN_USER));
    }
    //토큰 검증 실패
    else {
        res.status(200).send(responseUtil.successFalse(returnCode.UNAUTHORIZED, returnMessage.EMPTY_TOKEN));
    }
})

module.exports = router;