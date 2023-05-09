import type { IRoosterAddData, IRoosterAddDefaultData, IRoosterFactory, IRoosterGetData } from './types';
import type { Document, Model } from 'mongoose';
import type { EModules } from './enums';

export default abstract class RoosterFactory<T extends Document, U extends Model<T>, Z extends EModules>
  implements IRoosterFactory<Z>
{
  private readonly _model: U;

  protected constructor(model: U) {
    this._model = model;
  }

  get model(): U {
    return this._model;
  }

  async add(data: IRoosterAddData[Z]): Promise<string> {
    const newElement = new this.model(data);
    const callback = await newElement.save();
    return callback._id as string;
  }

  async addDefault(data: IRoosterAddDefaultData[Z]): Promise<void> {
    const newElement = new this.model(data);
    await newElement.save();
  }

  async get(_data: unknown): Promise<IRoosterGetData[Z]> {
    return this.model.find({}).lean();
  }
}
