import * as migration_20261119_015537_initial from './20261119_015537_initial';
import * as migration_20261119_020818_content_model from './20261119_020818_content_model';

export const migrations = [
  {
    up: migration_20261119_015537_initial.up,
    down: migration_20261119_015537_initial.down,
    name: '20261119_015537_initial',
  },
  {
    up: migration_20261119_020818_content_model.up,
    down: migration_20261119_020818_content_model.down,
    name: '20261119_020818_content_model'
  },
];
