declare namespace __esri {
  interface IdentityManagerBase extends Evented {
    checkAppAccess(resUrl: string, appId: string): IPromise<Object>;
  }
}
