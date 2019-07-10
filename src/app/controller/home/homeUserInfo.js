const express = require('express');
const router = express.Router();
const pool = require('../../module/pool.js');
const jwt = require('../../module/jwt');

const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');

router.get('/', async (req, res) => {

    const ID = await jwt.verify(req.headers.authorization);

    let result = {
        nickname: "",
        hitSongCount: 0,
        rateSongCount: 0,
        totalPoint: 0,
        auth: false
    };

    if (ID > 0) {
        const userInfoQuery = 'SELECT nickname, hitSongCount, rateSongCount, totalPoint FROM user WHERE userIdx = ?';
        const userInfoResult = (await pool.queryParam_Arr(userInfoQuery, [ID]))[0];

        result.nickname = userInfoResult.nickname;
        result.hitSongCount = userInfoResult.hitSongCount;
        result.rateSongCount = userInfoResult.rateSongCount;
        result.totalPoint = userInfoResult.totalPoint;
        result.auth = true;

        res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.SUCCESS, result));
    } else if (ID == -1) { //비회원일 경우
        res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.SUCCESS, result));
    }
    else { //토큰 검증 실패
        res.status(200).send(responseUtil.successFalse(returnCode.UNAUTHORIZED, returnMessage.EMPTY_TOKEN));
    }
});

module.exports = router;