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

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'oauth2/redirect', component: Oauth2Callback },
  { path: 'profile', component: UserProfile, canActivate: [authGuard] },
  { path: 'about-us', component: AboutUs },
  { path: `songs/:spotifyId`, component: SongDetails },
  { path: `albums/:spotifyId`, component: AlbumDetails },
  { path: `artists/:spotifyId`, component: ArtistDetails },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
