import express from 'express';

import Tasks from '../controllers/Tasks';

const router = express.Router();

router.post('/', Tasks.createTask);

router.get('/', Tasks.getItemsWithStatus);
router.get('/single/task', Tasks.getSingleTask);

router.put('/', Tasks.editItem);
router.put('/status', Tasks.changeStatus);

router.delete('/:id', Tasks.deleteItem);

export default router;
