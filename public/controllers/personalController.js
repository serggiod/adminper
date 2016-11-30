angular
.module('legapp')
.controller('personalController',function($scope,$rootScope,$http,$session){
	
	$scope.routes = {
		get:{
			personal :'/rest/ful/adminper/index.php/personal',
			persona  :'/rest/ful/adminper/index.php/persona/'
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
		funcion:''
	};

	$scope.lista = [];

	// Estructura de control de la presentacion.
	$scope.statusbar = {
		display:false,
		progress:'0'
	};

	$scope.dialogs = {
		autorizarModificar:{
			display:false,
			no:()=>{
				$scope.modelo.key=null;
				$scope.modelo.id=null;
				$scope.displayFalse();
				$scope.forms.personalListar.display=true;
			},
			si:()=>{
				$scope.displayFalse();
				$http
					.get($scope.routes.get.persona+$scope.modelo.id)
					.error(()=>{console.log($scope.routes.get.persona+$scope.modelo.id+' : No Data');})
					.success((json)=>{if(json.result){
						$scope.modelo.nombres=json.rows.nombres;
						$scope.modelo.apellidos=json.rows.apellidos;
						$scope.modelo.funcion=json.rows.funcion;
						$scope.forms.personalModificar.display=true;
					}});
			}
		},
		autorizarEliminar:{
			display:false,
			no:()=>{
				$scope.displayFalse();
				$scope.forms.personalListar.display=true;
			},
			si:()=>{
				$scope.displayFalse();
				uri = $scope.routes.delete.persona+$scope.modelo.id;
				$http
					.delete(uri)
					.error(()=>{console.log(uri+' : No Data')})
					.success((json)=>{if(json.result){
						$scope.lista.splice($scope.modelo.key,1);
						$scope.modelo.key=null;
						$scope.modelo.id=null;
						$scope.forms.personalListar.display=true;
					}});
			}
		},
	};

	$scope.forms  = {
		personalNuevo:{
			display:false,
			cancelar:()=>{
				$scope.modelo.key=null;
				$scope.modelo.id=null;
				$scope.displayFalse();
				$scope.forms.personalListar.display=true;
			},
			aceptar:()=>{
				$scope.displayFalse();
				$session.autorize(()=>{
					$http
						.post($scope.routes.post.persona,$scope.modelo)
						.error(()=>{console.log($scope.routes.post.persona+' : No Data');})
						.success((json)=>{if(json.result){
							$scope.lista.unshift({
								id:json.rows.id,
								nombres:json.rows.nombres,
								apellidos:json.rows.apellidos,
								funcion:json.rows.funcion
							});
						}});
				});
				$scope.forms.personalListar.display=true;
			}
		},
		personalModificar:{
			display:false,
			cancelar:()=>{
				$scope.modelo.id=null;
				$scope.displayFalse();
				$scope.forms.personalListar.display=true;
			},
			aceptar:()=>{
				$scope.displayFalse();
				uri = $scope.routes.put.persona+$scope.modelo.id;
				$http
					.put(uri,$scope.modelo)
					.error(()=>{console.log(uri+' : No Data');})
					.success((json)=>{if(json.result){
						$scope.lista.splice($scope.modelo.key,1);
						$scope.lista.unshift({
							id:json.rows.id,
							nombres:json.rows.nombres,
							apellidos:json.rows.apellidos,
							funcion:json.rows.funcion
						});
						$scope.forms.personalListar.display=true;
					}});
			}
		},
		personalVisualizar:{
			display:false,
			aceptar:()=>{
				$scope.displayFalse();
				$scope.forms.personalListar.display=true;
			},
		
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
				$scope.forms.actividadNuevo.display=true;
			},
			visualizarPersona:(k)=>{
				id = $scope.lista[k].id;
				$scope.displayFalse();
				$http
					.get($scope.routes.get.actividad+id)
					.error(()=>{console.log($scope.routes.get.actividad+id+' : No Data');})
					.success((json)=>{if(json.result){
						$scope.modelo.id=json.rows.id;
						$scope.modelo.nombres=json.rows.nombres;
						$scope.modelo.apellidos=json.rows.apellidos;
						$scope.modelo.funcion=json.rows.funcion;
						$scope.forms.actividadVisualizar.display=true;
					}});
			},
			modificarPersona:(k)=>{
				$scope.modelo.key=k;
				$scope.modelo.id=$scope.lista[k].id;
				$scope.displayFalse();
				$scope.dialogs.autorizarModificar.display=true;
			},
			activarPersona:(k)=>{
				$scope.modelo.key=k;
				$scope.modelo.id=$scope.lista[k].id
				$scope.displayFalse();
				$scope.dialogs.autorizarActivar.display=true;
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
		$scope.statusbar.display=false;
		$scope.dialogs.autorizarModificar.display=false;
		$scope.dialogs.autorizarEliminar.display=false;
		$scope.forms.personalNuevo.display=false;
		$scope.forms.personalModificar.display=false;
		$scope.forms.personalVisualizar.display=false;
		$scope.forms.personalListar.display=false;
	};

	$scope.init = ()=>{
		data = $session.get('user');
		$scope.user = JSON.parse(data);
		$rootScope.usuario = $scope.user.usuario;
		$rootScope.stage=true;
		$scope.displayFalse();
		uri = $scope.routes.get.personal;
		$http
			.get(uri)
			.error(()=>{console.log(uri+' : No Data');})
			.success((json)=>{if(json.result){
				for(i in json.rows){
					$scope.lista.push({
						id:json.rows[i].id,
						nombres:json.rows[i].nombres,
						apellidos:json.rows[i].apellidos,
						funcion:json.rows[i].funcion
					});
				}
				
			}});
		$scope.forms.personalListar.display=true;
	};

	$session.autorize(()=>{
		$scope.init();
	});	

});