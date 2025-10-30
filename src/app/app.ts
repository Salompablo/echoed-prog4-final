import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from "./components/footer/footer";
import { ToastContainer } from "./components/toast-container/toast-container";
import { SessionExpiredModal } from "./components/session-expired-modal/session-expired-modal";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, ToastContainer, SessionExpiredModal],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('echoed-final-prog4');
}
