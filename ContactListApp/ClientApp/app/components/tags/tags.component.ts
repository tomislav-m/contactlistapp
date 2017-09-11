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
	public newTag : NewTag = {
		id : 0, 
		name : ""
	};
	public tempMessage : TempMessage;
	public index : number;

    constructor(http: Http, @Inject('BASE_URL') baseUrl: string) {
        http.get(baseUrl + 'api/tags').subscribe(result => {
            this.tags = result.json() as Tag[];
        }, error => console.error(error));
		this.http = http;
    }

	addTag() : void {
		var headers = new Headers();
        headers.append('Content-Type', 'application/json');

		this.http.post("api/Tags", this.newTag, {headers: headers})
			.map(response => response.json() as Tag)
			.subscribe(result => {
				result.count = 0;
				this.tags.push(result);
				this.newTag.name = "";
				this.showTempMessage("Grupa " + result.name + " uspješno dodana!", true);
			},
			error => {
				this.showTempMessage("Greška pri dodavanju grupe!", false);
			});
	}

	onClickEditTag(tag : Tag){
		this.newTag.id = tag.id;
		this.newTag.name = tag.name;
		this.index = this.tags.indexOf(tag);
	}

	editTag() : void {
		var headers = new Headers();
        headers.append('Content-Type', 'application/json');

		this.http.put("api/Tags/" + this.newTag.id, this.newTag, {headers: headers})
			.map(response => response.json() as Tag)
			.subscribe(result => {
				this.tags[this.index].name = this.newTag.name;
				this.showTempMessage("Grupa " + this.newTag.name + " uspješno uređena!", true);
				this.newTag.name = "";
			},
			error => {
				this.showTempMessage("Greška pri uređivanju grupe!", false);
			});
	}

	deleteTag(tag : Tag) : void {
		if(confirm("Jeste li sigurni?")){
			this.http.delete("api/Tags/" + tag.id)
				.subscribe(response => {
					this.tags.splice(this.tags.indexOf(tag), 1);
					this.showTempMessage("Grupa " + tag.name + " uspješno obrisana!", true);
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
	count: number;
}

interface NewTag {
	id : number;
	name: string;
}

interface TempMessage {
	message : string;
	status : boolean;
}
