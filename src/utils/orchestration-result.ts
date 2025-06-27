import { EnumStatusCode } from "../enums/status-codes";

export type ErrorResult = {
  code: EnumStatusCode;
  message: string;
};

export type PaginatedResult<T> = {
  code: EnumStatusCode;
  message: string;
  data: {
    items: T[];
    totalItems: number;
    itemsPerPage: number;
    page: number;
    totalPages: number;
  };
};

export type SimpleItemResult<T> = {
  code: EnumStatusCode;
  message: string;
  data: {
    item: T;
  };
};

export class OrchestrationResult {
  static paginated<T>({
    data,
    totalItems,
    itemsPerPage,
    page,
    code,
    message,
  }: {
    data: T[];
    totalItems: number;
    itemsPerPage: number;
    page: number;
    code: EnumStatusCode;
    message: string;
  }): PaginatedResult<T> {
    return {
      code,
      message,
      data: {
        items: data,
        totalItems,
        itemsPerPage,
        page,
        totalPages: Math.ceil(totalItems / itemsPerPage),
      },
    };
  }

  static item<T>({
    code,
    data,
    message,
  }: {
    code: EnumStatusCode;
    data: T;
    message: string;
  }): SimpleItemResult<T> {
    return {
      code,
      data: {
        item: data,
      },
      message,
    };
  }
}

// const data = OrchestrationResult.item<string>({
//   code: EnumStatusCode.SUCCESS,
//   data: "",
//   message: "",
// });
