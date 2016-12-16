angular
.module('legapp')
.controller('personalController',function($scope,$rootScope,$http,$session){
	
	$scope.routes = {
		get:{
			personal :'/rest/ful/adminper/index.php/personal'
		},
		post:{
			persona  :'/rest/ful/adminper/index.php/persona'
		},
		put:{
			persona  :'/rest/ful/adminper/index.php/persona/'
		},
		delete:{
			persona  :'/rest/ful/adminper/index.php/persona/'
		}
	};

	$scope.modelo = {
		key:'',
		id:'',
		apellidos:'',
		nombres:'',
		funcion:'',
		sector:''
	};

	$scope.lista = [];

	$scope.dialogs = {
		autorizarModificar:{
			display:false,
			no:()=>{$scope.listaGet();},
			si:()=>{
				$scope.displayFalse();
				$scope.forms.personalModificar.display=true;
			}
		},
		autorizarEliminar:{
			display:false,
			no:()=>{$scope.listaGet();},
			si:()=>{
				uri = $scope.routes.delete.persona+$scope.modelo.id;
				$http
					.delete(uri)
					.error(()=>{console.log(uri+' : No Data')})
					.success((json)=>{if(json.result) $scope.listaGet();});
			}
		},
	};

	$scope.forms  = {
		personalNuevo:{
			display:false,
			cancelar:()=>{$scope.listaGet();},
			aceptar:()=>{
				$session.autorize(()=>{
					uri = $scope.routes.post.persona;
					$http
						.post(uri,$scope.modelo)
						.error(()=>{$scope.listaGet();})
						.success((json)=>{if(json.result)$scope.listaGet();});
				});
			}
		},
		personalModificar:{
			display:false,
			cancelar:()=>{$scope.listaGet();},
			aceptar:()=>{
				$session.autorize(()=>{
					uri = $scope.routes.put.persona+$scope.modelo.id;
					$http
						.put(uri,$scope.modelo)
						.error(()=>{$scope.listaGet();})
						.success((json)=>{if(json.result)$scope.listaGet();});
				});
			}
		},
		personalVisualizar:{
			display:false,
			aceptar:()=>{$scope.listaGet();}
		},
		personalListar:{
			display:false,
			nuevaPersona:()=>{
				d = new Date();
				$scope.displayFalse();
				$scope.modelo.id='';
				$scope.modelo.nombres='';
				$scope.modelo.apellidos='';
				$scope.modelo.funcion='';
				$scope.modelo.sector='';
				$scope.forms.personalNuevo.display=true;
			},
			visualizarPersona:(k)=>{
				modelo = $scope.lista[k];
				$scope.displayFalse();
				$scope.modelo.id=modelo.id;
				$scope.modelo.nombres=modelo.nombres;
				$scope.modelo.apellidos=modelo.apellidos;
				$scope.modelo.funcion=modelo.funcion;
				$scope.modelo.sector=modelo.sector;
				$scope.forms.personalVisualizar.display=true;
			},
			modificarPersona:(k)=>{
				modelo = $scope.lista[k];
				$scope.modelo.key = k;
				$scope.modelo.id=modelo.id;
				$scope.modelo.nombres=modelo.nombres;
				$scope.modelo.apellidos=modelo.apellidos;
				$scope.modelo.funcion=modelo.funcion;
				$scope.modelo.sector=modelo.sector;
				$scope.displayFalse();
				$scope.dialogs.autorizarModificar.display=true;
			},
			eliminarPersona:(k)=>{
				$scope.modelo.key=k;
				$scope.modelo.id=$scope.lista[k].id
				$scope.displayFalse();
				$scope.dialogs.autorizarEliminar.display=true;
			}
		},
	};

	$scope.displayFalse = ()=>{
		$scope.dialogs.autorizarModificar.display=false;
		$scope.dialogs.autorizarEliminar.display=false;
		$scope.forms.personalNuevo.display=false;
		$scope.forms.personalModificar.display=false;
		$scope.forms.personalVisualizar.display=false;
		$scope.forms.personalListar.display=false;
	};

	$scope.listaGet = ()=>{
		$scope.displayFalse();
		uri = $scope.routes.get.personal;
		$http
			.get(uri)
			.error(()=>{console.log(uri+' : No Data');})
			.success((json)=>{if(json.result){
				$scope.lista=json.rows;
				$scope.forms.personalListar.display=true;
			}});		
	};

	$scope.init = ()=>{
		data = $session.get('user');
		$scope.user = JSON.parse(data);
		$rootScope.usuario = $scope.user.usuario;
		$rootScope.stage=true;
		$scope.listaGet();
	};

	$session.autorize(()=>{
		$scope.init();
	});	

});