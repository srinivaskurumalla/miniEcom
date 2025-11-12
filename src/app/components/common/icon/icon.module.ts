import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ShoppingCart, User, Heart, Trash, Trash2 } from 'lucide-angular';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LucideAngularModule.pick({ ShoppingCart, User, Heart, Trash, Trash2 })
  ],
  exports: [LucideAngularModule]
})
export class IconModule { }
