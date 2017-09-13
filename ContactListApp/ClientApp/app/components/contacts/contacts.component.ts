import { Component, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
    selector: 'contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.css']
})
export class ContactsComponent {
	private http : Http;
	public op : string = "add";
    public contacts: Contact[];
	public types : PhoneType[];
	public tags : Tag[];
	public selectedTags : Tag[] = [];
	public tempMessage : TempMessage;
	public contactTags : ContactTag[] = [];
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
		emails : this.emails,
		contactTags : this.contactTags,
		tags : this.selectedTags
	};

    constructor(http: Http, @Inject('BASE_URL') baseUrl: string) {
        http.get(baseUrl + 'api/contacts').subscribe(result => {
            this.contacts = result.json() as Contact[];
        }, error => console.error(error));

		this.http = http;
		this.phoneNumbers.push(this.phoneNumber);
		this.emails.push(this.email);
    }

	search(category : string, query : string, event : any) : void {
		event.stopPropagation();
		this.http.get('api/contacts/search?' + 'category=' + category + '&query=' + query).subscribe(result => {
            this.contacts = result.json() as Contact[];
        }, error => console.error(error));
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
	}

	addNewEmail() : void {
		var newEmail : Email = {
		id : 0,
		emailAddress : ""
		};
		this.emails.push(newEmail);
		console.log(this.newContact);
	};

	deleteEmail(index : number) : void {
		this.emails.splice(index, 1);
	}

	addEditContact(){
		if (this.op == "add") this.addContact();
		else if (this.op == "edit") this.editContact();
	}

	addContact() : void {
		var headers = new Headers();
        headers.append('Content-Type', 'application/json');

		for(let number of this.phoneNumbers){
			if(number.number == ""){
				this.phoneNumbers.splice(this.phoneNumbers.indexOf(number), 1);
			}
		}
		this.newContact.numbers = this.phoneNumbers;

		for(let email of this.emails){
			if(email.emailAddress == ""){
				this.emails.splice(this.emails.indexOf(email), 1);
			}
		}
		this.newContact.emails = this.emails;
		
		for(let tag of this.tags){
			if(tag.checked){
				let contactTag : ContactTag = {
					contactId : this.newContact.id,
					tagId : tag.id
				};
				this.contactTags.push(contactTag);
			}
		}

		this.newContact.contactTags = this.contactTags;

		this.http.post("api/Contacts/", this.newContact, {headers: headers})
			.map(response => response.json() as Contact)
			.subscribe(result => {
				this.contacts.push(result);

				this.resetForm();

				this.showTempMessage("Kontakt " + result.firstName + " " + result.lastName +  " uspješno dodan!", true);
			},
			error => {
				this.showTempMessage("Greška pri dodavanju kontakta!", false);
				console.log(error);
			});
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
		console.log(this.newContact);

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

	resetForm(){
		this.phoneNumbers = [];
		this.phoneNumber.number = "";
		this.phoneNumbers.push(this.phoneNumber);

		this.emails = [];
		this.email.emailAddress = "";
		this.emails.push(this.email);

		this.newContact.firstName = "";
		this.newContact.lastName = "";
		this.newContact.address = "";
		this.newContact.numbers = this.phoneNumbers;
		this.newContact.emails = this.emails;
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
	contactTags : ContactTag[];
	tags : Tag[];
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

interface ContactTag {
	contactId : number;
	tagId : number;
}

interface TempMessage {
	message : string;
	status : boolean;
}
