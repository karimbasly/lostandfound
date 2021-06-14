package com.epi.lostandfound.web.rest;

import com.epi.lostandfound.domain.Annonce;
import com.epi.lostandfound.domain.Image;
import com.epi.lostandfound.domain.enumeration.EtatAnnone;
import com.epi.lostandfound.domain.enumeration.Ville;
import com.epi.lostandfound.repository.AnnonceRepository;
import com.epi.lostandfound.security.SecurityUtils;
import com.epi.lostandfound.service.AnnonceService;
import com.epi.lostandfound.service.ImageService;
import com.epi.lostandfound.service.UserService;
import com.epi.lostandfound.service.dto.AnnonceDTO;
import com.epi.lostandfound.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.epi.lostandfound.domain.Annonce}.
 */
@RestController
@RequestMapping("/api")
public class AnnonceResource {

    private final Logger log = LoggerFactory.getLogger(AnnonceResource.class);

    private static final String ENTITY_NAME = "annonce";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AnnonceService annonceService;

    private final UserService userService;

    private final AnnonceRepository annonceRepository;

    private final ImageService imageService;

    public AnnonceResource(
        AnnonceService annonceService,
        UserService userService,
        AnnonceRepository annonceRepository,
        ImageService imageService
    ) {
        this.annonceService = annonceService;
        this.userService = userService;
        this.annonceRepository = annonceRepository;
        this.imageService = imageService;
    }

    /**
     * {@code POST  /annonces} : Create a new annonce.
     *
     * @param annonce the annonce to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new annonce, or with status {@code 400 (Bad Request)} if the annonce has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/annonces")
    public ResponseEntity<Annonce> createAnnonce(@Valid @RequestBody AnnonceDTO annonce) throws URISyntaxException {
        log.debug("REST request to save Annonce : {}", annonce);
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("user needed"));
        if (annonce.getId() != null) {
            throw new BadRequestAlertException("A new annonce cannot already have an ID", ENTITY_NAME, "idexists");
        }
        annonce.setDateAnnonce(ZonedDateTime.now());
        annonce.setUser(userService.getUserWithAuthoritiesByLogin(userLogin).get());
        Annonce result = annonceService.save(annonce.toAnnonce());
        for (Image i : annonce.getImages()) {
            i.setAnnonce(result);
            imageService.save(i);
        }
        return ResponseEntity
            .created(new URI("/api/annonces/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /annonces/:id} : Updates an existing annonce.
     *
     * @param id the id of the annonce to save.
     * @param annonce the annonce to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated annonce,
     * or with status {@code 400 (Bad Request)} if the annonce is not valid,
     * or with status {@code 500 (Internal Server Error)} if the annonce couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/annonces/{id}")
    public ResponseEntity<Annonce> updateAnnonce(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Annonce annonce
    ) throws URISyntaxException {
        log.debug("REST request to update Annonce : {}, {}", id, annonce);
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new RuntimeException("user needed"));
        if (annonce.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, annonce.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!annonceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        annonce.setUser(userService.getUserWithAuthoritiesByLogin(userLogin).get());
        Annonce result = annonceService.save(annonce);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, annonce.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /annonces/:id} : Partial updates given fields of an existing annonce, field will ignore if it is null
     *
     * @param id the id of the annonce to save.
     * @param annonce the annonce to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated annonce,
     * or with status {@code 400 (Bad Request)} if the annonce is not valid,
     * or with status {@code 404 (Not Found)} if the annonce is not found,
     * or with status {@code 500 (Internal Server Error)} if the annonce couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/annonces/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Annonce> partialUpdateAnnonce(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Annonce annonce
    ) throws URISyntaxException {
        log.debug("REST request to partial update Annonce partially : {}, {}", id, annonce);
        if (annonce.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, annonce.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!annonceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Annonce> result = annonceService.partialUpdate(annonce);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, annonce.getId().toString())
        );
    }

    /**
     * {@code GET  /annonces} : get all the annonces.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of annonces in body.
     */
    @GetMapping("/annonces")
    public ResponseEntity<List<Annonce>> getAllAnnonces(Pageable pageable) {
        log.debug("REST request to get a page of Annonces");
        Page<Annonce> page = annonceService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /annonces/:id} : get the "id" annonce.
     *
     * @param id the id of the annonce to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the annonce, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/annonces/{id}")
    public ResponseEntity<?> getAnnonce(@PathVariable Long id) {
        log.debug("REST request to get Annonce : {}", id);
        Optional<Annonce> annonce = annonceService.findOne(id);
        if (
            annonce.isPresent() &&
            annonce.get().getUser() != null &&
            !annonce.get().getVille().equals(EtatAnnone.PUBLISHED) &&
            !annonce.get().getUser().getLogin().equals(SecurityUtils.getCurrentUserLogin().orElse(""))
        ) {
            return new ResponseEntity<>("error.http.403", HttpStatus.FORBIDDEN);
        }
        return ResponseUtil.wrapOrNotFound(annonce);
    }

    /**
     * {@code DELETE  /annonces/:id} : delete the "id" annonce.
     *
     * @param id the id of the annonce to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/annonces/{id}")
    public ResponseEntity<Void> deleteAnnonce(@PathVariable Long id) {
        log.debug("REST request to delete Annonce : {}", id);
        annonceService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/categorie/{id}/annonce")
    public List<Annonce> getAnnonceByCategorieId(@PathVariable Long id) {
        return annonceService.findAnnonceByCategoriId(id);
    }

    @GetMapping("/Ville/{ville}/annonce")
    public List<Annonce> getAnnonceByVille(@PathVariable Ville ville) {
        return annonceService.findAnnonceByVille(ville);
    }
}
