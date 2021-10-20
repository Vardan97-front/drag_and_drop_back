import _ from 'lodash';
import { Task } from '../Models';

class Tasks {
  static createTask = async (req, res, next) => {
    try {
      const {
        title, description,
      } = req.body;

      const tasksCount = await Task.findAll({
        where: {
          status: 'todo',
        },
      });

      const task = await Task.create({
        title,
        description,
        position: tasksCount.length,
      });

      res.json({
        status: 'ok',
        result: task,
      });
    } catch (e) {
      next(e);
    }
  }

  static getItemsWithStatus = async (req, res, next) => {
    try {
      const {
        status,
      } = req.query;

      const tasks = await Task.findAll({
        where: {
          status,
        },
        order: [['position', 'ASC']],
      });

      res.json({
        status: 'ok',
        result: tasks,
      });
    } catch (e) {
      next(e);
    }
  }

  static getSingleTask = async (req, res, next) => {
    try {
      const {
        id,
      } = req.query;

      const task = await Task.findOne({
        where: {
          id,
        },
      });

      res.json({
        status: 'ok',
        result: task,
      });
    } catch (e) {
      next(e);
    }
  }

  static editItem = async (req, res, next) => {
    try {
      const {
        title, description, id,
      } = req.body;

      const task = await Task.update({
        title,
        description,
      }, {
        where: {
          id,
        },
      });

      res.json({
        status: 'ok',
        result: task,
      });
    } catch (e) {
      next(e);
    }
  }

  static changeStatus = async (req, res, next) => {
    try {
      const {
        status,
        id,
        oldIndex,
        newIndex,
      } = req.body;

      const prevTask = await Task.findOne({
        where: {
          id,
        },
      });

      let tasks = [];

      if (prevTask.status === status) {
        if (oldIndex < newIndex) {
          tasks = await Task.findAll({
            order: [['position', 'ASC']],
            where: {
              status,
              position: {
                $gt: oldIndex,
                $lte: newIndex,
              },
            },
          });

          for (let i = oldIndex + 1; i <= newIndex; i++) {
            const tas = _.find(tasks, (t) => t.position === i);

            await Task.update({
              position: i - 1,
            }, {
              where: {
                id: tas.id,
              },
            });
          }
        } else {
          tasks = await Task.findAll({
            order: [['position', 'ASC']],
            where: {
              status,
              position: {
                $gte: newIndex,
                $lt: oldIndex,
              },
            },
          });

          for (let i = oldIndex - 1; i >= newIndex; i--) {
            const tas = _.find(tasks, (t) => t.position === i);

            await Task.update({
              position: i + 1,
            }, {
              where: {
                id: tas.id,
              },
            });
          }
        }

        await Task.update({
          position: newIndex,
        }, {
          where: {
            id: prevTask.id,
          },
        });
      } else {
        const prevTasksCount = await Task.findAll({
          order: [['position', 'ASC']],
          where: {
            status: prevTask.status,
            position: {
              $gt: oldIndex,
            },
          },
        });

        if (prevTasksCount) {
          for (let i = oldIndex + 1; i <= oldIndex + prevTasksCount.length; i++) {
            const tas = _.find(prevTasksCount, (t) => t.position === i);

            await Task.update({
              position: i - 1,
            }, {
              where: {
                id: tas.id,
              },
            });
          }
        }

        const nextTasksCount = await Task.findAll({
          where: {
            status,
          },
        });

        await Task.update({
          status,
          position: nextTasksCount.length,
        }, {
          where: {
            id,
          },
        });
      }

      res.json({
        status: 'ok',
        result: tasks,
        prevStatus: prevTask.status,
      });
    } catch (e) {
      next(e);
    }
  }

  static deleteItem = async (req, res, next) => {
    try {
      const { id } = req.params;

      const task = await Task.findOne({
        where: {
          id,
        },
      });

      const tasks = await Task.findAll({
        order: [['position', 'ASC']],
        where: {
          status: task.status,
          position: {
            $gt: task.position,
          },
        },
      });

      if (tasks.length > 0) {
        for (let i = task.position + 1; i <= task.position + tasks.length; i++) {
          const tas = _.find(tasks, (t) => t.position === i);

          await Task.update({
            position: i - 1,
          }, {
            where: {
              id: tas.id,
            },
          });
        }
      }

      await Task.destroy({
        where: {
          id,
        },
      });

      res.json({
        status: 'ok',
        result: task,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default Tasks;
