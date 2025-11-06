const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { 
    getUsers, 
    createUser, 
    updateUser, 
    toggleActiveUser, 
    deleteUser
} = require('../controllers/adminController');

// Todas las rutas de administración están protegidas
router.get('/users', protect, getUsers);
router.post('/users', protect, createUser);
router.put('/users/:id', protect, updateUser);
router.put('/users/toggle/:id', protect, toggleActiveUser);
router.delete('/users/:id', protect, deleteUser);

module.exports = router;
