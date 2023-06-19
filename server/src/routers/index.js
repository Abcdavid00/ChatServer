import express from 'express';
import RoomRouter from './room.js';

const router = express.Router();

router.use('/room', RoomRouter);
router.get('/', (req, res) => {
    res.send('Hello from Mobike Chat Server!');
})

router.get('/*', (req, res) => {
    res.status(404).send('404 Not Found');
});

export default router;