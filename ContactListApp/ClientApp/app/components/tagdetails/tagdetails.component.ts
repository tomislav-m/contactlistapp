import { Component, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
    selector: 'tagdetails',
    templateUrl: './tagdetails.component.html'
})
export class TagdetailsComponent {
	public tempMessage : TempMessage;
	private http : Http;
	contacts : Contact[];
	public tag : Tag = {
		id : 0,
		name : "",
		contacts : this.contacts
	};

    constructor(http: Http, @Inject('BASE_URL') baseUrl: string, private router: Router, private activatedRoute: ActivatedRoute) {
		var path = activatedRoute.snapshot.url[1].path;
        http.get(baseUrl + 'api/tags/' + path).subscribe(result => {
            this.tag = result.json() as Tag;
        }, error => console.error(error));
		this.http = http;
    }

	deleteContact(contact : Contact) : void {
		if(confirm("Jeste li sigurni?")){
			this.http.delete("api/Contacts/" + contact.id)
				.subscribe(response => {
					this.tag.contacts.splice(this.tag.contacts.indexOf(contact), 1);
					this.showTempMessage("Kontakt " + contact.firstName + " " + contact.lastName + " uspješno obrisan!", true);
				},
				error => {
					this.showTempMessage("Greška pri brisanju kontakta!", false);
				});
		}
	}

	showTempMessage(message : string, status : boolean) : void {
		this.tempMessage = {
			message : message,
			status : status
		};
	}
}

interface Tag {
	id : number;
	name: string;
	contacts: Contact[];
}

interface Contact {
	id: number;
	firstName: string;
	lastName: string;
}

interface TempMessage {
	message : string;
	status : boolean;
}
