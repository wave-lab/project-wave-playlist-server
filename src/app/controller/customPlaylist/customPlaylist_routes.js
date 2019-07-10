const express = require('express');
const router = express.Router({mergeParams: true});

// playlist의 곡 조회
router.use('/custom/songs/:playlistIdx', require('./playlist'));

// playlist의 곡 추가/삭제
router.use('/custom/songs', require('./playlist'));

// playlist 삭제
router.use('/custom/manage/:playlistIdx', require('./playlistManage'));

// playlist 자체를 추가
router.use('/custom/manage', require('./playlistManage'));

// 보관함의 플레이리스트 탭 클릭시 history+custom 플레이리스트 조회 
router.use('/custom', require('./myPlaylist'));

module.exports = router;