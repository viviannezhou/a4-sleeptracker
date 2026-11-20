import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    // the tabs page wraps everything, so the tab bar is always visible
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      { path: 'home', loadComponent: () => import('./home/home.page').then((m) => m.HomePage) },
      { path: 'history', loadComponent: () => import('./history/history.page').then((m) => m.HistoryPage) },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  // open the app on the Today tab
  { path: '', redirectTo: 'tabs/home', pathMatch: 'full' },
];