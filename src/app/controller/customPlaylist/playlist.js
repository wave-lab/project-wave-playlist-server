const express = require('express');
const router = express.Router();

const responseUtil = require('../../module/responseUtil')
const returnCode = require('../../model/returnCode')
const returnMessage = require('../../../config/returnMessage')
const playlistModules = require('../../module/playlistModules');

const jwt = require('../../module/jwt');

/*
playlist에 있는 곡 조회
METHOD       : GET
URL          : /custom/songs/:playlistIdx
PARAMETER    : playlistIdx = playlist테이블의 _id(idx)값
*/
router.get('/', async (req, res) => {
    const inputPlaylistIdx = req.params.playlistIdx;

    //ID = userIdx
    let ID = jwt.verify(req.headers.authorization);

    //회원일 경우
    if (ID > 0) {
        if(!inputPlaylistIdx) {
            res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.OUT_OF_VALUE));
        }
        else {
            const getSongListResult = await playlistModules.getSongList(inputPlaylistIdx);
            if(getSongListResult == undefined) {
                res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.PLAYLIST_SELECT_FAIL));
            } else {
                res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.PLAYLIST_SELECT_SUCCESS, getSongListResult));                        
            }
        }
    }

    //비회원일 경우
    else if (ID == -1) {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "로그인을 해 주세요"));
    }

    //토큰 검증 실패
    else {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "access denied"));
    }
})

/*
playlist 에 노래 추가
METHOD       : POST
URL          : /custom/songs
BODY         : playlistIdx = playlist의 _id
               songIdx = song의 _id
*/
router.post('/', async(req,res)=>{
    const songIdx = req.body.songIdx;
    const playlistIdx = req.body.playlistIdx;
    
    //ID = userIdx
    let ID = jwt.verify(req.headers.authorization);

    //회원일 경우
    if (ID > 0) {
        if(!songIdx || !playlistIdx) {
            res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.ADD_SONGS_TO_PLAYLIST_FAIL))
        }
        else {
            await playlistModules.addSongToPlaylist(playlistIdx, songIdx)
            res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.ADD_SONGS_TO_PLAYLIST_SUCCESS));
        }
    }

    //비회원일 경우
    else if (ID == -1) {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "로그인을 해 주세요"));
    }

    //토큰 검증 실패
    else {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "access denied"));
    }
})

/*
playlist 에서 노래 삭제
METHOD       : DELETE
URL          : /custom/songs
BODY         : playlistIdx, songIdx
*/

router.delete('/', async (req,res)=>{
    const songIdx = req.body.songIdx;
    const playlistIdx = req.body.playlistIdx;

    //ID = userIdx
    let ID = jwt.verify(req.headers.authorization);

    //회원일 경우
    if (ID > 0) {
        if(!songIdx || !playlistIdx) {
            res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.OUT_OF_VALUE))
        }
        else {
            await playlistModules.deleteSongFromPlaylist(playlistIdx,songIdx);
            res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.DELETE_SONGS_FROM_PLAYLIST_SUCCESS));
        }
    }
    //비회원일 경우
    else if (ID == -1) {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "로그인을 해 주세요"));
    }
    //토큰 검증 실패
    else {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "access denied"));
    }
})

module.exports = router;