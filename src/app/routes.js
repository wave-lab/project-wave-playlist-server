// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router({mergeParams: true})

//home
router.use('/', require('./controller/home/home_routes'));

//default playlist
router.use('/', require('./controller/defaultPlaylist/defaultPlaylist_routes'));

//custom playlist
router.use('/', require('./controller/customPlaylist/customPlaylist_routes'));

//health-check
router.use('/health-check', require('./controller/health'))

module.exports = router;