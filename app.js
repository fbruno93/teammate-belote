Array.prototype.shuffle = function() {
    var i = this.length, j, temp;
    if ( i == 0 ) return this;
    while ( --i ) {
       j = Math.floor( Math.random() * ( i + 1 ) );
       temp = this[i];
       this[i] = this[j];
       this[j] = temp;
    }
    return this;
}

angular
.module('app', [])
.controller('mainCtrl', function($scope) {
    
    var match = [];
    var nbteam = 0;
    var browse = true;
    var fights = {};

    $scope.current = -1;
    $scope.tables = []

    $scope.compute = function(nbTeam) {
        browse = true;
        match = [];
        nbteam = nbTeam;
        
        $scope.tables = [];
        $scope.current = -1;

        if (nbTeam % 2 != 0) {
            alert('Le nombre d\'équipe n\'est pas pair');
            return;
        }

        fights = {};
        
        for (var i = 0 ; i < nbTeam / 2 ; i++)
            fights[i + 1] = [];

        $scope.next();
    }

    $scope.next = function() {
        if (browse === false) {
            alert('Toutes les combinaison ont été faites');
            return;
        }

        $scope.tables = [];
        $scope.current++;
        
        var arr = [];
        for (var i = 0 ; i < nbteam / 2 ; i++)
            arr.push(i + 1 + nbteam / 2);
        
        arr.shuffle();
        
        if (match.length > 0)
            ramdomize(arr, match);

            match.push(arr);

        for (var i = 0 ; i < nbteam / 2 ; i ++) {
            fights[i + 1].push(arr[i]);
        }

        var current_table = -1
        for (var i = 0 ; i < nbteam / 2 ; i++) {
            
            if (i % 17 == 0) {
                current_table++;
                $scope.tables.push({});
            }

            $scope.tables[current_table][i+1] = fights[i+1];
        }
    }
    
    var ramdomize = function(arr, match) {
        for (var i = 0 ; i < match.length && browse ; i++) {
            for (var j = 0 ; j < match[i].length && browse ; j++) {
                if (match[i][j] === arr[j]) {
                    try {
                        arr.shuffle();
                        ramdomize(arr, match);
                    } catch (error) {
                        browse = false;
                    }
                }
            }
        }
    }
});