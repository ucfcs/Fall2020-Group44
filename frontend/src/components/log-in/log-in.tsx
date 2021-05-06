import React, { ReactElement, useContext, useEffect } from "react";
import { Redirect } from "react-router";

import { store } from "../../store";

const LogIn = (props: Props): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const global = useContext(store) as any;
  const dispatch = global.dispatch;

  const courseId: string = props.match.params.courseId;

  const searchParams: URLSearchParams = new URL(document.location.href)
    .searchParams;
  const jwt: string | null = searchParams.get("token");

  // Wrapping dispatch in useEffect prevents warnings from react about setting state
  // of another component while this one is rendering.
  useEffect(() => {
    dispatch({ type: "set-course-id", payload: courseId });
    dispatch({ type: "set-jwt", payload: jwt });
  });

  if (courseId && jwt) {
    return <Redirect to="/" />;
  }

  return <p>Failed to log in.</p>;
};

interface Props {
  match: {
    params: {
      [key: string]: string;
    };
  };
}

export default LogIn;
