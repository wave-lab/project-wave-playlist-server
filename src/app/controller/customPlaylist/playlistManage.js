const express = require('express');
const router = express.Router({mergeParams: true})

const jwt = require('../../module/jwt');
const responseUtil = require('../../module/responseUtil')
const returnCode = require('../../model/returnCode')
const returnMessage = require('../../../config/returnMessage')

const playlistModules = require('../../module/playlistModules') //myPlaylist 조회 모듈
const pool = require('../../module/pool');

const playlist = require('../../model/schema/playlist');
const myPlaylist = require('../../model/schema/myPlaylist');
/*
플레이리스트 추가
METHOD       : POST
URL          : /custom/manage
BODY         : {
    "playlistName" : "플레이리스트 이름",
    "playlistComment" : "플레이스트 설명"
}
*/
router.post('/', async (req, res) => {
    const inputName = req.body.playlistName;
    const inputComment = req.body.playlistComment;

    //ID = userIdx
    let ID = jwt.verify(req.headers.authorization);

    //회원일 경우
    if (ID > 0) {
        const playlistSelect = await playlist.find({$and : [{"userIdx" : ID}, {"playlistName" : inputName}]});
    if(playlistSelect.length != 0) {
        res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, responseMessage.ALREADY_CUSTOM_PLAYLIST));
    } else {
        await playlist.create({
            playlistName : inputName,
            playlistComment : inputComment,
            userIdx : ID
        }, async function(err, playlistResult){
            if(err) {
                res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, responseMessage.CUSTOM_CREATE_FAIL));
            }
            else {    
                const myListResult = (await myPlaylist.find({"userIdx" : ID}))[0];
                const myCustom = myListResult.customPlaylist
                const addPlaylist = playlistResult._id;
    
                await myCustom.push(addPlaylist); // (await songList.push(addSong)에서 unshift로 바꿈(앞에 넣기위해서))->상관없음
                await myPlaylist.updateOne({"_id" : myListResult._id}, {$set : {"customPlaylist" : myCustom}});
    
                const addCustomResult = (await myPlaylist.find({"userIdx" : ID}));
                res.status(200).send(responseUtil.successTrue(returnCode.OK, responseMessage.CUSTOM_CREATE_SUCCESS, addCustomResult[0]));
            }
        })
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
});


/*
플레이리스트 삭제
METHOD       : DELETE
URL          : /playlists/manage/:playlistIdx
PARAMETER    : playlistIdx = 삭제 요청한 플레이리스트의 인덱스
*/
router.delete('/', async (req, res) => {
    const inputPlaylistIdx = req.params.playlistIdx;

    //ID = userIdx
    let ID = jwt.verify(req.headers.authorization);

    //회원일 경우
    if (ID > 0) {
        if(!inputPlaylistIdx) {
            res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } else {
            const playlistSelect = await playlist.find({$and : [{"userIdx" : ID}, {"_id" : inputPlaylistIdx}]});
            if(playlistSelect.length == 0) {
                res.status(200).send(resUtil.successTrue(resCode.BAD_REQUEST, resMessage.NOT_EXIST_CUSTOM_PLAYLIST));
            }
            else {
                const getMyPlaylist = (await myPlaylist.find({"userIdx" : ID}))[0];
                const myCustom = getMyPlaylist.customPlaylist
    
                await myCustom.pull(inputPlaylistIdx);
                await myPlaylist.updateOne({"_id" : getMyPlaylist._id}, {$set : {"customPlaylist" : myCustom}});
    
                await playlist.deleteOne({"_id" : inputPlaylistIdx});
    
                const deleteCustomResult = (await myPlaylist.find({"userIdx" : ID}))[0];
                res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.PLAYLIST_DELETE_SUCCESS, deleteCustomResult));
            }
        }
    }
    //비회원일 경우
    else if (ID == -1) {
        res.status(200).send(resUtil.successFalse(resCode.FORBIDDEN, "로그인을 해 주세요"));
    }
    //토큰 검증 실패
    else {
        res.status(200).send(resUtil.successFalse(resCode.FORBIDDEN, "access denied"));
    }
});

module.exports = router;