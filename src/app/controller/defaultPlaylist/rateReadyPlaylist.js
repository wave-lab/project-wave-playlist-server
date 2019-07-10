const express = require('express');
const router = express.Router({ mergeParams: true })

const jwt = require('../../module/jwt');
const returnCode = require('../../model/returnCode');
const responseUtil = require('../../module/responseUtil');

const myPlaylist = require('../../model/schema/myPlaylist');
const playlist = require('../../model/schema/playlist');

router.get('/', async (req, res) => {

    const ID = jwt.verify(req.headers.authorization);

    //회원일 경우
    if (ID > 0) {
        const result = (await myPlaylist.find({ userIdx: ID }))[0];
        const result2 = (await playlist.find({ _id: result.rateReadyPlaylist }))[0];

        res.status(200).send(responseUtil.successTrue(returnCode.OK, "평가 대기곡 플레이리스트", result2));
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