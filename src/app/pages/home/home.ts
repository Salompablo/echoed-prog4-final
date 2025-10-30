import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Features } from '../../components/features/features';
import { Hero } from '../../components/hero/hero';

@Component({
  selector: 'app-home',
  imports: [Hero, Features],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
