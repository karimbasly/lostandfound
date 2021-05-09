package com.epi.lostandfound.service.impl;

import com.epi.lostandfound.domain.Commentaire;
import com.epi.lostandfound.repository.CommentaireRepository;
import com.epi.lostandfound.service.CommentaireService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Commentaire}.
 */
@Service
@Transactional
public class CommentaireServiceImpl implements CommentaireService {

    private final Logger log = LoggerFactory.getLogger(CommentaireServiceImpl.class);

    private final CommentaireRepository commentaireRepository;

    public CommentaireServiceImpl(CommentaireRepository commentaireRepository) {
        this.commentaireRepository = commentaireRepository;
    }

    @Override
    public Commentaire save(Commentaire commentaire) {
        log.debug("Request to save Commentaire : {}", commentaire);
        return commentaireRepository.save(commentaire);
    }

    @Override
    public Optional<Commentaire> partialUpdate(Commentaire commentaire) {
        log.debug("Request to partially update Commentaire : {}", commentaire);

        return commentaireRepository
            .findById(commentaire.getId())
            .map(
                existingCommentaire -> {
                    if (commentaire.getText() != null) {
                        existingCommentaire.setText(commentaire.getText());
                    }
                    if (commentaire.getDateCreation() != null) {
                        existingCommentaire.setDateCreation(commentaire.getDateCreation());
                    }

                    return existingCommentaire;
                }
            )
            .map(commentaireRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Commentaire> findAll(Pageable pageable) {
        log.debug("Request to get all Commentaires");
        return commentaireRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Commentaire> findOne(Long id) {
        log.debug("Request to get Commentaire : {}", id);
        return commentaireRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Commentaire : {}", id);
        commentaireRepository.deleteById(id);
    }
}
