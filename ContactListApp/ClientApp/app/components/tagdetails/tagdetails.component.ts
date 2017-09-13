import { Component, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
    selector: 'tagdetails',
    templateUrl: './tagdetails.component.html'
})
export class TagdetailsComponent {
	public tags : Tag[];
	public selectedTags : Tag[] = [];
	public contactTags : ContactTag[] = [];
	public types : PhoneType[];
	public tempMessage : TempMessage;
	private http : Http;
	contacts : Contact[];
	public tag : Tag = {
		id : 0,
		name : "",
		contacts : this.contacts,
		checked : false
	};
		public phoneNumber : PhoneNumber = {
		id : 0,
		number : "",
		phoneTypeId : 1,
		type : ""
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
		emails : this.emails,
		contactTags : this.contactTags,
		tags : this.selectedTags
	};

    constructor(http: Http, @Inject('BASE_URL') baseUrl: string, private router: Router, private activatedRoute: ActivatedRoute) {
		var path = activatedRoute.snapshot.url[1].path;
        http.get(baseUrl + 'api/tags/' + path).subscribe(result => {
            this.tag = result.json() as Tag;
        }, error => console.error(error));
		this.http = http;
		this.router = router;
		this.activatedRoute = activatedRoute;
		this.populateTags();
		this.populatePhoneTypes();
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

	addNewNumber() : void {
		var newPhoneNumber : PhoneNumber = {
			id : 0,
			number : "",
			phoneTypeId : 1,
			type : ""
		};
		this.phoneNumbers.push(newPhoneNumber);
	}

	deleteNumber(index : number) {
		this.phoneNumbers.splice(index, 1);
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

	onClickEditContact(contact : Contact){
		this.http.get('api/contacts/' + contact.id).subscribe(result => {
            this.newContact = result.json() as Contact;
			this.phoneNumbers = this.newContact.numbers;
			this.emails = this.newContact.emails;
			let selectedTags : Tag[] = [];
			for(let tag of this.newContact.tags){
				this.tags.filter(t => t.id === tag.id)[0].checked = true;
			}
        }, error => console.error(error));
	}

	editContact() {
		var headers = new Headers();
        headers.append('Content-Type', 'application/json');

		for(let tag of this.tags){
			if(tag.checked){
				let contactTag : ContactTag = {
					contactId : this.newContact.id,
					tagId : tag.id
				};
				this.contactTags.push(contactTag);
			}
		}

		this.newContact.emails = this.emails;
		this.newContact.numbers = this.phoneNumbers;
		this.newContact.contactTags = this.contactTags;

		this.http.put("/api/Contacts/" + this.newContact.id, this.newContact, {headers: headers})
			.map(response => response.json() as Contact)
			.subscribe(result => {
				let contact = this.contacts.filter(c => c.id === this.newContact.id)[0];
				contact.firstName = this.newContact.firstName;
				contact.lastName = this.newContact.lastName;
				this.showTempMessage("Kontakt " + this.newContact.firstName + " " + this.newContact.lastName +  " uspješno uređen!", true);

				
			},
			error => {
				this.showTempMessage("Greška pri uređivanju kontakta!", false);
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
	contactTags : ContactTag[];
	tags : Tag[];
}

interface PhoneNumber {
	id : number;
	number : string;
	phoneTypeId : number;
	type : string;
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
	contacts : Contact[];
	checked : boolean;
}

interface ContactTag {
	contactId : number;
	tagId : number;
}

interface TempMessage {
	message : string;
	status : boolean;
}
