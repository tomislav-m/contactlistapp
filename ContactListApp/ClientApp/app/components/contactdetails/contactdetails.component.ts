import { Component, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
    selector: 'app-contactdetails',
    templateUrl: './contactdetails.component.html'
})

export class ContactdetailsComponent
{
	public phoneNumber : PhoneNumber = {
		id : 0,
		number : "",
		phoneTypeId : 1,
		type : ""
	};
	public phoneNumbers : PhoneNumber[] = [];
	public types : PhoneType[];
	public contactTags : ContactTag[] = [];
	contacts : Contact[];

	public email : Email = {
		id : 0,
		emailAddress : ""
	}
	public emails : Email[] = [];

	public tag : Tag = {
		id : 0,
		name : "",
		contacts : this.contacts,
		checked : false
	};
	public tags : Tag[];
	public contact : Contact = {
		id : 0,
		firstName : "",
		lastName : "",
		address : "",
		numbers : this.phoneNumbers,
		emails : this.emails,
		tags : this.tags,
		contactTags : this.contactTags
	};
	public newContact : Contact = {
		id : 0,
		firstName : "",
		lastName : "",
		address : "",
		numbers : this.phoneNumbers,
		emails : this.emails,
		tags : this.tags,
		contactTags : this.contactTags
	};
	public tempMessage : TempMessage;
	public http : Http;

    constructor(http: Http, @Inject('BASE_URL') baseUrl: string, private router: Router, private activatedRoute: ActivatedRoute) {
		var path = activatedRoute.snapshot.url[1].path;
        http.get(baseUrl + 'api/contacts/' + path).subscribe(result => {
            this.contact = result.json() as Contact;
        }, error => console.error(error));
		this.http = http;
		this.populateTags();
		this.populatePhoneTypes();
    }

	deleteContact(contact : Contact) : void {
		if(confirm("Jeste li sigurni?")){
			var path = this.activatedRoute.snapshot.url[1].path;
			this.http.delete("api/Contacts/" + path)
				.subscribe(response => {
					this.router.navigate(['/home']);
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

	onClickEditContact(){
		this.newContact.id = this.contact.id;
		this.newContact.firstName = this.contact.firstName;
		this.newContact.lastName = this.contact.lastName;
		this.newContact.address = this.contact.address;
		this.newContact.numbers = this.contact.numbers;
		this.newContact.emails = this.contact.emails;
		this.newContact.tags = this.contact.tags;
		this.phoneNumbers = this.newContact.numbers;
		this.emails = this.newContact.emails;
		for(let tag of this.newContact.tags){
			this.tags.filter(t => t.id === tag.id)[0].checked = true;
		}
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
				var path = this.activatedRoute.snapshot.url[1].path;
				this.showTempMessage("Kontakt " + this.newContact.firstName + " " + this.newContact.lastName +  " uspješno uređen!", true);
				
				this.contact = this.newContact;
				for(let tag of this.contact.tags){
					this.tags.filter(t => t.id === tag.id)[0].checked = true;
				}
				this.contact.tags = [];
				for(let tag of this.tags){
					this.contact.tags.push(tag);
				}

				for(let number of this.contact.numbers){
					number.type = this.types.filter(t => t.id == number.phoneTypeId)[0].type;
				}
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
	tags : Tag[];
	contactTags : ContactTag[];
}

interface PhoneType {
	id : number;
	type : string;
}

interface PhoneNumber {
	id : number;
	number : string;
	phoneTypeId : number;
	type: string;
}

interface Email {
	id : number;
	emailAddress : string;
}

interface Tag {
	id : number;
	name: string;
	contacts: Contact[];
	checked: boolean;
}

interface ContactTag {
	contactId : number;
	tagId : number;
}

interface TempMessage {
	message : string;
	status : boolean;
}
