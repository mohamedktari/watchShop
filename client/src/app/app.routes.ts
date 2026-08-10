import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
      { path: 'produit/:id', loadComponent: () => import('./pages/product-detail/product-detail').then((m) => m.ProductDetail) },
      { path: 'commander/:productId', loadComponent: () => import('./pages/order-form/order-form').then((m) => m.OrderForm) },
    ],
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./admin/login/login').then((m) => m.AdminLogin),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/layout/admin-layout').then((m) => m.AdminLayout),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'commandes', pathMatch: 'full' },
      { path: 'commandes', loadComponent: () => import('./admin/dashboard/dashboard').then((m) => m.AdminDashboard) },
      { path: 'produits', loadComponent: () => import('./admin/products/products').then((m) => m.AdminProducts) },
    ],
  },
  { path: '**', redirectTo: '' },
];
