import { FC, Suspense, ReactNode } from "react";

interface PropTypes {
  component: ReactNode;
}

export const LazyComponent: FC<PropTypes> = ({ component }) => {
  return <Suspense fallback={"Loading..."}>{component}</Suspense>;
};
