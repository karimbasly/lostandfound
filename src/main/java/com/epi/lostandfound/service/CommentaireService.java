package com.epi.lostandfound.service;

import com.epi.lostandfound.domain.Commentaire;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Commentaire}.
 */
public interface CommentaireService {
    /**
     * Save a commentaire.
     *
     * @param commentaire the entity to save.
     * @return the persisted entity.
     */
    Commentaire save(Commentaire commentaire);

    /**
     * Partially updates a commentaire.
     *
     * @param commentaire the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Commentaire> partialUpdate(Commentaire commentaire);

    /**
     * Get all the commentaires.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Commentaire> findAll(Pageable pageable);

    /**
     * Get the "id" commentaire.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Commentaire> findOne(Long id);

    /**
     * Delete the "id" commentaire.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
