import { Component, Inject } from '@angular/core';
import { Http } from '@angular/http';

@Component({
    selector: 'tags',
    templateUrl: './tags.component.html'
})
export class TagsComponent {
    public tags: Tag[];
	public selectedTag : Tag;

    constructor(http: Http, @Inject('BASE_URL') baseUrl: string) {
        http.get(baseUrl + 'api/tags').subscribe(result => {
            this.tags = result.json() as Tag[];
        }, error => console.error(error));
    }

	onSelect(tag : Tag): void {
		this.selectedTag = tag;
	}
}

interface Tag {
	id: number;
    name: string;
	count: number;
}
