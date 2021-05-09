package com.epi.lostandfound.service.impl;

import com.epi.lostandfound.domain.Conversation;
import com.epi.lostandfound.repository.ConversationRepository;
import com.epi.lostandfound.service.ConversationService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Conversation}.
 */
@Service
@Transactional
public class ConversationServiceImpl implements ConversationService {

    private final Logger log = LoggerFactory.getLogger(ConversationServiceImpl.class);

    private final ConversationRepository conversationRepository;

    public ConversationServiceImpl(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    @Override
    public Conversation save(Conversation conversation) {
        log.debug("Request to save Conversation : {}", conversation);
        return conversationRepository.save(conversation);
    }

    @Override
    public Optional<Conversation> partialUpdate(Conversation conversation) {
        log.debug("Request to partially update Conversation : {}", conversation);

        return conversationRepository
            .findById(conversation.getId())
            .map(
                existingConversation -> {
                    if (conversation.getTitle() != null) {
                        existingConversation.setTitle(conversation.getTitle());
                    }
                    if (conversation.getCreationDate() != null) {
                        existingConversation.setCreationDate(conversation.getCreationDate());
                    }
                    if (conversation.getLogo() != null) {
                        existingConversation.setLogo(conversation.getLogo());
                    }
                    if (conversation.getLogoContentType() != null) {
                        existingConversation.setLogoContentType(conversation.getLogoContentType());
                    }
                    if (conversation.getColor() != null) {
                        existingConversation.setColor(conversation.getColor());
                    }

                    return existingConversation;
                }
            )
            .map(conversationRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Conversation> findAll(Pageable pageable) {
        log.debug("Request to get all Conversations");
        return conversationRepository.findAll(pageable);
    }

    public Page<Conversation> findAllWithEagerRelationships(Pageable pageable) {
        return conversationRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Conversation> findOne(Long id) {
        log.debug("Request to get Conversation : {}", id);
        return conversationRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Conversation : {}", id);
        conversationRepository.deleteById(id);
    }
}
