<?php
    require 'vendor/autoload.php';

    use Slim\Factory\AppFactory;
    use Psr\Http\Message\ServerRequestInterface as Request;
    use Psr\Http\Message\ResponseInterface as Response;

    $app = AppFactory::create();
    $app->addRoutingMiddleware();

    // Display errors
    $app->addErrorMiddleware(true, true, true);

    $mysqli = require 'utils/connect.php';

    $app->get('/', function (Request $request, Response $response) {
        $response->getBody()->write(file_get_contents('public/index.html'));
        return $response;
    });

    $app->get('/score', function (Request $request, Response $response) {

        $stmt = $GLOBALS['mysqli']->prepare('SELECT Name, Score FROM scoreboard ORDER BY score DESC LIMIT 10');

        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {

            $scoreboard;
            while($row = $result->fetch_row()) {
                $scoreboard[] = $row;
            }

            $response->getBody()->write(json_encode($scoreboard));
        } else {
            $output = new stdClass();
            $output->error = 'Failed to connect';
            $response->getBody()->write(json_encode($output));
        }

        return $response;
    });

    $app->post('/score', function (Request $request, Response $response) {

        $output = new stdClass();

        $json = file_get_contents('php://input');
        $data = json_decode($json);

        if (empty($data->name) || empty($data->score)) {
            $output->error = 'Name or score not set!';
            $response->getBody()->write(json_encode($output));
            return $response;
        }

        $stmt = $GLOBALS['mysqli']->prepare('INSERT INTO scoreboard (Name, Score, Date) VALUES (?, ?, NOW());');
        $stmt->bind_param('ss', $data->name, $data->score);

        $stmt->execute();
        $result = $stmt->affected_rows;

        if ($result === 1) {
            $output->success = 'Score submitted.';
            $response->getBody()->write(json_encode($output));
        } else {
            $output->error = 'Failed to submit score.';
            $response->getBody()->write(json_encode($output));
        }

        return $response;
    });

    $app->get('/favicon.ico', function (Request $request, Response $response) {
        $response->getBody()->write(file_get_contents('public/favicon.ico'));
        return $response;
    });

    $app->get('/js/{file}', function (Request $request, Response $response, $args) {
        $filePath = 'public/js/' . $args['file'];
        $newResponse = $response->withHeader('Content-Type', 'application/javascript; charset=UTF-8');
        $newResponse->getBody()->write(file_get_contents($filePath));
        return $newResponse;
    });

    $app->get('/css/{file}', function (Request $request, Response $response, $args) {
        $filePath = 'public/css/' . $args['file'];
        $newResponse = $response->withHeader('Content-Type', 'text/css; charset=UTF-8');
        $newResponse->getBody()->write(file_get_contents($filePath));
        return $newResponse;
    });

    // used to serve static files in local development
    if (php_sapi_name() == 'cli-server') {
        $app->get('/images/[{year}[/{file}]]', function (Request $request, Response $response, $args) {
            if (!empty($args['file'])) {
                $filePath = 'public/images/' . $args['year'] . '/' . $args['file'];
            } else  {
                $filePath = 'public/images/' . $args['year'];
            }
            $newResponse = $response->withHeader('Content-Type', 'text/css; charset=UTF-8');
            $newResponse->getBody()->write(file_get_contents($filePath));
            return $newResponse;
        });
    }

    // Bootstrap the slim framework to handle the request.
    $app->run();