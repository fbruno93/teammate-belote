/**
 * Copyright (c) 2018
 *
 * Application gérant un affichage des manches du jeu de la belote.
 * Les manches sont affichées dans un ou plusieurs tableaux. 
 *
 * @summary Application de belote
 * @author Bruno FERRY <fbruno@hotmail.fr>
 *
 * Created at     : 2018-11-10 11:00 
 * Last modified  : 2018-11-25 13:53 
 */

angular.module('app', [])
.run(['$rootScope', run])
.controller('mainCtrl', ['$scope', mainCtrl]);

/**
 * @description
 *  Fonction lancer dès le debut de l'application
 * @param {Object} $rootScope Scope commun à tous les scopes
 */
function run($rootScope) {
    // Valeur à changer si ca ne correspond pas à l'affichage voulu
    $rootScope.tableSize = 17;
}

/**
 * @description
 *  Controller principal de l'application
 *  $scope est une variable public accessible depuis le template
 *  Ainsi $scope.var => {{ var }} in template 
 * @param {Object} $scope Scope du controller
 */
function mainCtrl($scope) {
    
    // Memorise les matchs joués
    var match = [];
    
    // Nombre d'équipe 
    var nbteam = 0;

    // Déterminie si tous les match ont été joués
    var allCombinaisonFound = true;
    
    // Match 
    var fights = {};

    // Manche courrante
    $scope.current = -1;

    // Tableaux a affichés sur l'écran
    $scope.tables = [];

    $scope.compute = compute;
    $scope.next = next;
    
    /**
     * @description
     *  Initialize le jeu
     * 
     * @param {Interger|String} nbTeam 
     */
    function compute(nbTeam) {

        // Vérification de la parité du nombre d'équipe
        if (nbTeam % 2 != 0) {
            alert('Le nombre d\'équipe n\'est pas pair');
            return;
        }

        // Initialisation des variables
        allCombinaisonFound = true;
        match = [];
        nbteam = nbTeam;
        $scope.current = -1;
        fights = {};
        
        for (var i = 0 ; i < nbTeam / 2 ; i++) {
            fights[i + 1] = [];
        }

        // Cacher la popup
        $('#exampleModal').modal('hide');
        
        // Lance la première manche
        $scope.next();
    }


    /**
     * @description
     *  Passe à la manche suivante en mélangeant
     *  les equipes de nbTeam/2 a nbTeam
     */
    function next() {
        if (allCombinaisonFound === false) {
            alert('Toutes les combinaison ont été faites');
            return;
        }

        if ($scope.current == 2) {
            alert('Partie terminée !\n\
            Pour relancer une partie, renseignez les nombre d\'équipe');
            return;
        }
        
        $scope.current++;
        
        var arr = [];
        var halfNbTeam = nbteam / 2;
        /*
         * Rempli le tableau d'entier de la moitié du nombre d'équipe
         * jusqu'à la totalité 
         */ 
        for (var i = 0 ; i < halfNbTeam ; i++) {
            arr.push(i + 1 + halfNbTeam);
        }
        
        // Mélange le tableau {arr} tant que ses sont identiques a {match}
        ramdomize(arr, match);

        // Mémorises les valeurs
        match.push(arr);

        // Asocie les équipes entre elles
        for (var i = 0 ; i < halfNbTeam ; i ++) {
            fights[i + 1].push(arr[i]);
        }

        // Organise l'affichage
        displayTables(nbteam, fights);
        
    }

    /**
     * @description
     *  Permet de dispatcher les duel dans différents tableau
     *  pour un affichage claire
     * 
     * @param {Interger} nbTeam Nombre d'équipe totale
     * @param {*} fights        Associaition joueurs
     */
    function displayTables(nbTeam, fights) {
        var current_table = -1;
        
        $scope.tables = [];

        for (var i = 0 ; i < nbTeam / 2 ; i++) {
            
            /* 
             * Génère un nouveau tableau si un multiple 
             * de {maxElementParTableauAfficher} est atteint
             */
            if (i % $scope.tableSize == 0) {
                current_table++;
                $scope.tables.push({});
            }

            $scope.tables[current_table][i+1] = fights[i+1];
        }
    }
    
    /**
     * @description
     *  Mélanger le tableau {arr}.
     *  Si des valeurs sont identiques dans {match} alors il est a nouveau mélangé
     * 
     * @param {Array} arr               Tableau a mélanger
     * @param {Array[Array[Int]]} match Valeur déjà affecté a ceux meme tableau au paravent.
     */
    function ramdomize(arr, match) {
        if (match.length == 0) {
            shuffle(arr);
        } else {
            for (var i = 0 ; i < match.length && allCombinaisonFound ; i++) {
                for (var j = 0 ; j < match[i].length && allCombinaisonFound ; j++) {
                    if (match[i][j] === arr[j]) {
                        try {
                            shuffle(arr);
                            ramdomize(arr, match);
                        } catch (error) {
                            allCombinaisonFound = false;
                        }
                    }
                }
            }
        }
    }

    /**
     * @description randomize value of array
     */
    function shuffle(array) {
        var i = array.length;
        var j;
        var temp;

        if (i == 0) {
            return;
        }
        
        while (--i) {
            j = Math.floor(Math.random() * (i + 1));
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
}

