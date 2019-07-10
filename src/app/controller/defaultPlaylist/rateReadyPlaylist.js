const express = require('express');
const router = express.Router({ mergeParams: true })

const jwt = require('../../module/jwt');
const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');

const myPlaylist = require('../../model/schema/myPlaylist');
const playlist = require('../../model/schema/playlist');
const song = require('../../model/schema/song');

router.get('/', async (req, res) => {

    const ID = jwt.verify(req.headers.authorization);

    //회원일 경우
    if (ID > 0) {
        const result = (await myPlaylist.find({ userIdx: ID }))[0];
        if (!result){
            res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.PLAYLIST_SELECT_FAIL));
        }else{
            const result2 = (await playlist.find({ _id: result.rateReadyPlaylist }))[0];
            if(!result2){
                res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.RATE_READY_PLAYLIST_FAIL));
            }else{
                res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.RATE_READY_PLAYLIST_SUCCESS, result2));
            }
        }
    }
    //비회원일 경우
    else {
        const rateReadySongs = (await song.find({ songStatus: 0 }).limit(10));
        const rateReadySongs = (await song.find({ songStatus: 0 }).limit(10));
        if(!rateReadySongs){
            res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.RATE_READY_PLAYLIST_FAIL));
        }else{
            res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.RATE_READY_PLAYLIST_SUCCESS, rateReadySongs));
        }
    }
})

module.exports = router;