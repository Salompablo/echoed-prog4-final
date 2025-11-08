import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Features } from '../../components/features/features';
import { Hero } from '../../components/hero/hero';
import { ReviewCarousel } from "../../components/review-carousel/review-carousel";
import { SongCarousel } from "../../components/song-carousel/song-carousel";
import { AlbumCarousel } from "../../components/album-carousel/album-carousel";
import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-home',
  imports: [Hero, Features, ReviewCarousel, SongCarousel, AlbumCarousel],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
