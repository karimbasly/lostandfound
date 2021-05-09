jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MessageService } from '../service/message.service';
import { IMessage, Message } from '../message.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IConversation } from 'app/entities/conversation/conversation.model';
import { ConversationService } from 'app/entities/conversation/service/conversation.service';

import { MessageUpdateComponent } from './message-update.component';

describe('Component Tests', () => {
  describe('Message Management Update Component', () => {
    let comp: MessageUpdateComponent;
    let fixture: ComponentFixture<MessageUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let messageService: MessageService;
    let userService: UserService;
    let conversationService: ConversationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MessageUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MessageUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MessageUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      messageService = TestBed.inject(MessageService);
      userService = TestBed.inject(UserService);
      conversationService = TestBed.inject(ConversationService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const message: IMessage = { id: 456 };
        const user: IUser = { id: 48385 };
        message.user = user;

        const userCollection: IUser[] = [{ id: 2487 }];
        spyOn(userService, 'query').and.returnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [user];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        spyOn(userService, 'addUserToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ message });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Conversation query and add missing value', () => {
        const message: IMessage = { id: 456 };
        const conversation: IConversation = { id: 9035 };
        message.conversation = conversation;

        const conversationCollection: IConversation[] = [{ id: 21040 }];
        spyOn(conversationService, 'query').and.returnValue(of(new HttpResponse({ body: conversationCollection })));
        const additionalConversations = [conversation];
        const expectedCollection: IConversation[] = [...additionalConversations, ...conversationCollection];
        spyOn(conversationService, 'addConversationToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ message });
        comp.ngOnInit();

        expect(conversationService.query).toHaveBeenCalled();
        expect(conversationService.addConversationToCollectionIfMissing).toHaveBeenCalledWith(
          conversationCollection,
          ...additionalConversations
        );
        expect(comp.conversationsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const message: IMessage = { id: 456 };
        const user: IUser = { id: 97240 };
        message.user = user;
        const conversation: IConversation = { id: 88786 };
        message.conversation = conversation;

        activatedRoute.data = of({ message });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(message));
        expect(comp.usersSharedCollection).toContain(user);
        expect(comp.conversationsSharedCollection).toContain(conversation);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const message = { id: 123 };
        spyOn(messageService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ message });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: message }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(messageService.update).toHaveBeenCalledWith(message);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const message = new Message();
        spyOn(messageService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ message });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: message }));
        saveSubject.complete();

        // THEN
        expect(messageService.create).toHaveBeenCalledWith(message);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const message = { id: 123 };
        spyOn(messageService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ message });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(messageService.update).toHaveBeenCalledWith(message);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackConversationById', () => {
        it('Should return tracked Conversation primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackConversationById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
