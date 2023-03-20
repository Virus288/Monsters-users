import { EFakeData } from '../enums';
import { IFakeModel, IFakeState } from '../types/data';
import mongoose from 'mongoose';

export default abstract class TemplateFactory<T extends EFakeData> {
  private _target: IFakeModel[T];

  protected get target(): IFakeModel[T] {
    return this._target;
  }

  protected set target(value: IFakeModel[T]) {
    this._target = value;
  }

  private _state: IFakeState[T];

  protected get state(): IFakeState[T] {
    return this._state;
  }

  protected set state(value: IFakeState[T]) {
    this._state = value;
  }

  private _states: IFakeState[T][] = [];

  protected get states(): IFakeState[T][] {
    return this._states;
  }

  protected set states(value: IFakeState[T][]) {
    this._states = value;
  }

  async create(): Promise<mongoose.Types.ObjectId> {
    const newElm = new this._target(this.state);
    const { _id } = await newElm.save();
    this.states.push({ ...this.state, _id });
    this.clean();
    return _id as mongoose.Types.ObjectId;
  }

  async cleanUp(): Promise<void> {
    for (let state of this.states) {
      await this._target.findOneAndDelete({ _id: state._id });
    }
    this.states = [];
  }

  private clean(): void {
    Object.entries(this.state).forEach((e) => {
      if (typeof e[1] === 'number') e[1] = 0;
      if (typeof e[1] === 'string') e[1] = undefined;
      if (typeof e[1] === 'boolean') e[1] = false;
      if (typeof e[1] === undefined || typeof e[1] === null) e[1] = undefined;
    });
  }
}
