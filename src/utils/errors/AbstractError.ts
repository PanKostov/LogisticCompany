/**
 * Custom Extendable Error Class - This class will be inherited by all error classes
 * raised by the exchange
 * @return Error Object
 */
export class AbstractError extends Error {
  public id: string;
  public args: any;
  public context: {};
  public status: {};
  public severity: number;

  constructor(
    name: string,
    message: string,
    meta: {
      context?: {};
      args?: any;
      severity: number;
      status?: number;
      id?: string;
    },
  ) {
    super(message);
    this.id = meta.id || (Math.random() * 100000).toFixed(0);
    this.name = name;
    this.context = meta.context as any;
    this.stack = (new Error() as any).stack;
    this.status = meta.status as any;
    this.severity = meta.severity;
    this.args = meta.args;
  }

  public toString() {
    return this.name + ': ' + this.message;
  }
}
