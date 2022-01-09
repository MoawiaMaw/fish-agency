angular.module("myApp", ["ngRoute", "mds"])
    .service("$db", function () {

        var db = window.openDatabase('cust', '1.0', 'custmer DB', 50 * 1024 * 1024);
        this.query = function (query, parmaters) {
            console.log(parmaters.length)
            return new Promise(function (resolve, reject) {
                db.transaction(function (tx) {
                    tx.executeSql(query, parmaters, function (tx, results) {
                        var data = []
                        if (results.rows.length > 0) {
                            for (i = 0; i < results.rows.length; i++) {
                                row = results.rows.item(i)
                                data.push(row)
                            }
                        }
                        resolve(data)
                    }, function (tx, error) {
                        console.log('Oops. Error was ' + error.message + '  Code ' + error.code);
                        resolve(false)
                    });

                })
            })
        }
    })
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "templates/landing.html",
                controller: "landingCtrl",
                css: "css/style.css"
            })
            .when("/adminLogin", {
                templateUrl: "templates/adminLogin.html",
                controller: "adminCtrl",
                css: "css/style.css"
            })
            .when("/agentLogin", {
                templateUrl: "templates/agentLogin.html",
                controller: "agentCtrl",
                css: "css/style.css"
            })
            .when("/agentOrder", {
                templateUrl: "templates/agentOrder.html",
                controller: "agentOrderCtrl"
            })
            .when("/home", {
                templateUrl: "templates/home.html",
                controller: "homeCtrl"
            })
            .when("/quantites", {
                templateUrl: "templates/quantites.html",
                controller: "quantitesCtrl"
            })
            .when("/orders", {
                templateUrl: "templates/orders.html",
                controller: "ordersCtrl"
            })
            .when("/reports", {
                templateUrl: "templates/reports.html",
                controller: "reportsCtrl"
            })
            .when("/logout", {
                template: "",
                controller: "logoutCtrl"
            });
    })
    .controller("landingCtrl", function ($scope, $rootScope, $http, $db) {
        // function getUser() {
        //     $http.get("api/getUser.php")
        //         .then(function (response) {
        //             console.log(response.data)
        //             $rootScope.username = response.data[0].username
        //             $rootScope.userRole = response.data[0].role
        //             $rootScope.isLoggedIn = response.data[0].isLoggedIn
        //             $rootScope.userPassword = response.data[0].password
        //         })
        // }

        $rootScope.isLoggedIn = localStorage['isLoggedIn']
        $rootScope.userRole = localStorage['userRole']
        console.log($rootScope.isLoggedIn, $rootScope.userRole)
        // getUser()
    })
    .controller("adminCtrl", function ($scope, $rootScope, $http, $location, $db) {
        function getUser() {
            $http.get("api/getUser.php")
                .then(function (response) {
                    console.log(response.data)
                    $rootScope.username = response.data[0].username
                    $rootScope.userRole = response.data[0].role
                    $rootScope.isLoggedIn = response.data[0].isLoggedIn
                    $rootScope.userPassword = response.data[0].password
                })
        }


        getUser()
        $scope.checkAdmin = function () {
            if ($scope.name == $scope.username && $scope.password == $scope.userPassword) {
                $http.post("api/login.php", {
                    name: $scope.name,
                    password: $scope.password
                }).then(function (response) {
                    console.log(response.data.status)
                    if (response.data.status) {
                        alert("logged in");
                        if ($scope.userRole == 'admin') {
                            $location.path('home')
                            localStorage['username'] = $rootScope.username
                            localStorage['userRole'] = $rootScope.userRole
                            localStorage['isLoggedIn'] = 1
                            $scope.password = ''
                            getUser()
                        } else {
                            path('order')
                        }
                    }
                })
            } else {
                alert("name or password might be wrong");
                $scope.password = ""
            }
        }
    })
    .controller("agentCtrl", function ($scope, $rootScope, $http, $location, $db) {
        function getAgents() {
            $http.get("api/getAgents.php")
                .then(function (response) {
                    console.log(response.data)
                    $rootScope.agentInfo = response.data
                })
        }
        $rootScope.isLoggedIn = localStorage['isLoggedIn']
        $rootScope.userRole = localStorage['userRole']
        console.log($rootScope.isLoggedIn, $rootScope.userRole)

        getAgents()
        $scope.checkAgent = function () {
            for (i = 0; i < $rootScope.agentInfo.length; i++) {

                if ($scope.name == $rootScope.agentInfo[i].username && $scope.password == $rootScope.agentInfo[i].password) {
                    $rootScope.username = $rootScope.agentInfo[i].username
                    // $rootScope.password = $rootScope.agentInfo[i].password
                    $rootScope.userRole = $rootScope.agentInfo[i].role
                    $rootScope.isLoggedIn = $rootScope.agentInfo[i].isLoggedIn
                    localStorage['username'] = $rootScope.username
                    localStorage['userRole'] = $rootScope.userRole
                    localStorage['isLoggedIn'] = $rootScope.isLoggedIn

                    $http.post("api/login.php", {
                        name: $scope.name,
                        password: $scope.password
                    }).then(function (response) {
                        if (response.data.status) {
                            $scope.password = ''
                            alert("logged in");
                            if (localStorage['userRole'] == 'agent') {
                                $location.path('agentOrder')
                                localStorage['isLoggedIn'] = 1
                                $rootScope.isLoggedIn = localStorage['isLoggedIn']
                                $rootScope.userRole = localStorage['userRole']
                                $scope.password = ''
                                getAgents()
                            }
                        }
                    })
                }
            }
            if ($scope.name != $rootScope.username) {
                alert("name or password might be wrong");
                $scope.password = ""
            }
        }
    })
    .controller("homeCtrl", function ($scope, $rootScope, $http) {
        function getUser() {
            $http.get("api/getUser.php")
                .then(function (response) {
                    console.log(response.data)
                    $rootScope.username = response.data[0].username
                    $rootScope.userRole = response.data[0].role
                    $rootScope.isLoggedIn = response.data[0].isLoggedIn
                    $rootScope.userPassword = response.data[0].password
                })
        }


        getUser()
        $scope.addLoadDelivery = function () {
            $http.post("api/addLoad.php", {
                boat: $scope.boat,
                type: $scope.type,
                quantity: $scope.quantity
            }).then(function (resp) {
                if (resp.data.status) {
                    alert("added a new batch");
                    $scope.boat = ""
                    $scope.type = ""
                    $scope.quantity = ""
                }
            })
        }
    })
    .controller("agentOrderCtrl", function ($scope, $rootScope, $http, $db) {
        console.log($rootScope.username)
        function getAgents() {
            $http.get("api/getAgents.php")
                .then(function (response) {
                    console.log(response.data)
                    $rootScope.agentInfo = response.data
                })
        }

        getAgents()
        $rootScope.userRole = localStorage['userRole']
        $rootScope.isLoggedIn = localStorage['isLoggedIn']

        $scope.showOrderForm = function (load) {
            $scope.pickedLoad = load
            $("#myModal").modal("show")
        }
        $http.get("api/getQuantites.php")
            .then(function (response) {
                $scope.loads = response.data
            })
        $scope.makeOrder = function () {
            console.log("hi")
            console.log($scope.pickedLoad, $scope.ordered_quantity)
            if ($scope.ordered_quantity > $scope.pickedLoad.quantity) {
                $scope.order_status = 'pending'
            } else {
                $scope.order_status = 'OK'
            }
            console.log($scope.order_status)
            $http.post("api/makeOrder.php", {
                agent: localStorage['username'],
                fish_type: $scope.pickedLoad.fish_type,
                batch: $scope.pickedLoad.id,
                available_quantity: $scope.pickedLoad.quantity,
                ordered_quantity: $scope.ordered_quantity,
                status: $scope.order_status
            }).then(function (response) {
                if (response.data.status) {
                    alert("order submitted successfully")
                    $scope.ordered_quantity = ''
                    $('#myModal').modal('hide')
                }
                if (response.data.update) {
                    console.log("updated")
                }

            })
        }

    })
    .controller("quantitesCtrl", function ($scope, $rootScope, $http) {
        function getUser() {
            $http.get("api/getUser.php")
                .then(function (response) {
                    console.log(response.data)
                    $rootScope.username = response.data[0].username
                    $rootScope.userRole = response.data[0].role
                    $rootScope.isLoggedIn = response.data[0].isLoggedIn
                    $rootScope.userPassword = response.data[0].password
                })
        }


        getUser()
        $http.get("api/getQuantites.php")
            .then(function (response) {
                $scope.loads = response.data
            })
    })
    .controller("ordersCtrl", function ($scope, $rootScope, $http, $db) {
        function getUser() {
            $http.get("api/getUser.php")
                .then(function (response) {
                    console.log(response.data)
                    $rootScope.username = response.data[0].username
                    $rootScope.userRole = response.data[0].role
                    $rootScope.isLoggedIn = response.data[0].isLoggedIn
                    $rootScope.userPassword = response.data[0].password
                })
        }


        getUser()
        $http.get("api/getOrders.php")
            .then(function (response) {
                $scope.orders = response.data
            })
    })
    .controller("reportsCtrl", function ($scope, $rootScope, $http, $db) {
        function getUser() {
            $http.get("api/getUser.php")
                .then(function (response) {
                    console.log(response.data)
                    $rootScope.username = response.data[0].username
                    $rootScope.userRole = response.data[0].role
                    $rootScope.isLoggedIn = response.data[0].isLoggedIn
                    $rootScope.userPassword = response.data[0].password
                })
        }


        getUser()
        $scope.pendingReport = function () {
            $scope.report = "pending report"
            $http.get("api/pendingOrders.php")
                .then(function (response) {
                    $scope.pendingOrders = response.data
                })
        }
        $scope.boatsLoadsDetails = function () {
            $scope.report = "boatsLoadsDetails report"
            $http.get("api/boatsLoadsDetails.php")
                .then(function (response) {

                    $scope.georgeLoads = response.data.george
                    $scope.mawLoads = response.data.maw
                    $scope.ahmedLoads = response.data.ahmed
                })
        }
        $scope.batchDistribution = function () {
            $scope.report = "batchDistribution report"
            $http.get("api/getFullOrders.php")
                .then(function (response) {
                    $scope.orders = response.data
                })

        }
        $scope.comulativeReport = function () {

            $scope.report = "comulative report"
            $http.get("api/comulativeLoads.php")
                .then(function (response) {
                    $scope.grouperLoads = response.data.grouper
                    $scope.mackerelLoads = response.data.mackerel
                    $scope.tilapiaLoads = response.data.tilapia
                })

        }
        $scope.comparisonSummary = function () {

            $scope.report = "comparisonSummary report"
            $http.get("api/comparisonSummary.php")
                .then(function (response) {
                    $scope.grouperOrders = response.data.grouper
                    $scope.mackerelOrders = response.data.mackerel
                    $scope.tilapiaOrders = response.data.tilapia
                })

        }
        $scope.relationalReport = function () {

            $scope.report = "relational report"
            $http.get("api/comulativeLoads.php")
                .then(function (response) {
                    $scope.grouperLoads = response.data.grouper
                    $scope.mackerelLoads = response.data.mackerel
                    $scope.tilapiaLoads = response.data.tilapia
                })

        }
    })
    .controller("logoutCtrl", function ($scope, $rootScope, $http, $location, $db) {
        console.log(localStorage['username'])
        $http.post("api/logout.php", {
            name: localStorage['username']
        }).then(function (response) {
            if (response.data.status) {
                $location.path("#")
                localStorage['username'] = ''
                localStorage['userRole'] = ''
                localStorage['isLoggedIn'] = 0
            }
        })
    })
    .directive('head', ['$rootScope', '$compile',
        function ($rootScope, $compile) {
            return {
                restrict: 'E',
                link: function (scope, elem) {
                    var html = '<link rel="stylesheet" ng-repeat="(routeCtrl, cssUrl) in routeStyles" ng-href="{{cssUrl}}" />';
                    elem.append($compile(html)(scope));
                    scope.routeStyles = {};
                    $rootScope.$on('$routeChangeStart', function (e, next, current) {
                        if (current && current.$$route && current.$$route.css) {
                            if (!angular.isArray(current.$$route.css)) {
                                current.$$route.css = [current.$$route.css];
                            }
                            angular.forEach(current.$$route.css, function (sheet) {
                                delete scope.routeStyles[sheet];
                            });
                        }
                        if (next && next.$$route && next.$$route.css) {
                            if (!angular.isArray(next.$$route.css)) {
                                next.$$route.css = [next.$$route.css];
                            }
                            angular.forEach(next.$$route.css, function (sheet) {
                                scope.routeStyles[sheet] = sheet;
                            });
                        }
                    });
                }
            };
        }
    ]);

