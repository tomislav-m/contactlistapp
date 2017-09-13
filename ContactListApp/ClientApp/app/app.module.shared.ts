import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { TagsComponent } from './components/tags/tags.component';
import { TagdetailsComponent } from './components/tagdetails/tagdetails.component';
import { ContactdetailsComponent } from './components/contactdetails/contactdetails.component';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
		ContactsComponent,
		TagsComponent,
		TagdetailsComponent,
		ContactdetailsComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
			{ path: 'home', component: ContactsComponent },
			{ path: 'tags', component: TagsComponent },
			{ path: 'tagdetails/:id', component: TagdetailsComponent },
			{ path: 'contactdetails/:id', component: ContactdetailsComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ]
})
export class AppModuleShared {
}
