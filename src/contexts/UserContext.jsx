import { createContext, useContext, useState, useEffect } from 'react';
import { getUsers } from '../api/users';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getUsers(
        pagination.page,
        pagination.limit,
        searchTerm
      );
      setUsers(data.users);
      setPagination((prev) => ({
        ...prev,
        total: data.total,
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, searchTerm]);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        pagination,
        setPagination,
        searchTerm,
        setSearchTerm,
        fetchUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext);