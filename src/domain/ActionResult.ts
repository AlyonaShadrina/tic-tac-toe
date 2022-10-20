export interface IActionResult<T> {
  type: 'success' | 'error';
  info: {
    message: string;
    data: T;
  }
}

export class ActionResult {
  static isSuccess<T>(actionResult: IActionResult<T>) {
    return actionResult.type === 'success';
  }
}

export class ActionResultSuccess<T> implements IActionResult<T> {
  info: {
    message: string;
    data: T;
  };
  type: 'success';

  constructor(
    message: string, 
    data: T
  ) {
    this.type = 'success';
    this.info = {
       message, 
       data
    }
  }
}

export class ActionResultError<T> implements IActionResult<T> {
  info: {
    message: string;
    data: T;
  };
  type: 'error';

  constructor(
    message: string, 
    data: T
  ) {
    this.type = 'error';
    this.info = {
       message, 
       data
    }
  }
}
