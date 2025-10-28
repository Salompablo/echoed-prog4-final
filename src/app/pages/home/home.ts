import { Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';
import { Features } from '../../components/features/features';

@Component({
  selector: 'app-home',
  imports: [Features],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {


}
