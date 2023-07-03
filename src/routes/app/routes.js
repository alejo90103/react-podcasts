import {
  HOME,
  PODCAST_DETAIL,
  EPISODE_DETAIL
} from './paths';

// PODCASTS
import Podcasts from '../../components/podcasts/Podcasts';
import PodcastDetail from '../../components/podcasts/PodcastDetail';
import EpisodeDetail from '../../components/podcasts/EpisodeDetail';

export const publicRoutes = [
  { id: 1, path: HOME, component: <Podcasts /> },
  { id: 2, path: PODCAST_DETAIL, component: <PodcastDetail /> },
  { id: 3, path: EPISODE_DETAIL, component: <EpisodeDetail /> },
]