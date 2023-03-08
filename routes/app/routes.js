import {
  HOME,
  PODCAST_DETAIL,
  EPISODE_DETAIL
} from './paths';

// PODCASTS
import Podcasts from '../../components/podcasts/Podcasts';
import PodcastDetail from '../../components/podcasts/PodcastDetail';

export const publicRoutes = [
  { path: HOME, component: <Podcasts /> },
  { path: PODCAST_DETAIL, component: <PodcastDetail /> },
]