interface GetBooksByUserData
{
    userId: number;
    lastId?: number;
    lastDate?: number;
    sortBy?: "default" | "date_created" | "date_updated";
    sortDirection?: "asc" | "desc";
}

export default GetBooksByUserData;