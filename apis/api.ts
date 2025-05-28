import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6969/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/plain, */*',
  },
});


/**
 * Fetch tournament details by ID
 * @param id Tournament ID
 */
export async function getTournamentById(id: string | number) {
  const res = await api.get(`/tournament/${id}`);
  return res.data;
}

export default api;
