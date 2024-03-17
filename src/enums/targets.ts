export enum EUserTargets {
  Register = 'register',
  Login = 'login',
  GetName = 'getName',
  DebugGetAll = 'debugGetAll',
}

export enum EItemsTargets {
  Get = 'get',
  Use = 'use',
  Drop = 'drop',
}

export enum EPartyTargets {
  Create = 'Create',
  Get = 'get',
}

export enum ESharedTargets {
  RemoveUser = 'removeUser',
}

export enum EProfileTargets {
  Create = 'createProfile',
  Get = 'getProfile',
}

export enum ELogTargets {
  AddLog = 'addLog',
  GetLog = 'getLog',
}

export enum ECharacterStateTargets {
  ChangeState = 'changeState',
}

export enum EBugReportTargets {
  AddBugReport = 'addBugReport',
  GetBugReport = 'getBugReport',
}
