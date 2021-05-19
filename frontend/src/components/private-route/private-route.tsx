import React, { ComponentType, ReactElement, useContext } from "react";
import { Route, RouteComponentProps } from "react-router-dom";

import { store } from "../../store";

const PrivateRoute = (props: Props): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const state = global.state;

  if (state.courseId && state.jwt) {
    if (props.exact) {
      return (
        <Route exact path={props.path}>
          {props.children}
        </Route>
      );
    }

    if (props.component) {
      return <Route path={props.path} component={props.component} />;
    }

    return <Route path={props.path}>{props.children}</Route>;
  }

  return <p>Failed to log in.</p>;
};

interface Props {
  children?: ReactElement | ReactElement[];
  path: string;
  exact?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: ComponentType<RouteComponentProps<any>> | ComponentType<any>;
}

export default PrivateRoute;
