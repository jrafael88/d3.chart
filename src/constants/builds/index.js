
import api from '../../api'
import { urls } from '../config'

export async function getBuildsCount() {
  return api.get(`${urls.charts}`);
}
