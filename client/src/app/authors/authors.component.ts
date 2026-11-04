import {Component, DestroyRef, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {BooksService} from '../books/service/books.service';
import {AuthorDetails} from '../books/model/book';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './authors.component.html'
})
export class AuthorsComponent {
  authorId = '';
  author: AuthorDetails | null = null;
  message = '';
  loading = false;
  private booksService = inject(BooksService);
  private destroyRef = inject(DestroyRef);

  search(): void {
    if (this.loading) return;
    this.author = null;
    this.message = '';
    const id = this.authorId.trim();
    if (!/^[1-9]\d*$/.test(id)) {
      this.message = 'Enter a positive whole number for the author ID.';
      return;
    }
    this.loading = true;
    this.booksService.getAuthor(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: author => {
        this.author = author;
        this.loading = false;
      },
      error: error => {
        this.message = error.status === 404
          ? `No author found with ID ${id}.`
          : 'Unable to retrieve the author. Please try again.';
        this.loading = false;
      }
    });
  }
}
