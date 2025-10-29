import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from "./components/footer/footer";
import { ToastContainer } from "./components/toast-container/toast-container";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('echoed-final-prog4');
}
