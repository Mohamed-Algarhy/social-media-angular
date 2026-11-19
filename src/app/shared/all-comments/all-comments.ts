import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommentService } from '../../core/auth/services/comment-service';
import { Comment } from '../../core/interfaces/Comment';
import { Auth } from '../../core/auth/services/auth';

@Component({
  selector: 'app-all-comments',
  imports: [],
  templateUrl: './all-comments.html',
  styleUrls: ['./all-comments.css'],
})
export class AllComments implements OnInit {
  postId = input<string>('');
  allComments = signal<Comment[]>([]);
  commentText = signal('');
  isSubmitting = signal(false);
  errorMessage = signal('');

  private readonly commentService = inject(CommentService);
  readonly authService = inject(Auth);

  ngOnInit(): void {
    this.getAllComments();
  }
  getAllComments() {
    if (this.postId()) {
      this.commentService.getPostComments(this.postId(), 10).subscribe({
        next: (res) => {
          this.allComments.set(res?.data?.comments ?? []);
        },
        error: (err) => {
          console.error('Error fetching comments:', err);
          this.errorMessage.set('Unable to load comments.');
        },
      });
    }
  }

  createComment(): void {
    const content = this.commentText().trim();
    if (!content || !this.postId() || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.commentService.createComment(this.postId(), content).subscribe({
      next: (res) => {
        const createdComment = res?.data?.comment as Comment | undefined;
        if (createdComment) {
          this.allComments.update((comments) => [createdComment, ...comments]);
        } else {
          this.getAllComments();
        }
        this.commentText.set('');
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error('Error creating comment:', err);
        this.errorMessage.set('Unable to add comment.');
        this.isSubmitting.set(false);
      },
    });
  }

  deleteComment(commentId: string): void {
    if (!commentId || !confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    this.errorMessage.set('');
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.allComments.update((comments) =>
          comments.filter((comment) => comment._id !== commentId),
        );
      },
      error: (err) => {
        console.error('Error deleting comment:', err);
        this.errorMessage.set('Unable to delete comment.');
      },
    });
  }

  isCommentOwner(comment: Comment): boolean {
    return comment.commentCreator?._id === this.authService.userData()._id;
  }
}
