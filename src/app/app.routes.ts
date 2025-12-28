import { Routes } from '@angular/router';
import { PrevSetupComponent } from './pages/prev-setup/prev-setup.component';
import { HomeComponent } from './pages/home/home.component';
import { GameComponent } from './pages/game/game.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'prev-setup', component: PrevSetupComponent },
    { path: 'game', component: GameComponent },
  { path: '**', redirectTo: '' }
];