const express = require('express');
const router = express.Router({ mergeParams: true })

const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')

const jwt = require('../../module/jwt');

const myPlaylist = require('../../model/schema/myPlaylist');
const playlist = require('../../model/schema/playlist');

router.get('/', async (req, res) => {

    const ID = jwt.verify(req.headers.authorization);

    if (ID != -1) {

        const result = (await myPlaylist.find({ userIdx: ID }))[0];
        const result2 = (await playlist.find({ _id: result.hitsPlaylist }))[0];

        res.status(200).send(resUtil.successTrue(resCode.OK, "적중곡 조회", result2));
    } else {
        res.status(200).send(resUtil.successFalse(resCode.UNAUTHORIZED, resMessage.EMPTY_TOKEN));
    }
})

module.exports = router;