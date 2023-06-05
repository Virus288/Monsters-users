import type { EModules } from './enums';
import type { IModulesGetControllers } from './types';

export default abstract class HandlerFactory<T extends EModules> {
  private readonly _getController: IModulesGetControllers[T];

  protected constructor(getController: IModulesGetControllers[T]) {
    this._getController = getController;
  }

  protected get getController(): IModulesGetControllers[T] {
    return this._getController;
  }
}
