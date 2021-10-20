import _ from 'lodash';
import * as Models from '../Models';

async function main() {
  const models = [
    Models.Task,
  ];
  if (_.isArray(models)) {
    for (const model of models) {
      await model.sync({ alter: true });
    }
  }
  process.exit();
}

main().catch((e) => console.log(e));
