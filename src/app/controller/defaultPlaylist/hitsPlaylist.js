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
    const status = req.query.status;

    if(ID > 0) { //회원일 경우
        const result = (await myPlaylist.find({ userIdx: ID }))[0];
        //적중 성공 플레이리스트 조회
        if (status == 'success') {
            let query = {
                '_id': result.hitsPlaylist,
                'songList.songStatus': 1
            }
            const result2 = (await playlist.find(query))[0];
            if(!result2){
                res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.PLAYLIST_SELECT_FAIL));
            }else{
                res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.PLAYLIST_SELECT_SUCCESS, result2));
            }
        }
        //평가 적중 결과 플레이리스트 조회
        else {
            const result2 = (await playlist.find({ _id: result.hitsPlaylist }))[0];
            if(!result2){
                res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.PLAYLIST_SELECT_FAIL, result2));
            }else{
                res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.PLAYLIST_SELECT_SUCCESS, result2));
            }
        }
    }else if(ID == -1) { //비회원일 경우
        res.status(200).send(responseUtil.successFalse(returnCode.NOT_FOUND, returnMessage.NOT_CORRECT_TOKEN_USER));
    }
    else { //토큰 검증 실패
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, returnMessage.EMPTY_TOKEN));
    }

})

module.exports = router;