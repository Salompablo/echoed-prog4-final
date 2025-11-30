import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageDropdown } from '../language-dropdown/language-dropdown';


@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslateModule, LanguageDropdown],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {


}
