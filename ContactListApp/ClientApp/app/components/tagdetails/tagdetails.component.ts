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
		this.router = router;
		this.activatedRoute = activatedRoute;
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

	editTag() : void {
		var headers = new Headers();
        headers.append('Content-Type', 'application/json');

		this.http.put("api/Tags/" + this.tag.id, this.tag, {headers: headers})
			.map(response => response.json() as Tag)
			.subscribe(result => {
				this.showTempMessage("Grupa " + this.tag.name + " uspješno uređena!", true);
			},
			error => {
				this.showTempMessage("Greška pri uređivanju grupe!", false);
			});
	}

	deleteTag() : void {
		if(confirm("Jeste li sigurni?")){
		var path = this.activatedRoute.snapshot.url[1].path;
			this.http.delete("api/Tags/" + path)
				.subscribe(response => {
					this.router.navigate(['/tags']);
				},
				error => {
					this.showTempMessage("Greška pri brisanju grupe!", false);
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
