package com.epi.lostandfound.service.impl;

import com.epi.lostandfound.domain.Annonce;
import com.epi.lostandfound.domain.enumeration.Ville;
import com.epi.lostandfound.repository.AnnonceRepository;
import com.epi.lostandfound.service.AnnonceService;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Annonce}.
 */
@Service
@Transactional
public class AnnonceServiceImpl implements AnnonceService {

    private final Logger log = LoggerFactory.getLogger(AnnonceServiceImpl.class);

    private final AnnonceRepository annonceRepository;

    public AnnonceServiceImpl(AnnonceRepository annonceRepository) {
        this.annonceRepository = annonceRepository;
    }

    @Override
    public Annonce save(Annonce annonce) {
        log.debug("Request to save Annonce : {}", annonce);
        return annonceRepository.save(annonce);
    }

    @Override
    public Optional<Annonce> partialUpdate(Annonce annonce) {
        log.debug("Request to partially update Annonce : {}", annonce);

        return annonceRepository
            .findById(annonce.getId())
            .map(
                existingAnnonce -> {
                    if (annonce.getTitre() != null) {
                        existingAnnonce.setTitre(annonce.getTitre());
                    }
                    if (annonce.getDescription() != null) {
                        existingAnnonce.setDescription(annonce.getDescription());
                    }
                    if (annonce.getVille() != null) {
                        existingAnnonce.setVille(annonce.getVille());
                    }
                    if (annonce.getType() != null) {
                        existingAnnonce.setType(annonce.getType());
                    }
                    if (annonce.getEtat() != null) {
                        existingAnnonce.setEtat(annonce.getEtat());
                    }
                    if (annonce.getDateAnnonce() != null) {
                        existingAnnonce.setDateAnnonce(annonce.getDateAnnonce());
                    }

                    return existingAnnonce;
                }
            )
            .map(annonceRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Annonce> findAll(Pageable pageable) {
        log.debug("Request to get all Annonces");
        return annonceRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Annonce> findOne(Long id) {
        log.debug("Request to get Annonce : {}", id);
        return annonceRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Annonce : {}", id);
        annonceRepository.deleteById(id);
    }

    @Override
    public List<Annonce> findAnnonceByCategoriId(Long idCat) {
        return annonceRepository.findAnnoncesByCategorieId(idCat);
    }

    @Override
    public List<Annonce> findAnnonceByVille(Ville ville) {
        return annonceRepository.findAnnoncesByVille(ville);
    }
}
