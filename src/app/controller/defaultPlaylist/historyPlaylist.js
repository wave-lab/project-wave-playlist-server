const express = require('express');
const router = express.Router({mergeParams: true});
const moment = require('moment');

const timeFormat = moment().add(9, 'hours').format('YYYY-MM-DD HH:mm:ss');
const responseUtil = require('../../module/responseUtil')
const returnCode = require('../../model/returnCode')
const returnMessage = require('../../../config/returnMessage')

const jwt = require('../../module/jwt');
const song = require('../../model/schema/song');
const history = require('../../model/schema/history');

/*
기본 history에 곡 추가
METHOD       : POST
URL          : /pl/history
BODY         : songIdx = song의 인덱스
TOKEN        : ID = userIdx
*/

router.post('/', async (req, res) => {
    const inputSongIdx = req.body.songIdx
    const ID = jwt.verify(req.headers.authorization);
    if(ID > 0) {
        if(!inputSongIdx) {
            res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.OUT_OF_VALUE));
        }
        else {
            const songResult = await song.find({_id: inputSongIdx});
            if(songResult.length == 0) {
                res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.SONG_SELECT_FAIL));
            } else {
                const historyResult = await history.find({$and : [{"userIdx" : ID}, {"songIdx" : inputSongIdx}]});
                if(historyResult.length == 0) {
                    await history.create({
                        userIdx : ID,
                        songIdx : inputSongIdx,
                        songInfo : songResult,
                        playCount : 1,
                        playTime : timeFormat
                    }, async function(err, insertResult) {
                        if(err) {
                            res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.HISTORY_INSERT_FAIL));
                        } else {
                            res.status(200).send(responseUtil.successTrue(returnCode.BAD_REQUEST, returnMessage.HISTORY_INSERT_SUCCESS, insertResult));
                        }
                    })
                } else {    
                    await history.updateOne({$and : [{"userIdx" : ID}, {"songIdx" : inputSongIdx}]}, {$set : {"playCount" : historyResult[0].playCount + 1}});
                    await history.updateOne({$and : [{"userIdx" : ID}, {"songIdx" : inputSongIdx}]}, {$set : {"playTime" : timeFormat}});
                    
                    res.status(200).send(responseUtil.successTrue(returnCode.CREATED, returnMessage.CUSTOM_CREATE_SUCCESS));
                }
                
            }
        }
    }
    //비회원일 경우
    else if (ID == -1) {
        res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, "NO AUTHORIZATION"));
    }
    //토큰 검증 실패
    else {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "access denied"));
    }
})

/*
history 조회
METHOD       : GET
URL          : /playlists/default/history/user/:userIdx
AUTHORIZATION : /pl/history
*/
router.get('/', async (req, res) => {
    const ID = jwt.verify(req.headers.authorization);

    if(ID > 0) {
        const result = await history.find({
            userIdx : ID
        })
        res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.HISTORY_SELECT_SUCCESS, result));
    }
    //비회원일 경우
    else if (ID == -1) {
        res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, "NO AUTHORIZATION"));
    }
    //토큰 검증 실패
    else {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "access denied"));
    }
})

module.exports = router;