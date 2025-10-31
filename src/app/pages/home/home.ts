import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Features } from '../../components/features/features';
import { Hero } from '../../components/hero/hero';
import { SongCarousel } from "../../components/song-carousel/song-carousel";
import { AlbumCarousel } from "../../components/album-carousel/album-carousel";

@Component({
  selector: 'app-home',
  imports: [Hero, Features, SongCarousel, AlbumCarousel],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
