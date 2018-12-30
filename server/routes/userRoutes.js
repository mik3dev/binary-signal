const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/me', userController.findByToken);
router.post('/all', userController.showAll);
router.post('/:id', userController.showUser);
router.post('/:id/update', userController.update );
router.post('/:id/delete', userController.delete );

router.post('/logout', (req, res) => {
    res.send('Logout')
});

module.exports = router;