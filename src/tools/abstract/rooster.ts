import type { EModules } from './enums';
import type * as types from './types';
import type { Document, Model } from 'mongoose';

export default abstract class RoosterFactory<T extends Document, U extends Model<T>, Z extends EModules>
  implements types.IRoosterFactory<Z>
{
  private readonly _model: U;

  protected constructor(model: U) {
    this._model = model;
  }

  get model(): U {
    return this._model;
  }

  async add(data: types.IRoosterAddData[Z]): Promise<string> {
    const newElement = new this.model(data);
    const callback = await newElement.save();
    return callback._id as string;
  }

  /**
   * Create element with default data. This requires to pass elements, required my schema
   * #TODO Rewrite interface, so it will require data, required by mongoose schema
   */
  async addDefault(data: types.IRoosterAddDefaultData[Z]): Promise<types.IRoosterDefaultDataCallback[Z]> {
    const newElement = new this.model(data);
    // #TODO Add fix for this. This is bad
    return (await newElement.save()) as unknown as types.IRoosterDefaultDataCallback[Z];
  }

  async update(id: string, data: types.IRoosterUpdate[Z]): Promise<void> {
    await this.model.findOneAndUpdate({ _id: id }, data);
  }

  async get(_id: unknown): Promise<types.IRoosterGetData[Z] | null> {
    return this.model.findOne({ _id }).lean();
  }
}
