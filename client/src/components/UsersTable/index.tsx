import { useQuery } from "@tanstack/react-query";
import { Input, Table, TablePaginationConfig } from "antd";
import { getUsers } from "../../services/users";
import { usersTableColumns } from "./utils";
import { CSSProperties, lazy, useCallback, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import useUsersTableStore from "../../store/UserTableStore";
import { LazyComponent } from "../ui/LazyComponent";
import UsersTableActionButtons from "./components/UsersTableActionButtons";

const UserModal = lazy(() => import("./components/UserModal"));

type UsersTableProps = {
  isSearchable: boolean | undefined;
};

const containerStyle = {
  width: "100%",
  maxWidth: "100%",
  margin: "0 auto",
} satisfies CSSProperties;

export default function UsersTable(props: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<TablePaginationConfig>({});

  const debouncedSearchTerm = useDebounce(searchTerm);

  const { handleSetSelectedTableRow, selectedTableRow, isUserModalOpen } =
    useUsersTableStore();

  const { data, isFetching: isFetchingUsers } = useQuery({
    keepPreviousData: true,
    queryFn: () => usersFetcher(),
    queryKey: [
      "users",
      debouncedSearchTerm,
      pagination.current,
      pagination.pageSize,
    ],
    onSuccess: (data) => {
      setPagination({ ...data.meta, current: data.meta.currentPage });
    },
  });

  const usersFetcher = useCallback(async () => {
    return await getUsers(
      pagination.current || 1,
      pagination.pageSize || 20,
      debouncedSearchTerm
    );
  }, [debouncedSearchTerm, pagination]);

  return (
    <div style={containerStyle}>
      {props.isSearchable && (
        <Input
          value={searchTerm}
          placeholder="Search users"
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      )}
      <UsersTableActionButtons />
      <Table
        loading={isFetchingUsers}
        columns={usersTableColumns}
        rowKey={({ id }) => id}
        dataSource={data?.data ?? []}
        scroll={{ x: true, y: 600 }}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
          },
        }}
        rowSelection={{
          type: "radio",
          onSelect: handleSetSelectedTableRow,
          selectedRowKeys: selectedTableRow?.id ? [selectedTableRow.id] : [],
        }}
      />
      {isUserModalOpen && <LazyComponent component={<UserModal />} />}
    </div>
  );
}
