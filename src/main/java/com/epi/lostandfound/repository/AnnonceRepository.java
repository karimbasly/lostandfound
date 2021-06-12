package com.epi.lostandfound.repository;

import com.epi.lostandfound.domain.Annonce;
import com.epi.lostandfound.domain.enumeration.EtatAnnone;
import com.epi.lostandfound.domain.enumeration.Ville;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Annonce entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AnnonceRepository extends JpaRepository<Annonce, Long> {
    @Query("select annonce from Annonce annonce where annonce.user.login = ?#{principal.username}")
    Page<Annonce> findByUserIsCurrentUser(Pageable pageable);

    List<Annonce> findAnnoncesByCategorieId(Long idCat);
    List<Annonce> findAnnoncesByVille(Ville ville);

    @Query("select annonce from Annonce annonce where annonce.etat = 'PUBLISHED'")
    Page<Annonce> findAnnoncesByEtatPublished(Pageable pageable);
}
