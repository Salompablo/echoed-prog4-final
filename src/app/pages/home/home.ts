import { Component, inject, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
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
export class Home implements AfterViewInit {
  ngAfterViewInit(): void {
    this.setupScrollAnimations();
  }

  private setupScrollAnimations(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.carousel-section');
    animatedElements.forEach(el => observer.observe(el));
  }
}
