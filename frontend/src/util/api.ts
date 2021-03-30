import { Folder, Question } from "../types";

export async function getFolders(courseId: string): Promise<Response> {
  const url: string = getBaseUrl();

  const response: Response = await sendGet(`${url}/courses/${courseId}`);

  return response;
}

export async function createFolder(folder: NewFolder): Promise<Response> {
  const url: string = getBaseUrl();

  const response: Response = await postData(`${url}/folder`, folder);

  return response;
}

export async function updateFolder(
  folderId: number,
  newFolder: Folder
): Promise<Response> {
  const url: string = getBaseUrl();

  const response: Response = await sendPut(
    `${url}/folder/${folderId}`,
    newFolder
  );

  return response;
}

export async function deleteFolder(folderId: number): Promise<Response> {
  const url: string = getBaseUrl();

  const response: Response = await sendDelete(`${url}/folder/${folderId}`);

  return response;
}

export async function createQuestion(
  newQuestion: NewQuestion
): Promise<Response> {
  const url: string = getBaseUrl();

  const response: Response = await postData(`${url}/question`, newQuestion);

  return response;
}

export async function updateQuestion(
  questionId: number,
  newQuestion: NewQuestion | Question
): Promise<Response> {
  const url: string = getBaseUrl();

  const response: Response = await sendPut(
    `${url}/question/${questionId}`,
    newQuestion
  );

  return response;
}

export async function deleteQuestion(questionId: number): Promise<Response> {
  const url: string = getBaseUrl();

  const response: Response = await sendDelete(`${url}/question/${questionId}`);

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

async function sendGet(url = ""): Promise<Response> {
  const response: Response = await fetch(url);

  return response;
}

async function postData(url = "", data = {}): Promise<Response> {
  const response: Response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
}

async function sendPut(url = "", data = {}): Promise<Response> {
  const response: Response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
}

async function sendDelete(url = ""): Promise<Response> {
  const response: Response = await fetch(url, {
    method: "DELETE",
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
