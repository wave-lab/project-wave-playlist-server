const express = require('express');
const router = express.Router({ mergeParams: true })

const jwt = require('../../module/jwt');
const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');
const pool = require('../../module/pool');

const song = require('../../model/schema/song');
const playlistModules = require('../../module/playlistModules');

/**
 * 내가 평가한 곡 리스트 조회
 */

router.get('/', async (req, res) => {

    //ID = userIdx
    let ID = jwt.verify(req.headers.authorization);

    const status = req.query.status;

    //회원일 경우
    if (ID > 0) {
        const myPlaylist = await playlistModules.searchMyPlaylist(ID); // 사용자의 플레이리스트 모두 가져옴

        const uploadSongs = await playlistModules.getSongList(myPlaylist.uploadPlaylist); // 업로드곡 리스트의 노래들
        const waitSongList = new Array();
        const passSongList = new Array();
        const failSongList = new Array();

        for (var i = 0; i < uploadSongs.length; i++) { // 곡의 상태를 판별하여 곡정보를 담은 배열을 보내줌
            if (uploadSongs[i].songStatus == 0) { // 유보 상태의 곡들
                waitSongList.push(uploadSongs[i]);
            }
            else if (uploadSongs[i].songStatus == 1) { // 패스 상태의 곡들
                passSongList.push(uploadSongs[i]);
            }
            else { // 실패 상태의 곡들
                failSongList.push(uploadSongs[i]);
            }
        }

        if (status == 'wait') {
            res.status(200).send(responseUtil.successTrue(returnCode.OK, '대기 곡 조회', waitSongList));
        } else if (status == 'pass') {
            res.status(200).send(responseUtil.successTrue(returnCode.OK, '통과 곡 조회', passSongList));
        } else if (status == 'fail') {
            res.status(200).send(responseUtil.successTrue(returnCode.OK, '탈락 곡 조회', failSongList));
        } else {
            res.status(200).send(responseUtil.successTrue(returnCode.OK, '평가 완료 곡 조회', uploadSongs));
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