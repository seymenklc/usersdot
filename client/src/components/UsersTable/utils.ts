import { ColumnsType } from "antd/es/table";

export const usersTableColumns = [
  {
    title: "Name",
    key: "name",
    dataIndex: "name",
  },
  {
    title: "Surname",
    key: "surname",
    dataIndex: "surname",
  },
  {
    title: "Email",
    key: "email",
    dataIndex: "email",
  },
  {
    title: "Phone",
    key: "phone",
    dataIndex: "phone",
  },
  {
    title: "Age",
    key: "age",
    dataIndex: "age",
  },
  {
    title: "Country",
    key: "country",
    dataIndex: "country",
  },
  {
    title: "District",
    key: "district",
    dataIndex: "district",
  },
  {
    title: "Role",
    key: "role",
    dataIndex: "role",
  },
] satisfies ColumnsType;
