const express = require('express');
const router = express.Router();
const jwt = require('../../module/jwt');
const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');
const playlistModules = require('../../module/playlistModules');
const playlist = require('../../model/schema/playlist');

router.get('/', async (req, res) => {

    const ID = jwt.verify(req.headers.authorization);

    //회원일 경우
    if (ID > 0) {
        const myPlaylist = await playlistModules.searchMyPlaylist(ID);

        const customArray = myPlaylist.customPlaylist;
        let result = new Array();

        for (let i = 0; i < customArray.length; i++) {
            let result1 = (await playlist.find({ _id: customArray[i] }))[0];
            let songList = await playlistModules.getSongList(customArray[i]);
            let thumbnail = new Array();

            for (j = 0; j < songList.length; j++) {
                thumbnail.push(songList[j].artwork);
            }
            let data = {
                _id: result1._id,
                playlistName: result1.playlistName,
                playlistComment: result1.playlistComment,
                userIdx: result1.userIdx,
                thumbnail: thumbnail
            }
            result.push(data);
        }
        res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.PLAYLIST_SELECT_SUCCESS, result))
    } 
    else if(ID == -1) { //비회원일 경우
        res.status(200).send(responseUtil.successFalse(returnCode.NOT_FOUND, returnMessage.NOT_CORRECT_TOKEN_USER));
    } 
    else { //토큰 검증 실패
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, returnMessage.EMPTY_TOKEN));
    }
})

module.exports = router;