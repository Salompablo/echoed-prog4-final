import { Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';
import { Hero } from "../../components/hero/hero";

@Component({
  selector: 'app-home',
  imports: [Hero],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {


}
