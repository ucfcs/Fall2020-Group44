export async function postData(url = "", data = {}): Promise<Response> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
}

export async function putData(url = "", data = {}): Promise<Response> {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
}

export async function sendDelete(url = ""): Promise<Response> {
  const response = await fetch(url, {
    method: "DELETE",
  });

  return response;
}

export async function getFolders(
  url = "",
  courseId: string
): Promise<Response> {
  const response = await fetch(`${url}/${courseId}`);

  return response;
}
