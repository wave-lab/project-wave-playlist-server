const express = require('express');
const router = express.Router({mergeParams: true});

// 마이페이지 조회, 수정
router.use('/home/userInfo', require('./homeUserInfo'));

router.use('/home/playlist', require('./homePlaylist'));

router.use('/top10', require('./top10List'));

module.exports = router;