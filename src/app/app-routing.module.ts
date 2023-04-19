import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth.guard';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { SuggestedProductComponent } from './suggested-product/suggested-product.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [

  {
    path: 'login', component: LoginComponent,
    
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'home',component: HomeComponent,
  },
  {
    path: '',component: SuggestedProductComponent,
  },
  {
    path: 'products', component:ProductsComponent
  },
  {
    path:'product-details/:productId',component: ProductDetailsComponent
  },
  {
    path:'cart',component:CartComponent
  },
  {
    path:'order',component:OrderComponent
  },
  {
    path:'Admin',component:AdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
