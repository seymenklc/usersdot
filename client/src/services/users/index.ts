import axios from "axios";

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  age?: number;
  country?: string;
  district?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BaseResponse<T> {
  message: null;
  result: T;
  type: "success" | "error";
}

interface UsersResponse {
  data: User[];
  meta: {
    total: number;
    currentPage: number;
    pageSize: number;
  };
}

export const getUsers = async (
  page: number,
  pageSize: number,
  search: string
) => {
  try {
    const { data } = await axios.get<BaseResponse<UsersResponse>>("/users", {
      params: {
        page,
        pageSize,
        search,
      },
    });
    return data.result;
  } catch (error) {
    throw new Error("Something went wrong, Please try again later");
  }
};

export const getUser = async (id: number) => {
  if (!id) return;
  try {
    const { data } = await axios.get<BaseResponse<User>>(`/users/${id}`);
    return data.result;
  } catch (error) {
    throw new Error("Something went wrong, Please try again later");
  }
};

export type SaveUserRequest = Omit<User, "id" | "createdAt" | "updatedAt">;

export const createUser = async (user: SaveUserRequest) => {
  try {
    const { data } = await axios.post<BaseResponse<SaveUserRequest>>(
      "/users",
      user
    );
    return data.result;
  } catch (error) {
    throw new Error("Something went wrong, Please try again later");
  }
};

export const updateUser = async (id: number, user: SaveUserRequest) => {
  try {
    const { data } = await axios.put<BaseResponse<SaveUserRequest>>(
      `/users/${id}`,
      user
    );
    return data.result;
  } catch (error) {
    throw new Error("Something went wrong, Please try again later");
  }
};
