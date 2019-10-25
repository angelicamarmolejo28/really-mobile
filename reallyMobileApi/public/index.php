<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

// Instantiate App
$app = AppFactory::create();

// Add error middleware
$app->addErrorMiddleware(true, true, true);

$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

// Add routes
$app->post('/personas/evaluar', function (Request $request, Response $response) {
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

$app->post('/empresas/evaluar', function (Request $request, Response $response) {
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
