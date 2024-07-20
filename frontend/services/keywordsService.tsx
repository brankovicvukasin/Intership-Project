import axios from "axios";

interface Option {
  value: string;
  label: string;
}

export async function getDefaultKeywords() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/getDefaultKeywords`,
    { withCredentials: true }
  );
  return response.data;
}

export async function addDefaultKeywords(keywords: string[]) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/addDefaultKeywords`,
    { keywords },
    { withCredentials: true }
  );
  return response.data;
}

export async function deleteDefaultKeywords(keywords: string[]) {
  const queryString = keywords
    .map((keyword) => `keywords[]=${encodeURIComponent(keyword)}`)
    .join("&");

  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/deleteDefaultKeywords?${queryString}`,
    { withCredentials: true }
  );
  return response.data;
}

export async function deleteAnalysis(analysisId: string) {
  const response = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/deleteAnalysis?analysisId=${analysisId}`,
    { withCredentials: true }
  );
  return response.data;
}

export async function addNewAnalysis(
  searchkeywords: string[],
  url: string,
  analysisName: string
) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/addNewAnalysis`,
    { searchkeywords, url, analysisName },
    { withCredentials: true }
  );
  return response.data;
}

export async function getAllAnalysisNames() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/getAllAnalysis`,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export async function getOneAnalysis(analysisId: string) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/getOneAnalysis?analysisId=${analysisId}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export async function getVega() {
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIwMDAxMDEyLCJqdGkiOiI1YWE0MzEzMjgwMjU0ZDVjYTU1OTg1NGVjOTdiZGNhYSIsInVzZXJfaWQiOjQ1fQ.UW_zNshhYuzZyaSjwsMw93dFL3zJvC8YHjtNfgoea1M";

  const response = await axios.get(
    "https://boards.vegait.rs/api/v1/projects/50/tags_colors",
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  return response.data;
}

export async function getVega2() {
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIwMDkyNTM5LCJqdGkiOiJlYzZiNGFlYzlhYjE0NjM1YTViYTQ0NWNjZjIyNzljZSIsInVzZXJfaWQiOjQ1fQ.81s4BHeMpodoKL8uYNaNobMR5Gg-xEQNaSavxF8Qy38";

  const response = await axios.get(
    "https://boards.vegait.rs/api/v1/userstories?include_attachments=1&include_tasks=1&project=50&status__is_archived=false",
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "X-Disable-Pagination": "1",
      },
    }
  );

  return response.data;
}

export async function getAllKeywords() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/getAllKeywords`,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export async function getLastDemandData() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/getLastDemandData`,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export async function getLastSupplyData() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/getLastSupplyData`,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export async function getRole() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/getRole`,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export async function getCrawlingStats() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/getCrawlingStats`,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export async function getTopTechnologies(timeRange: number) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/getTopTechnologies?timeRange=${timeRange}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export async function getUpDownDemandTrend(timeRange: number) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/getUpDownDemandTrend?timeRange=${timeRange}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export async function getAllSupplyTechnologies() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/getAllSupplyTechnologies`,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export async function getAllSupply(
  timeRange: number,
  selectedKeywords: Option[]
) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/getAllSupply`,
    {
      params: { timeRange, selectedKeywords },
      withCredentials: true,
    }
  );
  return response.data;
}

export async function getTopSupply() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/getTopSupply`,
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export async function getUpDownSupplyTrend(timeRange: number) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/getUpDownSupplyTrend?timeRange=${timeRange}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
}
