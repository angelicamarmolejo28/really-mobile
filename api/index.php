<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';
require_once('db.php');

// Instantiate App
$app = AppFactory::create();
// Add error middleware
$app->addErrorMiddleware(true, true, true);

$app->options('/really-mobile/api/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

$app->get('/really-mobile/api/users', function (Request $request, Response $response) {
    $tipo = $request->getQueryParam('tipo');
    $codigo = $request->getQueryParam('codigo');
    $db = new Db();
    $data = json_encode($db->encontrarUsuario($tipo, $codigo));
    $response->getBody()->write($data);
    return $response;
});

$app->post('/really-mobile/api/users', function (Request $request, Response $response) {
    $body = $request->getBody();
    $res      = json_decode($body);

    if($res->tipo && $res->codigo && $res->nombre){
        $db = new Db();
        $data = json_encode($db->crearUsuario($res->tipo, $res->codigo, $res->nombre));
        $response->getBody()->write($data);
    } else {
        $response->getBody()->write(null);
    }

    return $response;
});

$app->put('/really-mobile/api/users/{id}', function (Request $request, Response $response) {
    $route = $request->getAttribute('route');
    $usuarioId = $route->getArgument('id');
    $body = $request->getBody();
    $res      = json_decode($body);

    if($usuarioId && $res->tipo && $res->codigo && $res->nombre){
        $db = new Db();
        $data = json_encode($db->actualizarUsuario($usuarioId, $res->tipo, $res->codigo, $res->nombre));
        $response->getBody()->write($data);
    } else {
        $response->getBody()->write(null);
    }

    return $response;
});

$app->delete('/really-mobile/api/users/{id}', function (Request $request, Response $response) {
    $route = $request->getAttribute('route');
    $usuarioId = $route->getArgument('id');
    if($usuarioId){
        $db = new Db();
        $data = json_encode($db->eliminarUsuario($usuarioId));
        $response->getBody()->write($data);
    } else {
        $response->getBody()->write(null);
    }

    return $response;
});

// Add routes
$app->post('/really-mobile/api/personas/evaluar', function (Request $request, Response $response) {
    $body = $request->getBody();
    $res      = json_decode($body);
    $res->descuento = 0;
    $res->cantidad = 0;
    if($res->internet->valor > 0){
        $res->cantidad++;
    }
    if($res->telefonia->valor > 0){
        $res->cantidad++;
    }
    if($res->moviles->valor > 0){
        $res->cantidad++;
    }
    if($res->television->valor > 0){
        $res->cantidad++;
    }

    if($res->cantidad === 4){
        $res->descuento  = 20;
    } elseif($res->cantidad === 3){
        $res->descuento  = 15;
    } elseif($res->cantidad === 2){
        $res->descuento  = 10;
    } elseif($res->cantidad === 1){
        $res->descuento  = 5;
    }

    $response->getBody()->write(json_encode($res));

    return $response;
});

$app->post('/really-mobile/api/empresas/evaluar', function (Request $request, Response $response) {
    $body = $request->getBody();
    $res      = json_decode($body);
    $res->descuento = 0;
    $res->cantidad = 0;
    if($res->internet->valor > 0){
        $res->cantidad++;
    }
    if($res->telefonia->valor > 0){
        $res->cantidad++;
    }
    if($res->moviles->valor > 0){
        $res->cantidad++;
    }
    if($res->television->valor > 0){
        $res->cantidad++;
    }

    if($res->cantidad === 4){
        $res->descuento  = 30;
    } elseif($res->cantidad === 3){
        $res->descuento  = 25;
    } elseif($res->cantidad === 2){
        $res->descuento  = 15;
    } elseif($res->cantidad === 1){
        $res->descuento  = 5;
    }

    $response->getBody()->write(json_encode($res));

    return $response;
});

$app->run();
