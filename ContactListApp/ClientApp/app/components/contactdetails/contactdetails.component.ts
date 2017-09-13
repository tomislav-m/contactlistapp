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
	contacts : Contact[];

	public email : Email = {
		id : 0,
		emailAddress : ""
	}
	public emails : Email[] = [];

	public tag : Tag = {
		id : 0,
		name : "",
		contacts : this.contacts
	};
	public tags : Tag[];
	public contact : Contact = {
		id : 0,
		firstName : "",
		lastName : "",
		address : "",
		numbers : this.phoneNumbers,
		emails : this.emails,
		tags : this.tags
	};
	public tempMessage : TempMessage;
	public http : Http;

    constructor(http: Http, @Inject('BASE_URL') baseUrl: string, private router: Router, private activatedRoute: ActivatedRoute) {
		var path = activatedRoute.snapshot.url[1].path;
        http.get(baseUrl + 'api/contacts/' + path).subscribe(result => {
            this.contact = result.json() as Contact;
			console.log(this.contact);
        }, error => console.error(error));
		this.http = http;
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
}

interface TempMessage {
	message : string;
	status : boolean;
}
