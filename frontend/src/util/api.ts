import { Folder, Question } from "../types";

export async function getFolders(
  courseId: string,
  token: string
): Promise<Response> {
  const url: string = getBaseUrl();

  const response: Response = await sendGet(`${url}/courses/${courseId}`, token);

  return response;
}

export async function createFolder(
  folder: NewFolder,
  token: string
): Promise<Response> {
  const url: string = getBaseUrl();

  const response: Response = await sendPost(`${url}/folder`, folder, token);

  return response;
}

export async function updateFolder(
  folderId: number,
  newFolder: Folder,
  token: string
): Promise<Response> {
  const url: string = getBaseUrl();

  const response: Response = await sendPut(
    `${url}/folder/${folderId}`,
    newFolder,
    token
  );

  return response;
}

export async function deleteFolder(
  folderId: number,
  token: string
): Promise<Response> {
  const url: string = getBaseUrl();

  const response: Response = await sendDelete(
    `${url}/folder/${folderId}`,
    token
  );

  return response;
}

export async function createQuestion(
  newQuestion: NewQuestion,
  token: string
): Promise<Response> {
  const url: string = getBaseUrl();

  const response: Response = await sendPost(
    `${url}/question`,
    newQuestion,
    token
  );

  return response;
}

export async function updateQuestion(
  questionId: number,
  newQuestion: NewQuestion | Question,
  token: string
): Promise<Response> {
  const url: string = getBaseUrl();

  const response: Response = await sendPut(
    `${url}/question/${questionId}`,
    newQuestion,
    token
  );

  return response;
}

export async function deleteQuestion(
  questionId: number,
  token: string
): Promise<Response> {
  const url: string = getBaseUrl();

  const response: Response = await sendDelete(
    `${url}/question/${questionId}`,
    token
  );

  return response;
}

export async function createSession(
  courseId: string,
  questionIds: number[],
  token: string
): Promise<Response> {
  const url: string = getBaseUrl();

  const response: Response = await sendPost(
    `${url}/session`,
    {
      courseId,
      questionIds,
    },
    token
  );

  return response;
}

export async function getCourseGrades(
  courseId: string,
  token: string
): Promise<Response> {
  const url: string = getBaseUrl();

  const response: Response = await sendGet(
    `${url}/courses/${courseId}/grades`,
    token
  );

  return response;
}

export async function getSessionGrades(
  courseId: string,
  sessionId: number,
  token: string
): Promise<Response> {
  const url: string = getBaseUrl();

  const response: Response = await sendGet(
    `${url}/courses/${courseId}/session/${sessionId}/grades`,
    token
  );

  return response;
}

export async function postSessionGrades(
  courseId: string,
  sessionId: number,
  token: string
): Promise<Response> {
  const url: string = getBaseUrl();

  const response: Response = await sendPost(
    `${url}/courses/${courseId}/session/${sessionId}/grades`,
    {},
    token
  );

  return response;
}

export function catchError(error: Error): void {
  console.error(error);
}

function getBaseUrl(): string {
  if (process.env.REACT_APP_REST_URL) {
    return `${process.env.REACT_APP_REST_URL}`;
  } else {
    throw new Error("API URL not found.");
  }
}

async function sendGet(url: string, token: string): Promise<Response> {
  const response: Response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

async function sendPost(
  url: string,
  data = {},
  token: string
): Promise<Response> {
  const response: Response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return response;
}

async function sendPut(
  url: string,
  data = {},
  token: string
): Promise<Response> {
  const response: Response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return response;
}

async function sendDelete(url: string, token: string): Promise<Response> {
  const response: Response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

interface NewQuestion extends Question {
  courseId: string;
}

interface NewFolder {
  courseId: string;
  name: string;
}
