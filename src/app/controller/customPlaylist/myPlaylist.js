const express = require('express');
const router = express.Router();
const jwt = require('../../module/jwt');
const returnCode = require('../../model/returnCode');
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

        res.status(200).send(responseUtil.successTrue(returnCode.OK, "myPlaylist 조회 성공", result))
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