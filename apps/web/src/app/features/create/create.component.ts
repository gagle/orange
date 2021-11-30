import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Post } from '@orange/api-interfaces';
import { Subject, takeUntil } from 'rxjs';

import { PostsService } from '../../api';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePageComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup;
  saved = false;

  private destroy$ = new Subject<void>();

  constructor(private readonly postsService: PostsService, private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      userId: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required]),
    });
  }

  submitCreatePost(): void {
    const post: Post = {
      userId: Number.parseInt(this.formGroup.controls.userId.value),
      title: this.formGroup.controls.title.value,
      body: this.formGroup.controls.body.value,
    };
    this.postsService
      .createPost(post)
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
}
