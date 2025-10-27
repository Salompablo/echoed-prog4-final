import { Component } from '@angular/core';
import { SearchBar } from "../search-bar/search-bar";

@Component({
  selector: 'app-hero',
  imports: [SearchBar],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {

}
