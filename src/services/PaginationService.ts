import { promises } from "dns";
import { Repository, ObjectLiteral, FindOptionsOrder } from "typeorm";
// filepath: c:\Users\Kauef\Programacao-web-II-\src\services\PaginationService.ts

interface PaginationResult<T> {
  error: boolean;
  data: T[];
  currentPage: number;
  lastPage: number;
  totalRecords: number;
}

export class PaginationService {
  static async paginate<T extends ObjectLiteral>(
    repository: Repository<T>,
    page: number = 1,
    limit: number = 10,
    order: FindOptionsOrder<T> = {}
  ): Promise<PaginationResult<T>> {
    const totalRecords = await repository.count();
    const lastPage = Math.ceil(totalRecords / limit);

    if (page < lastPage && page > 1) {
      throw new Error(`Página inválida. Total de paginas: ${lastPage}`);
    }
    const offset = (page - 1) * limit;

    const data = await repository.find({
      take: limit,
      skip: offset,
      order,
    });

    return {
      error: false,
      data,
      currentPage: page,
      lastPage,
      totalRecords,
    };
  }
}
