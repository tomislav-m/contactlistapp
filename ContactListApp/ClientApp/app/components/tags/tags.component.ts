import { Component, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
    selector: 'tags',
    templateUrl: './tags.component.html'
})
export class TagsComponent {
	private http : Http;
    public tags: Tag[];
	public selectedTag : Tag;
	public newTag : NewTag = {
		id : 0, 
		name : ""
	};

    constructor(http: Http, @Inject('BASE_URL') baseUrl: string) {
        http.get(baseUrl + 'api/tags').subscribe(result => {
            this.tags = result.json() as Tag[];
        }, error => console.error(error));
		this.http = http;
    }

	onSelect(tag : Tag): void {
		this.selectedTag = tag;
	}

	addTag() : void {
		var headers = new Headers();
        headers.append('Content-Type', 'application/json');

		this.http.post("api/Tags", this.newTag, {headers: headers})
			.map(response => response.json() as Tag)
			.subscribe(newTag =>{
				
			},
			error =>{
				console.log(error);
			});
	}
}

interface Tag {
	id : number;
    name: string;
	count: number;
}

interface NewTag {
	id : number;
	name: string;
}

