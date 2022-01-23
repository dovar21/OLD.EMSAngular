export default interface PaginationItems<T> {
    items: T;
    page: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
}
