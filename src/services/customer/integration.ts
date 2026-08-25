export class IntegrationPendingError extends Error {
  constructor(serviceName: string) {
    super(`${serviceName} requires backend endpoint details before production integration.`);
    this.name = "IntegrationPendingError";
  }
}

export function integrationPending(serviceName: string): never {
  throw new IntegrationPendingError(serviceName);
}
