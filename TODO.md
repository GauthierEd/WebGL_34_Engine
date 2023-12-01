1 - BOUNDING BOX:
    - Mettre à jour à chaque changement de position de l'objet:
        - [x] Prendre la (position dans le monde du parent + position de l'objet) pour obtenir la position réelle dans l'espace
        - [ ] setPosition
        - [ ] translateX
        - [ ] translateY
        - [ ] translateZ
    - Mettre à jour à chaque rotation de l'objet:
        - [ ] rotateX
        - [ ] rotateY
        - [ ] rotateZ
    - Prendre en compte le scale de l'objet:
        - [ ] setScale
        - [ ] setScaleX
        - [ ] setScaleY
        - [ ] setScaleZ
    - [ ] Afficher la bounding box
    - [ ] Fonction qui renvoie vrai ou faux en fonction si oui ou non la bounding box de l'objet rentre en collision avec une autre bounding box
2 - [ ] Ajouter un sol

3 - Ajouter la physique
    -   [ ] Ajouter la gravité
        -   [ ] A chaque tick, ajouter une force vers le bas à la position de l'objet (10 m/s^2)
        -   [ ] Regarder si la boundingBox de l'objet rentre en colision avec une autre boundingBox:
            -   [ ] Si oui: coller la face de l'objet qui rentre en colision à la face de l'autre objet