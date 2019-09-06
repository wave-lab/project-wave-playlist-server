const express = require('express');
const router = express.Router({ mergeParams: true })

const responseUtil = require('../../module/responseUtil')
const returnCode = require('../../model/returnCode')
const returnMessage = require('../../../config/returnMessage')

const jwt = require('../../module/jwt');

const myPlaylist = require('../../model/schema/myPlaylist');
const playlist = require('../../model/schema/playlist');
const playlistModules = require('../../module/playlistModules');

router.get('/', async (req, res) => {

    const ID = jwt.verify(req.headers.authorization);
    const status = req.query.status;

    if(ID > 0) { //회원일 경우
        //적중하고 업로드 된 곡들 조회
        const hitsIdx = (await playlistModules.getPlayList(ID, 'hits'))._id;
        console.log(hitsIdx);
        if (status == 'success') {
            let successQuery = {
                '_id': hitsIdx,
                'songList.songStatus': 1
            }
            const getSuccessResult = (await playlist.find(successQuery))[0];
            console.log(getSuccessResult);
            if(!getSuccessResult){
                res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.PLAYLIST_SELECT_FAIL));
            }else{
                res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.PLAYLIST_SELECT_SUCCESS, getSuccessResult));
            }
        }
        //업로드 여부 상관없이 적중된 곡들 다 조회
        else {
            const getAllResult = (await playlistModules.getSongList(hitsIdx))
            if(!getAllResult){
                res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.PLAYLIST_SELECT_FAIL, getAllResult));
            }else{
                res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.PLAYLIST_SELECT_SUCCESS, getAllResult));
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