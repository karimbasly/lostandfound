package com.epi.lostandfound.service.dto;

import com.epi.lostandfound.domain.*;
import com.epi.lostandfound.domain.enumeration.EtatAnnone;
import com.epi.lostandfound.domain.enumeration.Type;
import com.epi.lostandfound.domain.enumeration.Ville;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Lob;
import javax.validation.constraints.*;

public class AnnonceDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    @NotNull
    @Size(min = 3, max = 255)
    private String titre;

    @Size(min = 3, max = 255)
    private String description;

    private Ville ville;

    private Type type;

    private EtatAnnone etat;

    private ZonedDateTime dateAnnonce;

    @Lob
    private byte[] logo;

    private String logoContentType;

    @JsonIgnoreProperties(value = { "user", "annonce" }, allowSetters = true)
    private Set<Commentaire> commentaires = new HashSet<>();

    @JsonIgnoreProperties(value = { "annonce" }, allowSetters = true)
    private Set<Image> images = new HashSet<>();

    private Categorie categorie;

    private User user;

    public AnnonceDTO() {}

    public Annonce toAnnonce() {
        Annonce annonce = new Annonce();
        annonce.setId(this.id);
        annonce.setTitre(this.titre);
        annonce.setDescription(this.description);
        annonce.setCategorie(this.categorie);
        annonce.setVille(this.ville);
        annonce.setEtat(this.etat);
        annonce.setCommentaires(this.commentaires);
        annonce.setType(this.type);
        annonce.setDateAnnonce(this.dateAnnonce);
        annonce.setImages(this.images);
        annonce.setUser(this.user);
        annonce.setLogoContentType(this.logoContentType);
        annonce.setLogo(this.logo);
        return annonce;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Ville getVille() {
        return ville;
    }

    public void setVille(Ville ville) {
        this.ville = ville;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public EtatAnnone getEtat() {
        return etat;
    }

    public void setEtat(EtatAnnone etat) {
        this.etat = etat;
    }

    public ZonedDateTime getDateAnnonce() {
        return dateAnnonce;
    }

    public void setDateAnnonce(ZonedDateTime dateAnnonce) {
        this.dateAnnonce = dateAnnonce;
    }

    public Set<Commentaire> getCommentaires() {
        return commentaires;
    }

    public void setCommentaires(Set<Commentaire> commentaires) {
        this.commentaires = commentaires;
    }

    public Set<Image> getImages() {
        return images;
    }

    public void setImages(Set<Image> images) {
        this.images = images;
    }

    public Categorie getCategorie() {
        return categorie;
    }

    public void setCategorie(Categorie categorie) {
        this.categorie = categorie;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public byte[] getLogo() {
        return logo;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public String getLogoContentType() {
        return logoContentType;
    }

    public void setLogoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
    }
}
