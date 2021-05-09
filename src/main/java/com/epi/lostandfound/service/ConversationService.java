package com.epi.lostandfound.service;

import com.epi.lostandfound.domain.Conversation;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Conversation}.
 */
public interface ConversationService {
    /**
     * Save a conversation.
     *
     * @param conversation the entity to save.
     * @return the persisted entity.
     */
    Conversation save(Conversation conversation);

    /**
     * Partially updates a conversation.
     *
     * @param conversation the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Conversation> partialUpdate(Conversation conversation);

    /**
     * Get all the conversations.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Conversation> findAll(Pageable pageable);

    /**
     * Get all the conversations with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Conversation> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" conversation.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Conversation> findOne(Long id);

    /**
     * Delete the "id" conversation.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
