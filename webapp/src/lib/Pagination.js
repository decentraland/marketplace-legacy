export const PAGE_SIZE = 12

export class Pagination {
  static paginate(array, currentPage, pageSize = PAGE_SIZE) {
    const offset = (currentPage - 1) * pageSize
    const grid = array.slice(offset, offset + pageSize)

    return [
      grid,
      grid.length === 0,
      Pagination.getPageCount(array.length, pageSize)
    ]
  }

  static getPageCount(total, pageSize) {
    return Math.ceil(total / pageSize)
  }

  constructor(total, pageSize = PAGE_SIZE) {
    this.total = total
    this.pageSize = pageSize
  }

  getCurrentPage(offset) {
    return offset / this.pageSize + 1
  }

  getPageCount() {
    return Pagination.getPageCount(this.total, this.pageSize)
  }
}
