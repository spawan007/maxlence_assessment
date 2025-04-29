import { useState } from 'react';

export const usePagination = (initialPage = 1, initialLimit = 10) => {
    const [pagination, setPagination] = useState({
        page: initialPage,
        limit: initialLimit,
        total: 0,
    });

    const handlePageChange = (event, newPage) => {
        setPagination((prev) => ({
            ...prev,
            page: newPage,
        }));
    };

    return {
        pagination,
        setPagination,
        handlePageChange,
    };
};