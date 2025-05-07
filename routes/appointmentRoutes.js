const express = require('express');
const router = express.Router();

const{
    createAppointment,
    getAppointments,
    updateAppointment,
    deleteAppointment
} = require('../controllers/appointmentController');

const { protect } = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');

router.get('/', protect, checkRole('admin', 'recepcionista'), getAppointments);
router.post('/', protect, checkRole('admin', 'recepcionista'), createAppointment);
router.put('/:id', protect, checkRole('admin', 'recepcionista'), updateAppointment);
router.delete('/:id', protect, checkRole('admin', 'recepcionista'), deleteAppointment);

module.exports = router;