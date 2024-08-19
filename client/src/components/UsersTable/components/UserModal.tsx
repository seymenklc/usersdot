import { Button, Form, Input, InputNumber, Modal, Select, message } from "antd";
import useUsersTableStore from "../../../store/UserTableStore";
import {
  createUser,
  SaveUserRequest,
  updateUser,
  User,
} from "../../../services/users";
import { FormProps, type Rule } from "antd/es/form";
import { Role } from "../../../utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

type FieldType = Omit<User, "id" | "createdAt" | "updatedAt"> & {
  password?: string;
};

const defaultRules = [
  { required: true, message: "Please fill in this field!" },
] satisfies Rule[];

export default function UserModal() {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const {
    selectedTableRow,
    isUserModalOpen,
    handleCloseUserModal,
    form: initialFormValues,
  } = useUsersTableStore();

  const handleOnSuccessUserOperation = useCallback(async () => {
    await queryClient.invalidateQueries(["users"]);
    handleCloseUserModal();
    message.success("Operation Successful!");
  }, []);

  const userSaveMutation = useMutation({
    mutationKey: ["userSave"],
    onSuccess: handleOnSuccessUserOperation,
    mutationFn: (user: SaveUserRequest) => createUser(user),
  });

  const userUpdateMutation = useMutation({
    mutationKey: ["userUpdate"],
    onSuccess: handleOnSuccessUserOperation,
    mutationFn: ({ id, user }: { id: number; user: SaveUserRequest }) => {
      return updateUser(id, user);
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (selectedTableRow?.id) {
      return userUpdateMutation.mutate({
        id: selectedTableRow.id,
        user: values,
      });
    }
    userSaveMutation.mutate(values);
  };

  return (
    <Modal
      footer={null}
      title="User Modal"
      open={isUserModalOpen}
      onCancel={handleCloseUserModal}
      onClose={handleCloseUserModal}
    >
      <Form
        form={form}
        autoComplete="off"
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={initialFormValues}
      >
        <Form.Item<FieldType> label="Name" name="name" rules={defaultRules}>
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Surname"
          name="surname"
          rules={defaultRules}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="Email" name="email" rules={defaultRules}>
          <Input type="email" />
        </Form.Item>

        {!selectedTableRow?.id && (
          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={defaultRules}
          >
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item<FieldType> label="Phone" name="phone" rules={defaultRules}>
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="Age" name="age" rules={defaultRules}>
          <InputNumber type="number" min={1} max={100} />
        </Form.Item>

        <Form.Item<FieldType>
          label="Country"
          name="country"
          rules={defaultRules}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="District"
          name="district"
          rules={defaultRules}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="Role" name="role" rules={defaultRules}>
          <Select
            options={Object.values(Role).map((role) => ({
              label: role,
              value: role,
            }))}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            loading={userSaveMutation.isLoading}
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
