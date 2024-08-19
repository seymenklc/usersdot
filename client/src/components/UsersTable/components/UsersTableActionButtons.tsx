import { useQuery } from "@tanstack/react-query";
import useUsersTableStore from "../../../store/UserTableStore";
import { getUser } from "../../../services/users";
import { Button, Flex } from "antd";

export default function UsersTableActionButtons() {
  const { selectedTableRow, setIsUserModalOpen, handleOnUserFetched } =
    useUsersTableStore();

  const { refetch: getUserById, isFetching } = useQuery({
    queryKey: ["user"],
    enabled: false,
    onSuccess: handleOnUserFetched,
    queryFn: () => getUser(Number(selectedTableRow?.id)),
  });

  return (
    <Flex gap={5} style={{ marginBottom: "1rem", marginTop: "1rem" }}>
      <Button onClick={() => setIsUserModalOpen(true)} type="primary">
        Add User
      </Button>
      <Button
        danger
        type="primary"
        loading={isFetching}
        disabled={!selectedTableRow?.id}
        onClick={() => getUserById()}
      >
        Edit User
      </Button>
    </Flex>
  );
}
