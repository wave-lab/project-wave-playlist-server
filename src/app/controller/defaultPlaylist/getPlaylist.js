const express = require('express');
const router = express.Router({ mergeParams: true })

const responseUtil = require('../../module/responseUtil')
const returnCode = require('../../model/returnCode')
const returnMessage = require('../../../config/returnMessage')

const mongoose = require('mongoose');

const jwt = require('../../module/jwt');

const myPlaylist = require('../../model/schema/myPlaylist');
const playlist = require('../../model/schema/playlist');

router.get('/', async (req, res) => {
    const inputPlaylistIdx = req.params.playlistIdx;

    if (mongoose.Types.ObjectId.isValid(inputPlaylistIdx)) {
        const result = (await playlist.find({ _id: inputPlaylistIdx }))[0];
        if (result == undefined) {
            res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.PLAYLIST_SELECT_FAIL));
        } else {
            res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.PLAYLIST_SELECT_SUCCESS, result));
        }
    } else {
        res.status(200).send(responseUtil.successTrue(returnCode.NOT_FOUND, "플레이리스트를 찾을 수 없습니다."));
    }
});

module.exports = router;