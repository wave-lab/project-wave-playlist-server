const express = require('express');
const router = express.Router({ mergeParams: true })

const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')
const playlistModules = require('../../module/playlistModules') //플레이리스트 조회 모듈

const pool = require('../../module/pool');
const top10 = require('../../model/schema/top10');

router.get('/', async (req, res) => {

    const result = new Array();

    const result1 = await top10.find({ top10Category: "장르" }).sort({checkTime : -1}).limit(8);
    const result2 = await top10.find({ top10Category: "분위기" }).sort({checkTime : -1}).limit(8);

    result.push(result1);
    result.push(result2);
    
    res.status(200).send(resUtil.successTrue(resCode.OK, "TOP 10 조회", result));

    // const inputGenreName = req.query.genre;
    // const inputMoodName = req.query.mood; 

    // if(!inputGenreName && !inputMoodName) {
    //     res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
    // }
    // else {
    //     if(!inputMoodName) {
    //         top10.find({top10Name : inputGenreName}, async function(err, top10listResult) {
    //             if(err) {
    //                 res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.TOP10LIST_SELECT_FAIL));
    //             } else { 
    //                 inputPlaylistIdx = top10listResult[0].playlistIdx;
    //                 if(!inputPlaylistIdx) {
    //                     res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
    //                 }
    //                 else {
    //                     const listSelectResult = await playlistModules.getSongList(top10listResult[0].playlistIdx)//플레이리스트 조회 모듈 사용

    //                     if(!listSelectResult) {
    //                         res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.PLAYLIST_SELECT_FAIL));
    //                     } else {
    //                         res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.PLAYLIST_SELECT_SUCCESS, listSelectResult));                        
    //                     }

    //                 }
    //             }
    //         }).sort({checkTime : -1}).limit(1);
    //     }
    //     else if(!inputGenreName) {
    //         top10.find({top10Name : inputMoodName}, async function(err, top10listResult) {
    //             if(err) {
    //                 console.log(err);
    //                 res.status(200).send(resUtil.successTrue(resCode.BAD_REQUEST, resMessage.TOP10_SELECT_SUCCESS, listSelectResult));
    //             } else { 
    //                 inputPlaylistIdx = top10List10listResult[0].playlistIdx;
    //                 if(!inputPlaylistIdx) {
    //                     res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
    //                 }
    //                 else {
    //                     const listSelectResult = await playlistModules.getSongList(top10listResult[0].playlistIdx)  ;

    //                     if(!listSelectResult) {
    //                         res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.PLAYLIST_SELECT_FAIL));
    //                     } else {
    //                         res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.PLAYLIST_SELECT_SUCCESS, listSelectResult));                        
    //                     }

    //                 }
    //             }
    //         }).sort({checkTime : -1}).limit(1);
    //     }
    //     else {
    //         res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
    //     }
    // }
})

module.exports = router;