import { Component, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
    selector: 'contacts',
    templateUrl: './contacts.component.html'
})
export class ContactsComponent {
	private http : Http;
    public contacts: Contact[];
	public types : PhoneType[];
	public tags : Tag[];
	public selectedTags : Tag[] = [];
	public tempMessage : TempMessage;
	public phoneNumber : PhoneNumber = {
		id : 0,
		number : "",
		phoneTypeId : 1
	};
	public phoneNumbers : PhoneNumber[] = [];

	public email : Email = {
		id : 0,
		emailAddress : ""
	}
	public emails : Email[] = [];

	public newContact : Contact = {
		id : 0,
		firstName : "",
		lastName : "",
		address : "",
		numbers : this.phoneNumbers,
		emails : this.emails
	};

    constructor(http: Http, @Inject('BASE_URL') baseUrl: string) {
        http.get(baseUrl + 'api/contacts').subscribe(result => {
            this.contacts = result.json() as Contact[];
        }, error => console.error(error));

		this.http = http;
		this.phoneNumbers.push(this.phoneNumber);
		this.emails.push(this.email);
    }

	deleteContact(contact : Contact) : void {
		if(confirm("Jeste li sigurni?")){
			this.http.delete("api/Contacts/" + contact.id)
				.subscribe(response => {
					this.contacts.splice(this.contacts.indexOf(contact), 1);
					this.showTempMessage("Kontakt " + contact.firstName + " " + contact.lastName + " uspješno obrisan!", true);
				},
				error => {
					this.showTempMessage("Greška pri brisanju kontakta!", false);
				});
		}
	}

	addNewNumber() : void {
		var newPhoneNumber : PhoneNumber = {
			id : 0,
			number : "",
			phoneTypeId : 1
		};
		this.phoneNumbers.push(newPhoneNumber);
	}

	deleteNumber(index : number) {
		this.phoneNumbers.splice(index, 1);
		console.log(this.phoneNumbers);
	}

	addNewEmail() : void {
		var newEmail : Email = {
		id : 0,
		emailAddress : ""
		};
		this.emails.push(newEmail);
	};

	deleteEmail(index : number) : void {
		this.emails.splice(index, 1);
	}

	addContact() : void {
		var headers = new Headers();
        headers.append('Content-Type', 'application/json');
		this.newContact.numbers = this.phoneNumbers;
		this.newContact.emails = this.emails;
		
		this.selectedTags = [];
		for(let tag of this.tags){
			if(tag.checked){
				this.selectedTags.push(tag);
			}
		}

		this.http.post("api/Contacts/", this.newContact, {headers: headers})
			.map(response => response.json() as Contact)
			.subscribe(result => {
				this.contacts.push(result);
				this.showTempMessage("Kontakt " + result.firstName + " " + result.lastName +  " uspješno dodan!", true);
			},
			error => {
				this.showTempMessage("Greška pri dodavanju kontakta!", false);
				console.log(error);
			});
	}

	populatePhoneTypes() : void {
		this.http.get('api/phonetypes').subscribe(result => {
			this.types = result.json() as PhoneType[];
		}, error => console.error(error));
	}

	populateTags() : void {
		this.http.get('api/tags').subscribe(result => {
				this.tags = result.json() as Tag[];
				for(let tag of this.tags){
					tag.checked = false;
				}
		}, error => console.error(error));
	}

	get selectedOptions() {
		return this.tags
			.filter(opt => opt.checked)
			.map(opt => opt.id)
	}

	showTempMessage(message : string, status : boolean) : void {
		this.tempMessage = {
			message : message,
			status : status
		};
	}
}

interface Contact {
	id: number;
    firstName: string;
	lastName: string;
	address : string;
	numbers : PhoneNumber[];
	emails : Email[];
}

interface PhoneNumber {
	id : number;
	number : string;
	phoneTypeId : number;
}

interface Email {
	id : number;
	emailAddress : string;
}

interface PhoneType {
	id : number;
	type : string;
}

interface Tag {
	id : number;
	name: string;
	checked : boolean;
	count : number;
}

interface TempMessage {
	message : string;
	status : boolean;
}
