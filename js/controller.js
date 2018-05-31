var app = angular.module("myApp",[]);
app.controller("myCtrl", function myCtrl($scope, $http){
    // Variable on recollim les dades del formulari.
    $scope.consulta = {
        tipus: "",
        quantitat: ""
    };

    // Variable on, si cream l'objecte amb el nom de la moneda, indicam que volem fer feina amb ella.
    $scope.monedes = {
        // Es l'unica moneda real y no es troba a la base de dades de l'API
        // per això l'iniciam amb les dades que ens interesen.
        "EUR":{
            name: "Euro", 
            symbol: "EUR"
        },

        // Indicam tots el objectes amb el nom del symbol de la moneda que creem aqui,
        // automaticament s'iniciaran al carregar la web amb un $http.get.
        "BTC":{},
        "ETH":{},
        "BCH":{},

        // MONEDES AFEGIDES PER EXPLICAR LA FACILITAT D'AFEGIR I LLEVAR MONEDES A LA WEB.
        "XRP":{},
        "XLM":{},
        "TRX":{},
        "EOS":{},
        "ADA":{},
        "MIOTA":{},
        // Llevant o no els comentaris dels objectes automaticament s'incorporen o no.
        
        "LTC":{}
    };
    
    // Quan es carrega la web feim el pirmer GET a l'API per obtenir l'informació necessaria.
    // Ens ajuda tant a construir el select del formulari com a realitzar les futures consultes.
    $http.get("https://api.coinmarketcap.com/v2/listings/")
    .then(function(response){
        console.log(response.data.data);
        for (data in response.data.data){
            // console.log(response.data.data[data].symbol);
            for (moneda in $scope.monedes){
                if (moneda == response.data.data[data].symbol){
                    $scope.monedes[moneda] = response.data.data[data];
                }
            }
        }
        console.log($scope.monedes);
        
    });
    
    // Funció per trobar el valor de cada moneda amb les que tractam segons la moneda selecionada.
    $scope.coinConverter = function () {
        $scope.resultat = [];
        console.log($scope.consulta);
        
        $http.get("https://api.coinmarketcap.com/v2/ticker/?convert="+$scope.consulta.tipus)
        .then(function(response){
            // Obtenim el valor de cada moneda amb les que fa feina l'API segons la moneda triada.
            console.log(response.data.data);

            // Recorrem totes les monedes i només ens quedam amb les que feim feina noltros.
            for (data in response.data.data){
                // console.log(data);
                for (moneda in $scope.monedes){
                    
                    if ($scope.monedes[moneda].id == data){
                        $scope.monedes[moneda] = response.data.data[data];
                        // Si la moneda es diferent de la que hem seleccionar preparam la conversió.
                        if ($scope.monedes[moneda].symbol != $scope.consulta.tipus){
                            console.log($scope.monedes[moneda].name+" - "+$scope.consulta.quantitat/$scope.monedes[moneda].quotes[$scope.consulta.tipus].price+" "+$scope.monedes[moneda].symbol);
                            $scope.resultat.push($scope.monedes[moneda].name+" - "+$scope.consulta.quantitat/$scope.monedes[moneda].quotes[$scope.consulta.tipus].price+" "+$scope.monedes[moneda].symbol);
                        }
                    }
                }
            }
            
            // Com a extra afegim que pel tipus de moneda que hem triat ens mostri el seu valor en euros.
            if ($scope.consulta.tipus != "EUR"){
                $http.get("https://api.coinmarketcap.com/v2/ticker/"+$scope.monedes[$scope.consulta.tipus].id+"/?convert=EUR")
                .then(function(response2){
                    // console.log(response2.data.data);
                    $scope.monedes[$scope.consulta.tipus] = response2.data.data;
                    console.log($scope.monedes[$scope.consulta.tipus].name+" - "+$scope.consulta.quantitat*$scope.monedes[$scope.consulta.tipus].quotes["EUR"].price.toFixed(2)+" €");
                    $scope.resultat.push("Valor de "+$scope.consulta.quantitat+" "+$scope.monedes[$scope.consulta.tipus].name+" en euros: "+$scope.consulta.quantitat*$scope.monedes[$scope.consulta.tipus].quotes["EUR"].price.toFixed(2)+" €");
                });
            }
            
        });
        
    }
    
})