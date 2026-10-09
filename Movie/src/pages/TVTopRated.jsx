import TVList from '../components/TVList';
import { getTopRatedTV } from "../services/TVapi";

export default function TVPopular() {
  return <TVList title="Top Rated TV Shows" fetchData={getTopRatedTV} />;
}
