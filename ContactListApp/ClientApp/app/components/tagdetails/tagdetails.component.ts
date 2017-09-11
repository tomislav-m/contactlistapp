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
			console.log(this.tag);
        }, error => console.error(error));
		this.http = http;
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
