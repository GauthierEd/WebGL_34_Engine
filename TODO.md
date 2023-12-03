1 - BOUNDING BOX:
    - Mettre à jour à chaque changement de position de l'objet:
        - [x] Prendre la (position dans le monde du parent + position de l'objet) pour obtenir la position réelle dans l'espace
        - [x] setPosition
        - [x] translateX
        - [x] translateY
        - [x] translateZ
    - Mettre à jour à chaque rotation de l'objet:
        - [x] rotateX
        - [x] rotateY
        - [x] rotateZ
    - Prendre en compte le scale de l'objet:
        - [x] setScale
        - [x] setScaleX
        - [x] setScaleY
        - [x] setScaleZ
    - [x] Afficher la bounding box:
    - [x] Fonction qui renvoie vrai ou faux en fonction si oui ou non la bounding box de l'objet rentre en collision avec une autre bounding box

- [x] Ajouter sol
  
3 - Ajouter la physique
    -   [ ] Ajouter la gravité
        -   [ ] A chaque tick, ajouter une force vers le bas à la position de l'objet (10 m/s^2)
        -   [ ] Regarder si la boundingBox de l'objet rentre en colision avec une autre boundingBox:
            -   [ ] Si oui: coller la face de l'objet qui rentre en colision à la face de l'autre objet