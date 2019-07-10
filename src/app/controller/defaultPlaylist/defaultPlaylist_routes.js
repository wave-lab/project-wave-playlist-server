const express = require('express');
const router = express.Router({mergeParams: true});

//기본 history에 곡 추가
router.use('/default/history', require('./historyPlaylist'));

// //기본 history에서 곡 조회
// router.use('/default/history/user/:userIdx', require('./historyPlaylist'));

// //평가한 곡 플레이리스트 조회
// router.use('/default/rated', require('./ratedPlaylist'));

// //좋아요한 곡 플레이리스트 조회
// router.use('/default/like/user/:userIdx', require('./likePlaylist'));

//추천곡 조회
router.use('/recommend', require('./recommendPlaylist'));

//적중곡 조회
router.use('/hits', require('./hitsPlaylist'));

//평가 대기곡 플레이리스트 조회
router.use('/rateReady', require('./rateReadyPlaylist'));

//업로드 곡 조회
router.use('/upload', require('./uploadPlaylist'));

//기본 history에서 곡 조회
router.use('/history', require('./historyPlaylist'));

//평가한 곡 플레이리스트 조회
router.use('/rated', require('./ratedPlaylist'));

//좋아요한 곡 플레이리스트 조회
router.use('/likes', require('./likePlaylist'));

module.exports = router;