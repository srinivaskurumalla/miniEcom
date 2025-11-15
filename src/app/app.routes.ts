import { Routes } from '@angular/router';
import { ProductsComponent } from './components/product/products/products.component';
import { AddProductComponent } from './components/product/add-product/add-product.component';
import { RegisterComponent } from './components/User/register/register.component';
import { LoginComponent } from './components/User/login/login.component';
import { ProductDetailsComponent } from './components/product/product-details/product-details.component';
import { CartItemsComponent } from './components/Cart/cart-items/cart-items.component';
import { AddressesComponent } from './components/User/addresses/addresses.component';
import { ProfileComponent } from './components/User/profile/profile.component';
import { CheckoutComponent } from './components/orders/checkout/checkout.component';

export const routes: Routes = [
    { path: '', component: ProductsComponent },

    { path: 'products', component: ProductsComponent },
    { path: 'add-product', component: AddProductComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'product-details/:id', component: ProductDetailsComponent },
    { path: 'cart', component: CartItemsComponent },
    { path: 'addresses', component: AddressesComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'checkout', component: CheckoutComponent },
];
