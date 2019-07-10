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
        //0 = wait
        //1 = pass
        //2 = fail
        let query;
        if (status == 'wait') {
            query = {
                '_id': result.uploadPlaylist,
                'songList.songStatus': 0
            }
            returnMessage = '진행 곡 조회'
        } else if (status == 'pass') {
            query = {
                '_id': result.uploadPlaylist,
                'songList.songStatus': 1
            }
            returnMessage = '통과 곡 조회'
        } else if (status == 'fail') {
            query = {
                '_id': result.uploadPlaylist,
                'songList.songStatus': 2
            }
            returnMessage = '탈락 곡 조회'
        } else {
            query = {
                '_id': result.uploadPlaylist
            }
            returnMessage = '업로드 곡 조회'
        }
        const result2 = (await playlist.find(query))[0];
        res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage, result2));

    }else if(ID == -1) { //비회원일 경우
        res.status(200).send(responseUtil.successFalse(returnCode.NOT_FOUND, returnMessage.NOT_CORRECT_TOKEN_USER));
    }
    else { //토큰 검증 실패
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, returnMessage.EMPTY_TOKEN));
    }

})

module.exports = router;