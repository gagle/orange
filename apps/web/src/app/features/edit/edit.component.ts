import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from '@orange/api-interfaces';
import { first, map, Subject, takeUntil } from 'rxjs';

import { PostsService } from '../../api';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPageComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup;
  postId!: number;
  saved = false;

  private destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly postsService: PostsService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(map(params => Number.parseInt(params.postId))).subscribe(postId => {
      this.postId = postId;
    });

    this.formGroup = new FormGroup({
      userId: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required]),
    });

    this.loadPost();
  }

  submitEditPost(): void {
    const post: Post = {
      id: this.postId,
      userId: this.formGroup.controls.userId.value,
      title: this.formGroup.controls.title.value,
      body: this.formGroup.controls.body.value,
    };
    this.postsService
      .updatePost(post)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.saved = true;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPost(): void {
    this.postsService
      .getPost(this.postId)
      .pipe(takeUntil(this.destroy$), first())
      .subscribe(post => {
        this.formGroup.controls.userId.patchValue(post.user.id);
        this.formGroup.controls.title.patchValue(post.title);
        this.formGroup.controls.body.patchValue(post.body);
      });
  }
}
