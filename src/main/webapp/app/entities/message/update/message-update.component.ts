import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IMessage, Message } from '../message.model';
import { MessageService } from '../service/message.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IConversation } from 'app/entities/conversation/conversation.model';
import { ConversationService } from 'app/entities/conversation/service/conversation.service';

@Component({
  selector: 'jhi-message-update',
  templateUrl: './message-update.component.html',
})
export class MessageUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  conversationsSharedCollection: IConversation[] = [];

  editForm = this.fb.group({
    id: [],
    text: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
    sendDate: [null, [Validators.required]],
    seen: [null, [Validators.required]],
    user: [],
    conversation: [],
  });

  constructor(
    protected messageService: MessageService,
    protected userService: UserService,
    protected conversationService: ConversationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ message }) => {
      if (message.id === undefined) {
        const today = dayjs().startOf('day');
        message.sendDate = today;
      }

      this.updateForm(message);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const message = this.createFromForm();
    if (message.id !== undefined) {
      this.subscribeToSaveResponse(this.messageService.update(message));
    } else {
      this.subscribeToSaveResponse(this.messageService.create(message));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackConversationById(index: number, item: IConversation): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMessage>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(message: IMessage): void {
    this.editForm.patchValue({
      id: message.id,
      text: message.text,
      sendDate: message.sendDate ? message.sendDate.format(DATE_TIME_FORMAT) : null,
      seen: message.seen,
      user: message.user,
      conversation: message.conversation,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, message.user);
    this.conversationsSharedCollection = this.conversationService.addConversationToCollectionIfMissing(
      this.conversationsSharedCollection,
      message.conversation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.conversationService
      .query()
      .pipe(map((res: HttpResponse<IConversation[]>) => res.body ?? []))
      .pipe(
        map((conversations: IConversation[]) =>
          this.conversationService.addConversationToCollectionIfMissing(conversations, this.editForm.get('conversation')!.value)
        )
      )
      .subscribe((conversations: IConversation[]) => (this.conversationsSharedCollection = conversations));
  }

  protected createFromForm(): IMessage {
    return {
      ...new Message(),
      id: this.editForm.get(['id'])!.value,
      text: this.editForm.get(['text'])!.value,
      sendDate: this.editForm.get(['sendDate'])!.value ? dayjs(this.editForm.get(['sendDate'])!.value, DATE_TIME_FORMAT) : undefined,
      seen: this.editForm.get(['seen'])!.value,
      user: this.editForm.get(['user'])!.value,
      conversation: this.editForm.get(['conversation'])!.value,
    };
  }
}
