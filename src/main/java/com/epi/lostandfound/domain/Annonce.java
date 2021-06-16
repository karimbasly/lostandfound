package com.epi.lostandfound.domain;

import com.epi.lostandfound.domain.enumeration.EtatAnnone;
import com.epi.lostandfound.domain.enumeration.Type;
import com.epi.lostandfound.domain.enumeration.Ville;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Annonce.
 */
@Entity
@Table(name = "annonce")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Annonce implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Size(min = 3, max = 255)
    @Column(name = "titre", length = 255, nullable = false)
    private String titre;

    @Size(min = 3, max = 255)
    @Column(name = "description", length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "ville")
    private Ville ville;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private Type type;

    @Enumerated(EnumType.STRING)
    @Column(name = "etat")
    private EtatAnnone etat;

    @NotNull
    @Column(name = "date_annonce", nullable = false)
    private ZonedDateTime dateAnnonce;

    @Lob
    @Column(name = "logo", nullable = false)
    private byte[] logo;

    @Column(name = "logo_content_type", nullable = false)
    private String logoContentType;

    @OneToMany(mappedBy = "annonce")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "annonce" }, allowSetters = true)
    private Set<Commentaire> commentaires = new HashSet<>();

    @OneToMany(mappedBy = "annonce", cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "annonce" }, allowSetters = true)
    private Set<Image> images = new HashSet<>();

    @ManyToOne
    private Categorie categorie;

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Annonce id(Long id) {
        this.id = id;
        return this;
    }

    public String getTitre() {
        return this.titre;
    }

    public Annonce titre(String titre) {
        this.titre = titre;
        return this;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return this.description;
    }

    public Annonce description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Ville getVille() {
        return this.ville;
    }

    public Annonce ville(Ville ville) {
        this.ville = ville;
        return this;
    }

    public void setVille(Ville ville) {
        this.ville = ville;
    }

    public Type getType() {
        return this.type;
    }

    public Annonce type(Type type) {
        this.type = type;
        return this;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public EtatAnnone getEtat() {
        return this.etat;
    }

    public Annonce etat(EtatAnnone etat) {
        this.etat = etat;
        return this;
    }

    public void setEtat(EtatAnnone etat) {
        this.etat = etat;
    }

    public ZonedDateTime getDateAnnonce() {
        return this.dateAnnonce;
    }

    public Annonce dateAnnonce(ZonedDateTime dateAnnonce) {
        this.dateAnnonce = dateAnnonce;
        return this;
    }

    public byte[] getLogo() {
        return logo;
    }

    public Annonce logo(byte[] logo) {
        this.logo = logo;
        return this;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public Annonce logoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
        return this;
    }

    public String getLogoContentType() {
        return logoContentType;
    }

    public void setLogoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
    }

    public void setDateAnnonce(ZonedDateTime dateAnnonce) {
        this.dateAnnonce = dateAnnonce;
    }

    public Set<Commentaire> getCommentaires() {
        return this.commentaires;
    }

    public Annonce commentaires(Set<Commentaire> commentaires) {
        this.setCommentaires(commentaires);
        return this;
    }

    public Annonce addCommentaire(Commentaire commentaire) {
        this.commentaires.add(commentaire);
        commentaire.setAnnonce(this);
        return this;
    }

    public Annonce removeCommentaire(Commentaire commentaire) {
        this.commentaires.remove(commentaire);
        commentaire.setAnnonce(null);
        return this;
    }

    public void setCommentaires(Set<Commentaire> commentaires) {
        if (this.commentaires != null) {
            this.commentaires.forEach(i -> i.setAnnonce(null));
        }
        if (commentaires != null) {
            commentaires.forEach(i -> i.setAnnonce(this));
        }
        this.commentaires = commentaires;
    }

    public Set<Image> getImages() {
        return this.images;
    }

    public Annonce images(Set<Image> images) {
        this.setImages(images);
        return this;
    }

    public Annonce addImage(Image image) {
        this.images.add(image);
        image.setAnnonce(this);
        return this;
    }

    public Annonce removeImage(Image image) {
        this.images.remove(image);
        image.setAnnonce(null);
        return this;
    }

    public void setImages(Set<Image> images) {
        if (this.images != null) {
            this.images.forEach(i -> i.setAnnonce(null));
        }
        if (images != null) {
            images.forEach(i -> i.setAnnonce(this));
        }
        this.images = images;
    }

    public Categorie getCategorie() {
        return this.categorie;
    }

    public Annonce categorie(Categorie categorie) {
        this.setCategorie(categorie);
        return this;
    }

    public void setCategorie(Categorie categorie) {
        this.categorie = categorie;
    }

    public User getUser() {
        return this.user;
    }

    public Annonce user(User user) {
        this.setUser(user);
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Annonce)) {
            return false;
        }
        return id != null && id.equals(((Annonce) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Annonce{" +
            "id=" + getId() +
            ", titre='" + getTitre() + "'" +
            ", description='" + getDescription() + "'" +
            ", ville='" + getVille() + "'" +
            ", type='" + getType() + "'" +
            ", etat='" + getEtat() + "'" +
            ", dateAnnonce='" + getDateAnnonce() + "'" +
            "}";
    }
}
