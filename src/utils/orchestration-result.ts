import { EnumStatusCode } from "../enums/status-codes";

export type PaginatedResult<T> = {
  code: EnumStatusCode;
  page: number;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
  data: T[];
  message: string;
};

export type SimpleItemResult<T> = {
  code: EnumStatusCode;
  data: T;
  message: string;
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
      page,
      itemsPerPage,
      totalPages: Math.ceil(totalItems / itemsPerPage),
      totalItems,
      data,
      message,
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
      data,
      message,
    };
  }
}

// const data = OrchestrationResult.item<string>({
//   code: EnumStatusCode.SUCCESS,
//   data: "",
//   message: "",
// });
