import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import { type User } from "../services/users";
import { Role } from "../utils";

const initialData = () => ({
  isUserModalOpen: false,
  selectedTableRow: null as User | null,
  form: {
    name: "",
    surname: "",
    email: "",
    phone: "",
    age: 1,
    country: "",
    district: "",
    role: Role.User,
  } as User,
});

const store = combine(initialData(), (set) => ({
  handleCloseUserModal: () => {
    const { handleSetSelectedTableRow } = useUsersTableStore.getState();

    handleSetSelectedTableRow(null);

    set({
      isUserModalOpen: false,
      form: initialData().form,
      selectedTableRow: null,
    });
  },
  setIsUserModalOpen: (value: boolean) => {
    set({ isUserModalOpen: value });
  },
  handleSetSelectedTableRow: (data: User | null) => {
    set({ selectedTableRow: data });
  },
  handleOnUserFetched: (data: User) => {
    set({ form: data, isUserModalOpen: true });
  },
}));

const useUsersTableStore = create(devtools(store, { name: "users-table" }));

export default useUsersTableStore;
