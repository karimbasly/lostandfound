package com.epi.lostandfound.service;

import com.epi.lostandfound.domain.Annonce;
import com.epi.lostandfound.domain.enumeration.Ville;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Annonce}.
 */
public interface AnnonceService {
    /**
     * Save a annonce.
     *
     * @param annonce the entity to save.
     * @return the persisted entity.
     */
    Annonce save(Annonce annonce);

    /**
     * Partially updates a annonce.
     *
     * @param annonce the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Annonce> partialUpdate(Annonce annonce);

    /**
     * Get all the annonces.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Annonce> findAll(Pageable pageable);

    /**
     * Get the "id" annonce.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Annonce> findOne(Long id);

    /**
     * Delete the "id" annonce.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    List<Annonce> findAnnonceByCategoriId(Long idCat);
    List<Annonce> findAnnonceByVille(Ville ville);
}
