import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  enterSearchValue = '';
  @Output() searchTextChanged = new EventEmitter<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  onSearchTextChanged(): void {
    if (this.enterSearchValue.length >= 4) {
      this.searchTextChanged.emit(this.enterSearchValue);
    } else if (!this.enterSearchValue) {
      this.searchTextChanged.emit('');
    } else {
      console.error('Search value must be at least 3 characters long');
    }
  }
}