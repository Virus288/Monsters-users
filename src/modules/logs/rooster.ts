import mongoose from 'mongoose';
import Log from './model';
import RoosterFactory from '../../tools/abstract/rooster';
import type { ILogEntity } from './entity';
import type { ILog } from './types';
import type { EModules } from '../../tools/abstract/enums';

export default class Rooster extends RoosterFactory<ILog, typeof Log, EModules.Logs> {
  constructor() {
    super(Log);
  }

  async getByUser(userId: string, lastId?: string): Promise<ILogEntity[]> {
    const data = (await Log.aggregate([
      {
        $match: lastId
          ? {
              userId: new mongoose.Types.ObjectId(userId),
              _id: { $gt: new mongoose.Types.ObjectId(lastId) },
            }
          : { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $addFields: { date: '$createdAt' },
      },
      {
        $project: {
          _id: 1,
          date: 1,
        },
      },
    ]).sort({ createdAt: 1 })) as ILogEntity[];

    return !data || data.length === 0 ? [] : data;
  }
}
