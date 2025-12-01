import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { AboutUs } from './pages/about-us/about-us';
import { SongDetails } from './pages/song-details/song-details';
import { AlbumDetails } from './pages/album-details/album-details';
import { ArtistDetails } from './pages/artist-details/artist-details';
import { Oauth2Callback } from './pages/oauth2-callback/oauth2-callback';
import { UserProfile } from './pages/user-profile/user-profile';
import { authGuard } from './guards/auth-guard';
import { FinishProfile } from './pages/finish-profile/finish-profile';
import { AdminReviews } from './pages/admin-reviews/admin-reviews';
import { adminGuard } from './guards/admin-guard';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'oauth2/redirect', component: Oauth2Callback },
  { path: 'finish-profile', component: FinishProfile, canActivate: [authGuard] },
  { path: 'profile', component: UserProfile, canActivate: [authGuard] },
  { path: 'profile/:userId', component: UserProfile, canActivate:[authGuard]},
  { path: 'about-us', component: AboutUs },
  { path: 'admin/reviews', component: AdminReviews, canActivate: [adminGuard]},
  { path: 'admin-dashboard', component: AdminDashboard, canActivate:[authGuard]},
  { path: `songs/:spotifyId`, component: SongDetails },
  { path: `albums/:spotifyId`, component: AlbumDetails },
  { path: `artists/:spotifyId`, component: ArtistDetails },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
