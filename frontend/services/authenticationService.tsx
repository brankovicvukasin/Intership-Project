import axios from "axios";

interface Option {
  value: string;
  label: string;
}

export async function addNewUser(
  email: string,
  password: string,
  role: string
) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/addNewUser`,
    {
      email,
      password,
      role,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export async function deleteUser(email: string) {
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/deleteUser?email=${encodeURIComponent(
      email
    )}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export async function getAllUsers(limit: number, currentPage: number) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/getAllUsers?limit=${encodeURIComponent(
      limit
    )}&currentPage=${encodeURIComponent(currentPage)}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export async function login(email: string, password: string) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/login`,
    {
      email,
      password,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export async function logout() {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/logout`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export async function getDefaultAnalysis(
  timeRange: number,
  selectedKeywords: Option[]
) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/getDefaultAnalysis`,
    {
      params: { timeRange, selectedKeywords },
      withCredentials: true,
    }
  );
  return response.data;
}

export async function getDefaultAnalysis2() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/getDefaultAnalysis2`,
    {
      withCredentials: true,
    }
  );
  return response.data;
}
